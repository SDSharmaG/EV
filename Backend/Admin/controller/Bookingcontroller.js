const mongoose = require("mongoose");
const Booking = require("../Model/Bookings");
const Notification = require("../Model/Notification");
const Bill = require("../Model/Bill");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const EmailVerification = require("../Model/EmailVerification");


// CREATE BOOKING
const createBooking = async (req, res) => {
  try {
    const {
      stationId,
      chargerId,
      startTime,
      endTime,
      vehicleType,
      totalCost,
      otpVerificationToken,
    } = req.body;

    if (!otpVerificationToken) {
      return res.status(400).json({
        success: false,
        message: "Verify your email before creating a booking.",
      });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    if (
      !mongoose.isValidObjectId(stationId) ||
      !mongoose.isValidObjectId(chargerId) ||
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      end <= start
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking details.",
      });
    }

    const existingBooking = await Booking.findOne({
      stationId,
      chargerId,
      startTime: { $lt: end },
      endTime: { $gt: start },
      status: { $in: ["pending", "paid"] },
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "Slot already booked. Please select another slot.",
      });
    }

    const verificationTokenHash = crypto
      .createHash("sha256")
      .update(otpVerificationToken)
      .digest("hex");
    const verifiedOtp = await EmailVerification.findOneAndUpdate(
      {
        email: req.user.email.trim().toLowerCase(),
        userId: req.user._id,
        purpose: "booking",
        verifiedAt: { $ne: null },
        verificationTokenHash,
        expiresAt: { $gt: new Date() },
        consumedAt: null,
      },
      { $set: { consumedAt: new Date() } },
      { new: true }
    );
    if (!verifiedOtp) {
      return res.status(400).json({
        success: false,
        message: "Verification expired or already used. Request a new code.",
      });
    }

    const booking = await Booking.create({
      userId: req.user._id,
      stationId,
      chargerId,
      startTime: start,
      endTime: end,
      vehicleType,
      totalCost,
      status: "pending",
    });

    
       //Create admin notification (ONLY ONCE)
    const existingAdminNote = await Notification.findOne({
      bookingId: booking._id,
      role: "admin",
      type: "new_booking",
    });

    if (!existingAdminNote) {
      await Notification.create({
        type: "new_booking",
        message: `New booking request from ${req.user.name || "User"}`,
        bookingId: booking._id,
        role: "admin",
        status: 0, // pending
      });
    }

    return res.json({
      success: true,
      message: "Booking created & admin notified",
      booking,
    });

  } catch (err) {
    console.error("CREATE BOOKING ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to create booking",
    });
  }
};

// MARK BOOKING PAID & SEND FEEDBACK NOTIFICATION
const markBookingPaid = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: "paid" },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Notify user to give feedback
    try {
      await Notification.create({
        type: "feedback",
        message: "Your booking is completed. Please give your feedback!",
        bookingId: booking._id,
        userId: booking.userId,
      });
    } catch (err) {
      console.error("User feedback notification error:", err.message);
    }

    res.json({ success: true, booking });
  } catch (err) {
    console.error("MARK BOOKING PAID ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};





// Fetch all bookings (admin)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email")
      .populate("stationId", "name")
      .populate("chargerId", "chargername");

    res.json({ success: true, data: bookings });
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update booking status (admin)
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

  
       //Validate request body
    if (!status || !["paid", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Allowed: paid | rejected",
      });
    }

    const booking = await Booking.findById(req.params.id).populate("userId");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

 
      // Prevent invalid updates
    if (booking.status === "paid") {
      return res.status(400).json({
        success: false,
        message: "Booking already approved & paid",
      });
    }

    if (booking.status === "rejected") {
      return res.status(400).json({
        success: false,
        message: "Rejected booking cannot be updated",
      });
    }


      // Update booking status

    booking.status = status;
    await booking.save();


       // Notify user
    await Notification.create({
      type: "booking_update",
      message:
        status === "paid"
          ? "Your booking has been approved and payment completed"
          : "Your booking request has been rejected",
      bookingId: booking._id,
      userId: booking.userId._id,
      role: "user",
    });

      //  STOP FLOW IF REJECTED

    if (status === "rejected") {
      return res.json({
        success: true,
        message: "Booking rejected successfully",
        booking,
      });
    }

       //Prevent duplicate bills
    let bill = await Bill.findOne({ bookingId: booking._id });
    if (bill) {
      return res.json({
        success: true,
        message: "Booking approved (bill already exists)",
        booking,
        bill,
      });
    }

      // Calculate bill amount

    const start = new Date(booking.startTime);
    const end = new Date(booking.endTime);

    const hours = Math.max(
      1,
      Math.ceil((end - start) / (1000 * 60 * 60))
    );

    const ratePerHour = booking.rate || 15.2;
    const totalAmount = booking.totalCost || hours * ratePerHour;


       //Save bill

    bill = await Bill.create({
      bookingId: booking._id,
      userId: booking.userId._id,
      amount: totalAmount,
      status: "paid",
    });

   // Ensure bills folder exists
   
    const billsDir = path.join(__dirname, "..", "bills");
    if (!fs.existsSync(billsDir)) {
      fs.mkdirSync(billsDir, { recursive: true });
    }

// Generate PDF Invoice

    const pdfPath = path.join(billsDir, `bill_${bill._id}.pdf`);
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    doc.pipe(fs.createWriteStream(pdfPath));

    doc
      .fontSize(24)
      .fillColor("#2c3e50")
      .text("EV Charging Invoice", { align: "center" });

    doc.moveDown(0.5);
    doc.fontSize(10).fillColor("gray")
      .text("EV Charge Booking System Puducherry Pvt Ltd", { align: "center" })
      .text("support@evcharge.com | +91 9876543210", { align: "center" });

    doc.moveDown(2);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();

    doc.moveDown(1.5);
    doc.fontSize(12)
      .fillColor("black")
      .text(`Invoice ID: ${bill._id}`)
      .text(`Booking ID: ${booking._id}`)
      .text(`Invoice Date: ${new Date().toLocaleString("en-IN")}`);

    doc.moveDown();
    doc.fontSize(14).text("Billed To:");
    doc.fontSize(12)
      .text(`Name: ${booking.userId.name}`)
      .text(`Email: ${booking.userId.email || "N/A"}`);

    doc.moveDown(1.5);
    doc.rect(50, doc.y, 495, 28).fill("#34495e");
    doc.fillColor("#fff")
      .text("EV Charging Service", 55, doc.y - 20)
      .text(`₹ ${bill.amount.toFixed(2)}`, 420, doc.y - 20);

    doc.moveDown(3);
    doc.fontSize(14).fillColor("green")
      .text(`Total Paid: ₹ ${bill.amount.toFixed(2)}`, { align: "right" });

    doc.moveDown(2);
    doc.fontSize(10).fillColor("gray")
      .text("Thank you for choosing our EV Charging Service ⚡", {
        align: "center",
      });

    doc.end();

// FINAL RESPONSE
    return res.json({
      success: true,
      message: "Booking approved, bill generated & PDF created",
      booking,
      bill,
      pdf: `/bills/bill_${bill._id}.pdf`,
    });

  } catch (err) {
    console.error("❌ Booking update error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



// Download bill PDF
const getBillPDF = async (req, res) => {
  try {
    const { billId } = req.params;
    const pdfPath = path.join(__dirname, "..", "bills", `bill_${billId}.pdf`);

    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ message: "PDF not found" });
    }

    res.download(pdfPath);
  } catch (err) {
    console.error("Error downloading PDF:", err);
    res.status(500).json({ message: err.message });
  }
};

//get bill by id

const getBillbyUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const bills = await Bill.find({ userId });

    res.status(200).json({
      success: true,
      data: bills,
    });
  } catch (error) {
    console.error("Error fetching bills:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Get all bills
const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find().populate("userId","name"); // Fetch all bills from DB

    res.status(200).json({
      success: true,
      data: bills,
      count: bills.length,
    });
  } catch (error) {
    console.error("Error fetching all bills:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getTotalRevenue = async (req, res) => {
  try {
    const result = await Booking.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalCost" } } }
    ]);

    res.json({
      success: true,
      totalRevenue: result[0]?.total || 0
    });
  } catch (err) {
    console.error("Revenue error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch revenue"
    });
  }
};
const Bookingtotal = async(req,res) =>{
  try{
    const count = await Booking.countDocuments();//to get total count bookings
    res.json({success:true,totalBookings:count})
  }catch(err)
  {
    console.log(err)
    res.json({success:false,message:"Server Error "})
  }
}
// const Bookingstatus = async (req, res) => {
//   try {
//     const completed = await Booking.countDocuments({ status: "paid" });
//     const pending = await Booking.countDocuments({ status: "pending" });
//     const cancelled = await Booking.countDocuments({ status: "rejected" });

//     res.json({ completed, pending, cancelled });
//   } catch (err) {
//     console.error("Booking status error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };
// MARK ADMIN NOTIFICATIONS AS READ
const markAdminNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { role: "admin", status: 0 },
      { $set: { status: 1 } }
    );

    res.json({
      success: true,
      message: "Admin notifications marked as read",
    });
  } catch (err) {
    console.error("Admin mark read error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update notifications",
    });
  }
};




module.exports = {
  createBooking,
  getAllBookings,
  updateBookingStatus,
  getBillPDF,
  getBillbyUser,
  markBookingPaid,
  getTotalRevenue,
  Bookingtotal,
  markAdminNotificationsRead,
  getAllBills
};
