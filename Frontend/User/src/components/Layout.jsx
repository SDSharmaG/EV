import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import evimg from "./images/electric.png";
import "./css/Layout.css";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Load user data on component mount
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData && userData !== "undefined") {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("User parse error:", error);
      }
    }
  }, []);
  useEffect(() => {
    if (!user?._id) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/notifications/user/${user._id}`
        );
        const data = await res.json();
        if (data.success) setNotifications(data.data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000); // every 5 seconds
    return () => clearInterval(interval);
  }, [user]);
  // to unread count
  const unreadCount = notifications.filter((n) => n.status===0).length;

  // const storedUser = localStorage.getItem("user");

  const navItems = [
    // { path: "/layout/dashboard", label: "Dashboard", icon: "bi-speedometer2" },
    { path: "/layout/stations", label: "Stations", icon: "bi-ev-station" },
    { path: "/layout/payments", label: "Payments", icon: "bi-credit-card" },
    { path: "/layout/feedback", label: "Feedback", icon: "bi-chat-left-text" },
    { path: "/layout/settings", label: "Settings", icon: "bi-gear" },
  ];

  const handleSettingsClick = () => {
    navigate("/layout/settings");
  };

  const handleAnyClick = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signup");
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      // Call logout API if token exists
      if (token) {
        await fetch(import.meta.env.VITE_API_BASE_URL + "/api/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
      }

      // Clear local storage
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      // Redirect to login page
      navigate("/");
    } catch (error) {
      console.error("Logout Error:", error);
      // Still clear local storage and redirect even if API call fails
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/");
    }
  };
  useEffect(() => {
    const loadUser = () => {
      const userData = localStorage.getItem("user");
      if (userData && userData !== "undefined") {
        setUser(JSON.parse(userData));
      }
    };

    loadUser();
  }, [location.pathname]);

  const handleProfile = () => {
    navigate("/layout/profileme");
  };

  // Get current page title
  const getCurrentPageTitle = () => {
    const currentItem = navItems.find(
      (item) => item.path === location.pathname
    );
    return currentItem?.label || "Dashboard";
  };

  // Get user display name
  const getUserDisplayName = () => {
    return user?.name || "User";
  };

  return (
    <div className="layout-container d-flex">
      {/* Sidebar Navigation */}
      <div className="sidebar" style={{ width: "250px" }}>
        <div className="sidebar-header">
          <div className="d-flex align-items-center justify-content-start w-100">
            {/* Image Container */}
            <div className="sidebar-image-container d-flex align-items-center justify-content-center me-3">
              <img
                src={evimg}
                alt="EV Charger Logo"
                className="sidebar-logo img-fluid w-100"
              />
            </div>

            {/* Text Container */}
            <div className="sidebar-text-container d-flex flex-column justify-content-center">
              <h4 className="sidebar-title mb-0 text-white">EV CHARGER</h4>
              <small className="sidebar-subtitle opacity-75 text-white">
                Booking Station
              </small>
            </div>
          </div>
        </div>

        <nav className="nav flex-column p-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link-custom nav-link d-flex align-items-center py-3 mb-1 ${
                location.pathname === item.path ? "active" : ""
              }`}
              onClick={handleAnyClick}
            >
              <i className={`${item.icon} me-3 fs-6`}></i>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="main-content flex-grow-1 d-flex flex-column">
        {/* Top Header */}
        <header className="main-header py-3 px-4">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="header-title mb-0 fw-bold text-dark">
              {getCurrentPageTitle()}
            </h5>
            <div className="d-flex align-items-center gap-3">
              {/* Notification Bell */}
              <div className="dropdown">
                <button
                  className="notification-bell btn btn-outline-secondary btn-sm position-relative border-0"
                  type="button"
                  id="notificationDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-bell fs-6"></i>
                  {unreadCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {unreadCount}
                      <span className="visually-hidden">
                        unread notifications
                      </span>
                    </span>
                  )}
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end shadow"
                  aria-labelledby="notificationDropdown"
                  style={{ minWidth: "250px" }}
                >
                 {notifications.slice(0, 5).map((note) => (
  <li key={note._id}>
    <button
      className={`dropdown-item d-flex flex-column ${
        note.status === 0 ? "fw-bold" : ""
      }`}
      onClick={async () => {

        // ✅ Mark as read
        if (note.status === 0) {
          await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/notifications/${note._id}/read`,
            { method: "PUT" }
          );

          setNotifications((prev) =>
            prev.map((n) =>
              n._id === note._id ? { ...n, status: 1 } : n
            )
          );
        }

        // ✅ Navigate
        if (note.type === "feedback") {
          navigate("/layout/feedback", {
            state: { bookingId: note.bookingId },
          });
        } else {
          navigate("/layout/notification");
        }
      }}
    >
      <span>{note.message}</span>
      <small className="text-muted">
        {new Date(note.createdAt).toLocaleString()}
      </small>
    </button>
  </li>
))}

                </ul>
              </div>

              {/* User Dropdown */}
              <div className="dropdown">
                <button
                  className="user-dropdown-toggle btn btn-outline-secondary btn-sm dropdown-toggle d-flex align-items-center gap-2 border-0"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {user && user?.profileImage ? (
                    <img
                      src={
                        user.profileImage.startsWith("http")
                          ? user.profileImage
                          : `${import.meta.env.VITE_API_BASE_URL}/uploads/Users/${user.profileImage}`
                      }
                      alt="Profile"
                      className="rounded-circle"
                      style={{
                        width: "32px",
                        height: "32px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <i className="bi bi-person-circle fs-4"></i>
                  )}

                  <span className="d-none d-sm-inline">
                    {getUserDisplayName()}
                  </span>
                </button>

                <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                  <li>
                    <button
                      className="dropdown-item d-flex align-items-center py-2"
                      onClick={handleProfile}
                    >
                      <i className="bi bi-person me-2"></i>
                      Profile
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item d-flex align-items-center py-2"
                      onClick={handleSettingsClick}
                    >
                      <i className="bi bi-gear me-2"></i>
                      Settings
                    </button>
                  </li>
                  <li>
                    <hr className="dropdown-divider my-1" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item d-flex align-items-center py-2 text-danger"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="content-area flex-grow-1 p-4 bg-light">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
