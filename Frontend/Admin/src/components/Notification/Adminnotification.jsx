import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  /* ===============================
     Fetch admin notifications
  =============================== */
  const fetchAdminNotifications = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_BASE_URL + "/api/notifications/admin");
      const data = await res.json();

      if (data.success) {
        setNotifications(data.data);
      }
    } catch (err) {
      console.error("❌ Failed to load notifications:", err);
    }
  };

  /* ===============================
     Mark notification as read
  =============================== */
  const markAsRead = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/notifications/${id}/read`, {
        method: "PUT",
      });

      // Update UI instantly
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, status: 1 } : n
        )
      );
    } catch (err) {
      console.error("❌ Failed to mark as read:", err);
    }
  };

  /* ===============================
     Load notifications
  =============================== */
  useEffect(() => {
    fetchAdminNotifications();

    const interval = setInterval(fetchAdminNotifications, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mt-4">
      <h3>📩 Admin Notifications</h3>

      {notifications.length === 0 ? (
        <p>No new notifications.</p>
      ) : (
        <ul className="list-group">
          {notifications.map((note) => (
            <li
              key={note._id}
              className={`list-group-item d-flex justify-content-between align-items-start ${
                note.status === 0 ? "fw-bold bg-light" : ""
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => {
                if (note.status === 0) {
                  markAsRead(note._id); // 👈 change to read
                }
                navigate("/bookingslist");
              }}
            >
              <div>
                {note.message}
                <br />
                <small className="text-muted">
                  Booking ID: {note.bookingId}
                </small>
              </div>

              <span
                className={`badge ${
                  note.status === 1 ? "bg-success" : "bg-warning"
                }`}
              >
                {note.status === 1 ? "Read" : "New"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminNotifications;
