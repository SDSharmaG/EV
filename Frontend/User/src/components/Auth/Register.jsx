import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Auth/login.css"; // use same CSS as login
import registerImg from "../images/loginimg.png"; // same image
import GoogleSignIn from "./GoogleSignIn";

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    city: "",
    state: "Puducherry",
    pincode: "",
    vehicleType: "",
    vehicleModel: "",
    preferredConnector: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const vehicleTypes = ["Electric Car", "Electric Bike", "Electric Scooter"];
  const connectorOptions = ["CCS2", "Type 2 (AC)", "CHAdeMO"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleFileChange = (e) => setProfileImage(e.target.files[0]);

  const nextStep = () => {
    if (!formData.name || !formData.email || !formData.password) {
      setMsg("Please fill Name, Email & Password to continue.");
      return;
    }
    setMsg("");
    setStep(2);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const submitData = new FormData();
    Object.keys(formData).forEach((key) => submitData.append(key, formData[key]));
    if (profileImage) submitData.append("profileImage", profileImage);

    try {
      const response = await fetch(import.meta.env.VITE_API_BASE_URL + "/api/register", {
        method: "POST",
        body: submitData,
      });
      const result = await response.json();
      setMsg(result.message);
      if (response.status === 201) setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      console.error(err);
      setMsg("Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container col-12 min-vh-100 d-flex align-items-center py-4">
      <div className="container col-12">
        <div className="row g-4 align-items-stretch justify-content-center">
          {/* LEFT IMAGE */}
          <div className="col-12 col-md-6 d-none d-md-flex">
            <div className="h-100 w-100 d-flex justify-content-center align-items-center">
              <img
                src={registerImg}
                alt="Register"
                className="img-fluid rounded shadow"
                style={{ maxHeight: "100%", objectFit: "cover" }}
              />
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="main col-12 col-md-6 d-flex">
            <div className="card shadow p-4 login-card flex-fill d-flex flex-column justify-content-center">
              <h3 className="text-center mb-4">Create Your Account</h3>
              {msg && <div className="alert alert-danger">{msg}</div>}
              <GoogleSignIn />
              <div className="text-center text-muted my-3">or register with email</div>

              {/* STEP 1 */}
              {step === 1 && (
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-semibold">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control form-control-lg"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Email *</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control form-control-lg"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Password *</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control form-control-lg"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-12 mt-3 d-grid gap-2">
                    <button className="btn btn-primary btn-lg" onClick={nextStep}>
                      Next
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-lg"
                      onClick={() => navigate("/")}
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      className="form-control"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Address</label>
                    <input
                      type="text"
                      name="address"
                      className="form-control"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">City</label>
                    <input
                      type="text"
                      name="city"
                      className="form-control"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">State</label>
                    <input type="text" name="state" className="form-control" value="Puducherry" readOnly />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      className="form-control"
                      value={formData.pincode}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Vehicle Type</label>
                    <select
                      name="vehicleType"
                      className="form-control"
                      value={formData.vehicleType}
                      onChange={handleChange}
                    >
                      <option value="">Select Vehicle Type</option>
                      {vehicleTypes.map((v) => (
                        <option key={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Vehicle Model</label>
                    <input
                      type="text"
                      name="vehicleModel"
                      className="form-control"
                      value={formData.vehicleModel}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Preferred Connector</label>
                    <select
                      name="preferredConnector"
                      className="form-control"
                      value={formData.preferredConnector}
                      onChange={handleChange}
                    >
                      <option value="">Select Connector</option>
                      {connectorOptions.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Profile Image</label>
                    <input type="file" className="form-control" onChange={handleFileChange} />
                  </div>

                  <div className="col-12 mt-3 d-grid gap-2">
                    <button
                      className="btn btn-success btn-lg"
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      {loading ? "Registering..." : "Register"}
                    </button>
                    <button className="btn btn-outline-secondary btn-lg" onClick={() => setStep(1)}>
                      Back
                    </button>
                  </div>

                  <div className="col-12 text-center mt-3">
                    <small>
                      Already have an account?{" "}
                      <span className="text-primary pointer" onClick={() => navigate("/login")}>
                        Login
                      </span>
                    </small>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
