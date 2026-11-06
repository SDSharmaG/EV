import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Auth/login.css";
import loginImg from "../images/loginimg.png"; // add your image
import GoogleSignIn from "./GoogleSignIn";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(import.meta.env.VITE_API_BASE_URL + "/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user._id);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/layout/stations");
      } else {
        setError(data.message || "Invalid Credentials");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="login-container col-12 min-vh-100 d-flex justify-content-center align-items-center">
  <div className="container">
    <div className="row g-4 align-items-stretch justify-content-center">
      {/* LEFT IMAGE */}
      <div className="col-12 col-md-6 d-none d-md-flex">
        <div className="h-100 w-100 d-flex justify-content-center align-items-center">
          <img
            src={loginImg}
            alt="Login"
            className="img-fluid rounded shadow"
            style={{ maxHeight: "500px", objectFit: "cover" }}
          />
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="main col-12 col-md-6 d-flex">
        <div className="card shadow p-4 login-card flex-fill d-flex flex-column justify-content-center">
          <h3 className="text-center mb-4">Welcome Back!</h3>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className="form-control form-control-lg"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="text-end mb-3">
              <button
                type="button"
                className="btn btn-link p-0"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </button>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                className="form-control form-control-lg"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="d-grid gap-2 mt-3">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate("/")}
              >
                Cancel
              </button>
            </div>
          </form>

          <div className="text-center text-muted mt-3">or</div>
          <GoogleSignIn />

          <div className="text-center mt-3">
            <small>
              Don't have an account?{" "}
              <span
                className="text-primary fw-semibold pointer"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </span>
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


);

};

export default Login;
