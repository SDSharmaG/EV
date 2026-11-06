const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(express.json());
// CORS configuration to allow cookies from frontend
const allowedOrigins = process.env.FRONTEND_URLS 
  ? process.env.FRONTEND_URLS.split(',').map((origin) => origin.trim()).filter(Boolean)
  : [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174",
    ];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use("/uploads/users", express.static(path.join(__dirname, "uploads")));

app.use("/bills", express.static(path.join(__dirname, "bills")));

//routes
const Adminroutes = require("./Routes/adminroutes");
app.use("/api/admin", Adminroutes);

const profileroutes = require("./Routes/profileroutes");
app.use("/api/admin", profileroutes);

const stationroutes = require("./Routes/stationroutes");
app.use("/api/admin", stationroutes);

const chargerroutes = require("./Routes/chargerroutes");
app.use("/api/admin", chargerroutes);

const userRoutes = require("./Routes/userroutes");
app.use("/api", userRoutes);

const notificationRoutes = require("./Routes/notificationroutes");
app.use("/api", notificationRoutes);

const bookingroutes = require("./Routes/Bookingroutes");
app.use("/api/bookings", bookingroutes);

const billroutes = require("./Routes/Billroutes");
app.use("/api/bills", billroutes);

const feedbackroutes = require("./Routes/feedbackroutes");
app.use("/api/feedback", feedbackroutes);

const adminreports = require("./Routes/AdminReportsroutes");
app.use("/api", adminreports);

const contactroutes = require("./Routes/contactRoutes");
app.use("/api", contactroutes);

const offerroutes = require("./Routes/offerroutes");
app.use("/api/offers", offerroutes);

const authroutes = require("./Routes/authroutes");
app.use("/api/auth", authroutes);

module.exports = app;
