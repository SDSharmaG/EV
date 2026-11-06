import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import img1 from "./images/img1.jpg";
import img2 from "./images/img2.png";
import img4 from "./images/f2.png";
import img3 from "./images/img3.jpg";
import img5 from "./images/f3.png";
import img6 from "./images/img6.png";
import contact from "./images/contactus.png";
import logo from "./images/logo.png"
import "./css/Home.css";

const Home = () => {
  const navigate = useNavigate();

  const images = [img1, img2, img3, img4, img5];
  const aboutRef = useRef(null);
    const [open, setOpen] = useState(false);
  const contactRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [offers, setOffers] = useState([]);
  const [selectedStep, setSelectedStep] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);
  // Fetch offers from backend
  const fetchOffers = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_BASE_URL + "/api/offers/all-offers");
      const data = await res.json();
      setOffers(data.data || []);
    } catch (err) {
      console.error("Error fetching offers:", err);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(import.meta.env.VITE_API_BASE_URL + "/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        alert("Message sent successfully ✅");
        setFormData({ name: "", email: "", message: "" });
      } else {
        alert("Failed to send message ❌");
      }
    } catch (error) {
      alert("Server error");
    }
  };

  return (
    <div className="home-page">
      {/* HEADER */}
      <header className="header col-12">
        <div className="d-flex align-items-center justify-content-between w-100 main-header-row">
          <div className="d-flex align-items-center logo-container">
            <img className="img-logo me-1" src={logo} alt="Logo" style={{ height: '50px', width: '65px' }} />
            <h3 className="mb-0">EV Charger & Booking - Puducherry</h3>
          </div>

          <button 
            className="menu-toggle d-md-none" 
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
          >
           <i className={open ? "bi bi-x-lg" : "bi bi-list"}></i>
          </button>

         

          <div className={`nav-menu-container ${open ? 'active' : ''}`}>
            <div className="d-flex align-items-center nav-links-wrapper">
              <h5
                className="nav-bar"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  navigate("/");
                  setOpen(false);
                }}
              >
                Home
              </h5>
              <h5
                className="nav-bar"
                onClick={() => {
                  // Check if ref exists before scrolling to avoid errors
                  if (aboutRef.current) {
                    aboutRef.current.scrollIntoView({ behavior: "smooth" });
                    setOpen(false);
                  }
                }}
              >
                About Us
              </h5>

              <h5
                className="nav-bar"
                onClick={() => {
                   if (contactRef.current) {
                    contactRef.current.scrollIntoView({ behavior: "smooth" });
                    setOpen(false);
                   }
                }}
              >
                Contact Us
              </h5>
            </div>
             <div className="auth-buttons">
              <button onClick={() => { navigate("/signup"); setOpen(false); }}>Sign Up</button>
              <button onClick={() => { navigate("/login"); setOpen(false); }}>Login</button>
            </div>
          </div>
        </div>
      </header>

      {/* HERO SLIDER */}
      {/* HERO SLIDER */}
      <section className="hero">
        <img src={images[index]} alt="EV Charging" />

        <div className="overlay">
          <h1>Find &amp; Book EV Charging Stations in Puducherry</h1>
          <p>Book EV charging stations anytime in Puducherry, anywhere.</p>
          <p>Locate,Book &amp; Charge Your EV Hassle Free</p>
          <div className="hero-buttons">
            <button onClick={() => navigate("/signup")}>Get Started</button>
            <button onClick={() => navigate("/login")}>Login</button>
          </div>
        </div>

        <span
          className="arrow left"
          onClick={() => setIndex((index - 1 + images.length) % images.length)}
        >
          ❮
        </span>
        <span
          className="arrow right"
          onClick={() => setIndex((index + 1) % images.length)}
        >
          ❯
        </span>
      </section>

      {/* CONTENT SECTION (BELOW HERO) */}
      <section className="content py-5">
        <div className="container text-center mb-5">
          <h1>Welcome to Our EV Station</h1>
          <p className="text-muted">
            Find nearby EV charging stations, book slots easily, and enjoy a
            seamless charging experience.
          </p>
        </div>

        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-4 mb-4">
              <div className="p-4 bg-white  text-center h-100">
                <i className="bi bi-ev-front-fill fs-1 text-success mb-3"></i>
                <h4>Stations Available</h4>
                <p className="text-muted">
                  Discover nearby EV charging stations with verified
                  infrastructure and trusted service quality.
                </p>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="p-4  rounded bg-white text-center h-100">
                <i className="bi bi-lightning-charge fs-1 text-success mb-3"></i>
                <h4>Chargers Available</h4>
                <p className="text-muted">
                  High-performance EV chargers ensuring safe, quick, and
                  efficient charging.
                </p>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="p-4  rounded bg-white text-center h-100">
                <i className="bi bi-people-fill fs-1 text-success mb-3"></i>
                <h4>User Interaction</h4>
                <p className="text-muted">
                  Designed for excellent user interaction with intuitive
                  navigation and real-time feedback.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="offers-section">
        <h2>Current Offers</h2>
        <div className="offers-container" onClick={() => navigate("/login")}>
          {offers.length === 0 ? (
            <p>No offers available at the moment.</p>
          ) : (
            offers.map((offer) => (
              <div className="offer-card" key={offer._id}>
                {offer.image && (
                  <img
                    src={
                      offer.imageUrl ||
                      (offer.image?.startsWith("http")
                        ? offer.image
                        : `${import.meta.env.VITE_API_BASE_URL}/uploads/offers/${offer.image}`)
                    }
                    alt={offer.title}
                  />
                )}
                <h5>{offer.title}</h5>
                <p>{offer.description}</p>
                <div className="discount">
                  {offer.discountType === "flat"
                    ? `₹${offer.discountValue} off`
                    : `${offer.discountValue}% off`}
                </div>
                <div className="validity">
                  Valid: {new Date(offer.validFrom).toLocaleDateString()} -{" "}
                  {new Date(offer.validTill).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <h1 className="text-center how p-4">How It Works</h1>

      <section className="how-it-works container">
        <div className="row justify-content-center">
          {/* STEP 1 */}
          <div className="col-md-4 mb-4">
            <div
              className="p-4 border rounded shadow-sm text-center h-100"
              style={{ cursor: "pointer" }}
              onClick={() =>
                setSelectedStep(selectedStep === "station" ? null : "station")
              }
            >
              <i className="bi bi-search fs-1 text-success mb-3"></i>
              <h4>1. Find Station</h4>
              <p className="text-muted">
                Search nearby EV charging stations in Puducherry.
              </p>

              {selectedStep === "station" && (
                <div className="mt-3 text-start">
                  <hr />
                  <p className="small text-muted">
                    Easily explore verified EV charging stations across
                    <b> Puducherry</b>. View charger types, real-time
                    availability, location maps, and station ratings before
                    selecting the best one for your vehicle.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* STEP 2 */}
          <div className="col-md-4 mb-4">
            <div
              className="p-4 border rounded shadow-sm text-center h-100"
              style={{ cursor: "pointer" }}
              onClick={() =>
                setSelectedStep(selectedStep === "booking" ? null : "booking")
              }
            >
              <i className="bi bi-calendar-check fs-1 text-success mb-3"></i>
              <h4>2. Book Slot</h4>
              <p className="text-muted">Select charger & time in Puducherry</p>

              {selectedStep === "booking" && (
                <div className="mt-3 text-start">
                  <hr />
                  <p className="small text-muted">
                    Choose your preferred charger type, select available time
                    slots, and confirm your booking instantly. Bookings are
                    securely reserved to avoid waiting at stations.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* STEP 3 */}
          <div className="col-md-4 mb-4">
            <div
              className="p-4 border rounded shadow-sm text-center h-100"
              style={{ cursor: "pointer" }}
              onClick={() =>
                setSelectedStep(selectedStep === "payment" ? null : "payment")
              }
            >
              <i className="bi bi-lightning-charge fs-1 text-success mb-3"></i>
              <h4>3. Charge & Pay</h4>
              <p className="text-muted">
                Easy and secure payment in Puducherry
              </p>

              {selectedStep === "payment" && (
                <div className="mt-3 text-start">
                  <hr />
                  <p className="small text-muted">
                    Charge your EV safely using certified chargers and complete
                    payment through secure online methods. Access your charging
                    history and invoices anytime.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* About us */}
      <section ref={aboutRef} className="content py-5">
        <div className="container">
        <h1 className="w-100 text-center about">About Us</h1>
          <div className="row align-items-center">
            {/* TEXT */}

            <div className="col-md-6 mb-4">
              <h2 className="fw-bold text-success">
                EV Charger & Booking – Puducherry
              </h2>
              <p className="text-muted mt-3">
                We are a Puducherry-focused EV Charging Station & Booking
                platform dedicated to making electric vehicle charging simple,
                reliable, and accessible for local EV users.
              </p>
              <p className="text-muted">
                Our platform allows users to find nearby charging stations,
                check charger availability, and book slots in advance—helping
                reduce waiting time and improve the EV charging experience.
              </p>
            </div>

            {/* IMAGE / ICON */}
            <div className="col-md-6 text-center">
              <img
                src={img6}
                alt="aboutus"
                className="about-img img img-fluid"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="bg-light py-5">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-6 mb-4">
              <div className="p-4 bg-white shadow rounded h-100">
                <i className="bi bi-bullseye text-success fs-1 mb-3"></i>
                <h4 className="fw-bold">Our Mission</h4>
                <p className="text-muted">
                  To promote clean and sustainable transportation in Puducherry
                  by providing an easy-to-use EV charging booking platform with
                  reliable infrastructure.
                </p>
              </div>
            </div>

            <div className="col-md-6 mb-4">
              <div className="p-4 bg-white shadow rounded h-100">
                <i className="bi bi-eye-fill text-success fs-1 mb-3"></i>
                <h4 className="fw-bold">Our Vision</h4>
                <p className="text-muted">
                  To become Puducherry’s most trusted EV charging network,
                  supporting the city’s transition towards a greener future.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* WHY PUDUCHERRY */}
      <section className="py-5">
        <div className="container text-center">
          <h2 className="fw-bold mb-4">Why Puducherry Only?</h2>
          <p className="text-muted mb-5">
            We focus exclusively on Puducherry to ensure high-quality service,
            accurate station data, and strong local EV ecosystem support.
          </p>

          <div className="row">
            <div className="col-md-3 mb-4">
              <div className="p-3 rounded h-100">
                <i className="bi bi-geo-alt-fill text-success fs-2"></i>
                <h6 className="mt-3 fw-bold">Local Focus</h6>
                <p className="small text-muted">
                  Dedicated service only within Puducherry.
                </p>
              </div>
            </div>

            <div className="col-md-3 mb-4">
              <div className="p-3 rounded h-100">
                <i className="bi bi-shield-check text-success fs-2"></i>
                <h6 className="mt-3 fw-bold">Trusted Stations</h6>
                <p className="small text-muted">
                  Verified and reliable EV charging locations.
                </p>
              </div>
            </div>

            <div className="col-md-3 mb-4">
              <div className="p-3 rounded h-100">
                <i className="bi bi-clock-fill text-success fs-2"></i>
                <h6 className="mt-3 fw-bold">Save Time</h6>
                <p className="small text-muted">
                  Book charging slots in advance.
                </p>
              </div>
            </div>

            <div className="col-md-3 mb-4">
              <div className="p-3  rounded h-100">
                <i className="bi bi-tree-fill text-success fs-2"></i>
                <h6 className="mt-3 fw-bold">Eco-Friendly</h6>
                <p className="small text-muted">
                  Supporting sustainable mobility.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2 className="fw-bold mb-3">Join the EV Revolution</h2>
        <p className="mb-4">
          Find, book, and charge your EV with confidence in Puducherry.
        </p>
        <button onClick={() => navigate("/signup")}>Get Started Now</button>
      </section>
      <section className="testimonials">
        <p>"Very easy booking and fast chargers!" ⭐⭐⭐⭐⭐</p>
        <small>- Karthik</small>
        <p> "The Beach Road station has made my daily commute stress-free. Booking is instant and charging is always reliable!"⭐⭐⭐⭐⭐</p>
        <small>-Rajesh</small>
        <p>"As a tourist, finding charging stations was my biggest worry. This platform solved it perfectly!"⭐⭐⭐⭐⭐</p>
        <small>-Siva</small>
      </section>
      {/* contact us */}
      <section ref={contactRef} className="testimonials py-5">
        <h2 className="w-100 text-center mb-5 contact">Contact Us</h2>
        <div className="container d-flex flex-wrap align-items-center justify-content-center gap-5">
          {/* Image Section */}
          <div className="col-md-5 text-center">
            <img
              src={contact}
              alt="Customer Support"
              className="img-fluid rounded shadow"
            />
          </div>

          {/* Form Section */}
          <div className="col-md-5">
            <form
              onSubmit={handleSubmit}
              className="p-4 border rounded shadow-sm bg-light"
            >
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                className="form-control mb-3"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                className="form-control mb-3"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <textarea
                name="message"
                placeholder="Your Message"
                className="form-control mb-3"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>

              <button type="submit" className="btn btn-success w-100">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer bg-dark text-light pt-5">
        <div className="container">
          <div className="row">
            {/* BRAND */}
            <div className="col-md-4 mb-4">
              <h5 className="fw-bold text-success">⚡ EV Charger & Booking</h5>
              <p className="small p-5">
                Powering your electric journey in Pondicherry with smart
                charging solutions. Find stations, book slots, and charge your
                EV with confidence—anytime, anywhere.
              </p>
            </div>

            {/* QUICK LINKS */}
            <div className="col-md-2 mb-4">
              <h6 className="fw-bold">Quick Links</h6>
              <ul className="list-unstyled p-3">
                <li>
                  <a href="/" className="footer-link p-2">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/login" className="footer-link p-2">
                    Login
                  </a>
                </li>
                <li>
                  <a href="/signup" className="footer-link p-2">
                    Sign Up
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link p-2">
                    Stations
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link p-2">
                    Book Charger
                  </a>
                </li>
              </ul>
            </div>

            {/* SERVICES */}
            <div className="col-md-3 mb-4">
              <h6 className="fw-bold">Services</h6>
              <ul className="list-unstyled p-3">
                <li className="footer-text p-2">EV Charging Station Booking</li>
                <li className="footer-text p-2">Fast & Secure Charging</li>
                <li className="footer-text p-2">Multiple Charger Types</li>
                <li className="footer-text p-2">Real-Time Slot Availability</li>
                <li className="footer-text p-2">Secure Online Payments</li>
              </ul>
            </div>

            {/* CONTACT */}
            <div className="col-md-3 mb-4 ">
              <h6 className="fw-bold p-3">Contact</h6>
              <p className="small mb-1 p-2">📧 support@evbookingpondy.com</p>
              <p className="small mb-1 p-2">📞 +91 98765 43210</p>
              <p className="small p-2">📍 Puducherry,India</p>

              {/* SOCIAL */}
              <div className="d-flex gap-3 justify-content-center mt-2 p-4">
                <i className="bi bi-facebook fs-5"></i>
                <i className="bi bi-instagram fs-5"></i>
                <i className="bi bi-twitter fs-5"></i>
              </div>
            </div>
          </div>

          <hr className="border-secondary" />

          <div className="text-center pb-3 small ">
            © 2025 EV Charger & Booking Station — Pondicherry Only. All Rights
            Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
