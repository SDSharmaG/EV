import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const GoogleSignIn = () => {
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId || !buttonRef.current) return undefined;

    let active = true;
    const renderGoogleButton = () => {
      if (!active || !window.google?.accounts?.id || !buttonRef.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async ({ credential }) => {
          setError("");
          try {
            const response = await fetch(
              `${import.meta.env.VITE_API_BASE_URL}/api/auth/google`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ credential }),
              }
            );
            const data = await response.json();
            if (!response.ok) {
              setError(data.message || "Google sign-in failed.");
              return;
            }
            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.user._id);
            localStorage.setItem("user", JSON.stringify(data.user));
            navigate("/layout/stations");
          } catch (requestError) {
            console.error("Google sign-in request failed:", requestError);
            setError("Could not sign in with Google. Try again.");
          }
        },
      });
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        width: 280,
      });
    };

    if (window.google?.accounts?.id) {
      renderGoogleButton();
    } else {
      let script = document.getElementById("google-identity-services");
      if (!script) {
        script = document.createElement("script");
        script.id = "google-identity-services";
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
      script.addEventListener("load", renderGoogleButton);
      script.addEventListener("error", () => {
        if (active) setError("Google sign-in could not load.");
      });
    }

    return () => {
      active = false;
    };
  }, [clientId, navigate]);

  if (!clientId) {
    return <p className="small text-muted text-center mb-0">Google sign-in setup is required.</p>;
  }

  return (
    <div className="d-flex flex-column align-items-center gap-2 mt-3">
      {error && <div className="alert alert-danger w-100">{error}</div>}
      <div ref={buttonRef} />
    </div>
  );
};

export default GoogleSignIn;
