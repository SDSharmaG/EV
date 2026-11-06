import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import charger from "../assets/images/charger.png";
import "./css/Layout.css";
import Logout from "./Logout/Logout";
import Profile from "./Profile";

const Layout = () => {
  const navigate = useNavigate();

  const [showProfile, setShowProfile] = useState(false);
  const [showNotifBox, setShowNotifBox] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  /* ===============================
     Fetch Admin Notifications
  =============================== */
  const fetchAdminNotifications = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_BASE_URL + "/api/notifications/admin");
      const data = await res.json();

      if (data.success) {
        setNotifications(data.data);
        const unread = data.data.filter(n => n.status === 0).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error("❌ Notification fetch failed", err);
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
      fetchAdminNotifications();
      navigate("/bookingslist");
      setShowNotifBox(false);
    } catch (err) {
      console.error("❌ Failed to mark read", err);
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
    <div className="container-fluid p-0">
      <div className="row g-0">

        {/* ================= Sidebar ================= */}
        <nav className="col-lg-2 col-md-3 d-md-block bg-light sidebar collapse" id="sidebarMenu">
          <div className="position-sticky p-3">
            <div className="d-flex align-items-center gap-2 mb-4">
              <img src={charger} className="sidebar-logo" alt="logo" />
              <h5 className="m-0">Admin</h5>
            </div>

            <ul className="nav flex-column sidebar-menu">
              <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
              <li><Link to="/stations" className="nav-link">Stations</Link></li>
              <li><Link to="/chargers" className="nav-link">Chargers</Link></li>
              <li><Link to="/bookingslist" className="nav-link">Bookings</Link></li>
              <li><Link to="/payments" className="nav-link">Payments</Link></li>
              <li><Link to="/adminnotification" className="nav-link">Notifications</Link></li>
              <li><Link to="/users" className="nav-link">Users</Link></li>
              <li><Link to="/feedback" className="nav-link">Feedback</Link></li>
              <li><Link to="/reports" className="nav-link">Reports</Link></li>
              <li><Link to="/offers" className="nav-link">Offers</Link></li>
            </ul>
          </div>
        </nav>

        {/* ================= Main ================= */}
        <main className="col-lg-10 col-md-9 ms-sm-auto px-md-4 main-content">

          {/* ---------- Top Navbar ---------- */}
          <nav className="navbar navbar-light bg-white border-bottom sticky-top">
            <div className="container-fluid">

              <button
                className="navbar-toggler d-md-none"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#sidebarMenu"
              >
                <span className="navbar-toggler-icon"></span>
              </button>

              {/* Right icons */}
              <div className="d-flex align-items-center gap-3 ms-auto">

                {/* Notification */}
                <div
                  className="notification-icon position-relative"
                  onClick={() => setShowNotifBox(!showNotifBox)}
                >
                  <i className="bi bi-bell fs-4"></i>

                  {unreadCount > 0 && (
                    <span className="notification-badge">
                      {unreadCount}
                    </span>
                  )}
                </div>

                <Logout />

                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => navigate("/profile")}
                >
                  Profile
                </button>
              </div>
            </div>
          </nav>

          {/* ---------- Notification Dropdown ---------- */}
          {showNotifBox && (
            <div className="notification-box shadow">
              <h6 className="border-bottom pb-2">Notifications</h6>

              {notifications.length === 0 ? (
                <p className="text-muted small">No notifications</p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n._id}
                    className={`notification-item ${n.status === 0 ? "fw-bold" : ""}`}
                    onClick={() => markAsRead(n._id)}
                  >
                    {n.message}
                  </div>
                ))
              )}
            </div>
          )}

          {/* ---------- Page Content ---------- */}
          <div className="pt-4">
            <Outlet />
          </div>
        </main>
      </div>

      {/* ================= Profile Modal ================= */}
      {showProfile && (
        <div className="modal fade show d-block">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Profile</h5>
                <button className="btn-close" onClick={() => setShowProfile(false)}></button>
              </div>
              <div className="modal-body">
                <Profile />
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}
    </div>
  );
};

export default Layout;
