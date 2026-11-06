import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const requestCode = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/password-reset/request`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not request reset code.");
      setCodeSent(true);
      setMessage(data.message);
    } catch (requestError) {
      setError(requestError.message || "Could not request reset code.");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/password-reset/confirm`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code, password }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not reset password.");
      setMessage(data.message);
      setTimeout(() => navigate("/login"), 1200);
    } catch (requestError) {
      setError(requestError.message || "Could not reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container min-vh-100 d-flex justify-content-center align-items-center">
      <div className="card shadow p-4 w-100" style={{ maxWidth: "480px" }}>
        <h3 className="text-center mb-3">Reset your password</h3>
        {message && <div className="alert alert-info">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!codeSent ? (
          <form onSubmit={requestCode}>
            <label htmlFor="reset-email" className="form-label">Email</label>
            <input
              id="reset-email"
              type="email"
              className="form-control mb-3"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <button className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Sending..." : "Send reset code"}
            </button>
          </form>
        ) : (
          <form onSubmit={resetPassword}>
            <label htmlFor="reset-code" className="form-label">Email code</label>
            <input
              id="reset-code"
              className="form-control mb-3"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              pattern="[0-9]{6}"
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
              required
            />
            <label htmlFor="new-password" className="form-label">New password</label>
            <input
              id="new-password"
              type="password"
              className="form-control mb-3"
              autoComplete="new-password"
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Resetting..." : "Reset password"}
            </button>
          </form>
        )}
        <button
          type="button"
          className="btn btn-link mt-2"
          onClick={() => navigate("/login")}
        >
          Back to login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
