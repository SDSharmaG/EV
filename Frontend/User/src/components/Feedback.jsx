import React, { useEffect, useState } from "react";

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_BASE_URL + "/api/feedback/adminfeedback");
      const data = await res.json();

      if (data.success) {
        setFeedbacks(data.data);
      }
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading feedbacks...</p>;

  return (
    <div className="container mt-4">
      <h3 className="mb-4">⭐ User Feedback</h3>

      {feedbacks.length === 0 ? (
        <p>No feedback available</p>
      ) : (
        <div className="row">
          {feedbacks.map((fb) => (
            <div className="col-md-6 mb-3" key={fb.id}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">
                    {fb.userName} ({fb.userEmail})
                  </h5>

                  <p className="mb-1">
                    <strong>Station:</strong> {fb.stationName}
                  </p>
                  <p className="mb-1">
                    <strong>Charger:</strong> {fb.chargerName}
                  </p>

                  <p className="mb-1">
                    <strong>Rating:</strong> ⭐ {fb.rating}/5
                  </p>

                  <p className="mt-2">
                    <strong>Comment:</strong> {fb.comment}
                  </p>

                  <small className="text-muted">
                    {new Date(fb.createdAt).toLocaleString()}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackList;
