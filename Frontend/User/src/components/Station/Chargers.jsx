import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Chargers = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [chargers, setChargers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("✅ Chargers component loaded");

    if (!state?.station) return;

    const stationId = state.station._id || state.station.id;
    console.log("📌 Station ID:", stationId);

    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/getchargerbyid/${stationId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("⚡ Chargers API response:", data);
        setChargers(data.data || []);
      })
      .catch((err) => console.error("❌ Charger fetch error:", err))
      .finally(() => setLoading(false));
  }, [state]);

  if (!state?.station) {
    return <h4 className="text-center mt-4">No station selected</h4>;
  }

  if (loading) {
    return <h4 className="text-center mt-4">Loading chargers...</h4>;
  }

  return (
    <div className="container mt-4">
      <h3 className="mb-4">⚡ Chargers at {state.station.name}</h3>

      {chargers.length === 0 ? (
        <div className="alert alert-warning mt-3">
          No chargers found for this station
        </div>
      ) : (
        <div className="row g-4">
          {chargers.map((charger) => {
            const status = charger.status?.toLowerCase();

            return (
              <div
                key={charger._id}
                className="col-12 col-sm-6 col-md-4"
               
              >
                <div className="card p-3 shadow-sm h-100">
                  {/* HEADER */}
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 className="card-title mb-1">
                        🔌 {charger.chargername}
                      </h5>

                      <p className="mb-1 text-muted">
                        <b>Type:</b> {charger.type}
                      </p>
                      <p className="mb-1 text-muted">
                        <b>Connector:</b> {charger.connectortype}
                      </p>
                      <p className="mb-0 text-muted">
                        <b>Rate:</b> ₹{charger.rate}/hr
                      </p>
                    </div>

                    {/* STATUS */}
                    <span
                      className={`badge px-3 py-2 ${
                        status === "available"
                          ? "bg-success"
                          : status === "offline"
                          ? "bg-warning text-dark"
                          : status === "under maintenance"
                          ? "bg-secondary"
                          : "bg-dark"
                      }`}
                    >
                      {charger.status || "Unknown"}
                    </span>
                  </div>

                  {/* ACTION BUTTON */}
                  <button
                    className={`btn w-100 ${
                      status === "available" ? "btn-success" : "btn-secondary"
                    }`}
                    disabled={status !== "available"}
                    onClick={() =>
                      navigate("/layout/createbooking", {
                        state: { station: state.station, charger },
                      })
                    }
                  >
                    {status === "available" ? "Book Charger" : "Not Available"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Chargers;
