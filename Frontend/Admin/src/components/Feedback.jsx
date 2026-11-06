import React, { useEffect, useState } from "react";

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_API_BASE_URL + "/api/feedback/adminfeedback"
        );
        const data = await response.json();
        if (data.success) {
          setFeedbacks(data.data);
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">User Feedback</h2>

      {feedbacks.length === 0 ? (
        <div className="alert alert-warning text-center">
          No feedback available
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr className="text-center">
                <th>User</th>
                <th>Email</th>
                <th>Station</th>
                <th>Charger</th>
                <th>Rating</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {feedbacks.map((fb) => (
                <tr key={fb.id}>
                  <td>{fb.userName}</td>
                  <td>{fb.userEmail}</td>
                  <td>{fb.stationName}</td>
                  <td>{fb.chargerName}</td>
                  <td className="text-center">
                    <span className="badge bg-success">
                      {fb.rating} ⭐
                    </span>
                  </td>
                  <td>{fb.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Feedback;
