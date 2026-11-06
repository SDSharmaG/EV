// src/components/UserNotifications.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserNotifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  /* ===============================
     Fetch user notifications
  =============================== */
  const fetchUserNotifications = async () => {
    if (!userId) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/notifications/user/${userId}`
      );
      const data = await response.json();
      if (data.success) {
        setNotifications(data.data);
      }
    } catch (error) {
      console.error("❌ Failed to fetch user notifications:", error);
    }
  };

  useEffect(() => {
    fetchUserNotifications();

    // Refresh every 5 seconds
    const interval = setInterval(() => {
      fetchUserNotifications();
    }, 5000);

    return () => clearInterval(interval);
  }, [userId]);

  if (!userId) {
    return <p className="text-danger">Please login to see notifications</p>;
  }

  /* ===============================
     Optional: mark notification as read
  =============================== */
  const handleView = async (notificationId, route = "/layout/payments") => {
    try {
      // Mark notification as read
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/notifications/${notificationId}/read`, {
        method: "PUT",
      });

      // Refresh notifications
      fetchUserNotifications();

      // Navigate to the target route
      navigate(route);
    } catch (err) {
      console.error("❌ Failed to mark notification as read:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h3>🔔 Your Notifications</h3>

      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <ul className="list-group">
          {notifications.map((note) => {
            const isRead = note.status === 1; // status: 0 = unread, 1 = read
            return (
              <li
                key={note._id}
                className={`list-group-item d-flex justify-content-between align-items-center ${
                  !isRead ? "fw-bold bg-light" : ""
                }`}
              >
                <div>
                  {note.message}
                  <br />
                  <small>{new Date(note.createdAt).toLocaleString()}</small>
                </div>
                <div>
                  <button
                    className="btn btn-sm btn-link"
                    onClick={() => handleView(note._id)}
                  >
                    View
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default UserNotifications;
