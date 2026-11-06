import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FeedbackForm = ({ bookingId, userId }) => {
    const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(import.meta.env.VITE_API_BASE_URL + "/api/feedback/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, rating, comment }),
      });
      const data = await res.json();
      if (data.success) {
        alert("🎉 Feedback submitted successfully!");
        navigate('/layout/stations')
      } else {
        alert("⚠ " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("⚠ Server error");
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "600px" }}>
      <h3>📝 Submit Feedback</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Rating</label>
          <select
            className="form-select"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} Star{r > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label>Comment</label>
          <textarea
            className="form-control"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-success w-100">
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
