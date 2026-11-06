// CreateBooking.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import FeedbackForm from "../Feedbackform"; // Import the feedback form

const generateTimeSlots = () => {
  const slots = [];
  const startHour = 6;
  const endHour = 22;

  for (let hour = startHour; hour < endHour; hour += 2) {
    slots.push({
      hour,
      start: `${hour.toString().padStart(2, "0")}:00`,
      end: `${(hour + 2).toString().padStart(2, "0")}:00`,
      label: `${hour.toString().padStart(2, "0")}:00 - ${(hour + 2)
        .toString()
        .padStart(2, "0")}:00`,
    });
  }
  return slots;
};

const CreateBooking = () => {
  const { state } = useLocation();
  // const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [station, setStation] = useState(null);
  const [charger, setCharger] = useState(null);
  const [vehicleType, setVehicleType] = useState("");
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [bookingPaid, setBookingPaid] = useState(false); // For redirecting to feedback
  const [bookingId, setBookingId] = useState(null);
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const slots = generateTimeSlots();

  useEffect(() => {
    if (state?.station && state?.charger) {
      setStation(state.station);
      setCharger(state.charger);
      fetchBookedSlots(state.charger._id || state.charger.id);
    }
  }, [state]);

  const fetchBookedSlots = async (chargerId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/bookings/charger/${chargerId}`
      );
      const data = await res.json();
      if (data.success) setBookedSlots(data.bookings || []);
    } catch (err) {
      console.error("Error fetching booked slots:", err);
    }
  };

  const handleSlotClick = (slot, index) => {
    const isBooked = bookedSlots.some(
      (b) =>
        slot.start >= b.startTime.slice(11, 16) &&
        slot.end <= b.endTime.slice(11, 16)
    );
    if (isBooked) return;

    if (selectedSlots.length === 0) {
      setSelectedSlots([{ ...slot, index }]);
      return;
    }

    if (selectedSlots.length >= 4) {
      alert("⚠ Maximum 4 slots allowed");
      return;
    }

    const lastIndex = selectedSlots[selectedSlots.length - 1].index;

    if (index === lastIndex + 1) {
      setSelectedSlots([...selectedSlots, { ...slot, index }]);
    } else {
      setSelectedSlots([{ ...slot, index }]);
    }
  };

  const startTime = selectedSlots[0]?.start || "";
  const endTime = selectedSlots[selectedSlots.length - 1]?.end || "";
  const totalHours = selectedSlots.length * 2;
  const totalCost = charger ? (totalHours * charger.rate).toFixed(2) : 0;

  const today = new Date().toISOString().split("T")[0];
  const startDateTime = startTime ? new Date(`${today}T${startTime}:00`) : null;
  const endDateTime = endTime ? new Date(`${today}T${endTime}:00`) : null;

  const formattedStart = startDateTime
    ? startDateTime.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "";
  const formattedEnd = endDateTime
    ? endDateTime.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const createBooking = async (otpVerificationToken) => {
    try {
      const res = await fetch(import.meta.env.VITE_API_BASE_URL + "/api/bookings/create", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          stationId: station._id || station.id,
          chargerId: charger._id || charger.id,
          startTime: startDateTime,
          endTime: endDateTime,
          vehicleType,
          totalCost,
          otpVerificationToken,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("🎉 Booking Successful! & wait for Admin Confirmation !!");
        setBookingPaid(true); // Trigger feedback form
        setBookingId(data.booking._id); // Save booking ID for feedback
      } else {
        setBookingError(data.message || "Booking failed.");
      }
    } catch (err) {
      console.error(err);
      setBookingError("Server error while creating booking.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBookingError("");

    if (!user) return setBookingError("Please login first.");
    if (selectedSlots.length < 1)
      return setBookingError("Select at least one time slot.");

    setSubmitting(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/booking-otp/request`,
        {
          method: "POST",
          headers: authHeaders(),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setBookingError(data.message || "Could not send verification code.");
        return;
      }
      setOtpRequested(true);
    } catch (err) {
      console.error("Booking OTP request failed:", err);
      setBookingError("Could not send verification code.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyAndBook = async (e) => {
    e.preventDefault();
    setBookingError("");
    setSubmitting(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/booking-otp/verify`,
        {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({ code: otpCode }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setBookingError(data.message || "Could not verify code.");
        return;
      }
      await createBooking(data.verificationToken);
    } catch (err) {
      console.error("Booking OTP verification failed:", err);
      setBookingError("Could not verify code.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user)
    return <p className="text-center mt-5 text-danger">Login required</p>;
  if (!station || !charger)
    return <p className="text-center mt-5 text-danger">Invalid data</p>;

  if (bookingPaid && bookingId) {
    return <FeedbackForm bookingId={bookingId} userId={user._id} />;
  }

  return (
    <div className="container mt-4" style={{ maxWidth: "700px" }}>
      <h3>📝 Create Booking</h3>

      <div className="card p-3 mb-4 shadow-sm">
        <p>
          <strong>Station:</strong> {station.name}
        </p>
        <p>
          <strong>Charger:</strong> {charger.chargername}
        </p>
        <p>
          <strong>Rate:</strong> ₹{charger.rate}/hr
        </p>
      </div>

      {bookingError && <div className="alert alert-danger">{bookingError}</div>}
      {!otpRequested ? (
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="fw-bold d-block mb-2">
            🎭 Select Time Slots (Click Multiple)
          </label>

          <div className="d-flex flex-wrap gap-2">
            {slots.map((slot, index) => {
              const isSelected = selectedSlots.some((s) => s.index === index);
              const isBooked = bookedSlots.some(
                (b) =>
                  slot.start >= b.startTime.slice(11, 16) &&
                  slot.end <= b.endTime.slice(11, 16)
              );

              return (
                <button
                  key={index}
                  type="button"
                  disabled={isBooked}
                  className={`btn ${
                    isSelected ? "btn-primary" : "btn-outline-primary"
                  } ${isBooked ? "btn-secondary disabled" : ""}`}
                  onClick={() => handleSlotClick(slot, index)}
                >
                  {slot.label} {isBooked ? "⚠ Booked" : ""}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-3">
          <label>Vehicle Type</label>
          <select
            className="form-select"
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            required
          >
            <option value="">Select Vehicle</option>
            <option value="EV Car">EV Car</option>
            <option value="EV Bike">EV Bike</option>
            <option value="EV Scooter">EV Scooter</option>
          </select>
        </div>

        {selectedSlots.length > 0 && (
          <div className="alert alert-info">
            ⏰ <strong>Time:</strong> {formattedStart} - {formattedEnd} <br />
            🕒 <strong>Hours:</strong> {totalHours} <br />
            💰 <strong>Total:</strong> ₹{totalCost}
          </div>
        )}

        <button type="submit" className="btn btn-success w-100" disabled={submitting}>
          {submitting ? "Sending code..." : "Confirm Booking"}
        </button>
      </form>
      ) : (
        <form onSubmit={handleVerifyAndBook}>
          <div className="alert alert-info">
            Verification code unga account email-ku anuppiyirukkom. Code 10 minutes-ku valid.
          </div>
          <label htmlFor="booking-otp" className="form-label">Email verification code</label>
          <input
            id="booking-otp"
            className="form-control mb-3"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            pattern="[0-9]{6}"
            value={otpCode}
            onChange={(event) => setOtpCode(event.target.value.replace(/\D/g, ""))}
            required
          />
          <button type="submit" className="btn btn-success w-100" disabled={submitting}>
            {submitting ? "Verifying..." : "Verify & Confirm Booking"}
          </button>
          <button
            type="button"
            className="btn btn-link w-100 mt-2"
            onClick={() => {
              setOtpRequested(false);
              setOtpCode("");
            }}
            disabled={submitting}
          >
            Back
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateBooking;
