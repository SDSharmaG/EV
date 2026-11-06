import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const CreateFeedback = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [alreadyGiven, setAlreadyGiven] = useState(false);

  /* -----------------------------
     Check existing feedback
  ------------------------------ */
  useEffect(() => {
    const checkFeedback = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/feedback/booking/${bookingId}`
        );
        const data = await res.json();
        if (data.exists) {
          setAlreadyGiven(true);
        }
      } catch (err) {
        console.error(err);
      }
    };

    checkFeedback();
  }, [bookingId]);

  /* -----------------------------
     Submit Feedback
  ------------------------------ */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return alert("Login required");

    setLoading(true);

    try {
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/feedback/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user._id,
            bookingId,
            rating,
            comment,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("✅ Thank you for your feedback!");
        navigate("/layout/bookings");
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------
     Guards
  ------------------------------ */
  if (alreadyGiven) {
    return (
      <div className="container mt-5 text-center">
        <h4 className="text-success">✔ Feedback already submitted</h4>
      </div>
    );
  }

  return (
    <div className="container mt-4" style={{ maxWidth: "500px" }}>
      <h3>⭐ Give Feedback</h3>

      <form onSubmit={handleSubmit} className="card p-4 shadow">
        {/* Rating */}
        <div className="mb-3">
          <label className="fw-bold">Rating</label>
          <select
            className="form-select"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
            <option value={4}>⭐⭐⭐⭐ (4)</option>
            <option value={3}>⭐⭐⭐ (3)</option>
            <option value={2}>⭐⭐ (2)</option>
            <option value={1}>⭐ (1)</option>
          </select>
        </div>

        {/* Comment */}
        <div className="mb-3">
          <label className="fw-bold">Comment</label>
          <textarea
            className="form-control"
            rows="4"
            placeholder="Share your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="btn btn-success w-100"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
};

export default CreateFeedback;
