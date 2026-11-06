import React, { useEffect, useState } from "react";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_BASE_URL + "/api/bookings/all");
      const data = await res.json();
      setBookings(data.data);
      console.log(data)
    } catch {
      setError("Failed to load bookings.");
    }
  };

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(() => {
    fetchBookings();
    }, 5000); // refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (data.success) {
        fetchBookings();
      }
    } catch {
      alert("Failed to update booking.");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-3">⚙️ Manage Bookings (Admin)</h3>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>User</th>
              <th>Station</th>
              <th>Vehicle</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
<tbody>
  {Array.isArray(bookings) && bookings.length > 0 ? (
    bookings.map((b) => (
      <tr key={b._id}>
        <td>{b.userId?.name || "N/A"}</td>
        <td>{b.stationId?.name || "N/A"}</td>
        <td>{b.vehicleType || "N/A"}</td>
        <td>{b.startTime || "N/A"}</td>
        <td>{b.endTime || "N/A"}</td>
        <td>
          <span
            className={`badge ${
              b.status === "paid"
                ? "bg-success"
                : b.status === "rejected"
                ? "bg-danger"
                : "bg-warning text-dark"
            }`}
          >
            {b.status}
          </span>
        </td>
        <td>
          <button
            className="btn btn-success btn-sm me-2"
            disabled={b.status !== "pending"}
            onClick={() => updateStatus(b._id, "paid")}
          >
            Approve
          </button>
          <button
            className="btn btn-danger btn-sm"
            disabled={b.status !== "pending"}
            onClick={() => updateStatus(b._id, "rejected")}
          >
            Reject
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="7" className="text-center text-muted">
        No bookings found.
      </td>
    </tr>
  )}
</tbody>

        </table>
      </div>
    </div>
  );
};

export default BookingList;
