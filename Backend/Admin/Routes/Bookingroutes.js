// routes/bookingRoutes.js
const express = require("express");
const router = express.Router();
const { UserAuth } = require("../Middleware/userauthMiddleware");
const {
  createBooking,
  updateBookingStatus,
  getAllBookings,
  getBillPDF,
  getTotalRevenue,
  Bookingtotal,
  markAdminNotificationsRead,
} = require("../controller/Bookingcontroller");

router.post("/create", UserAuth, createBooking); // user → create booking
router.put("/:id/status", updateBookingStatus); // admin → update status
router.get("/all", getAllBookings); //admin -> details
router.get("/:billId/pdf", getBillPDF); // Get bill PDF
// Dashboard revenue
router.get("/revenue/total", getTotalRevenue);
//get total booking count
router.get("/bookingall/total", Bookingtotal);
router.get("/admin/notification/read", markAdminNotificationsRead);

module.exports = router;
