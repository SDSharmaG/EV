import React, { useEffect, useState } from "react";
import ChargerForm from "./ChargerForm";

const Chargers = () => {
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [chargers, setChargers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedCharger, setSelectedCharger] = useState(null);

  // Fetch all stations
  useEffect(() => {
    fetch(import.meta.env.VITE_API_BASE_URL + "/api/admin/stationinfo")
      .then((res) => res.json())
      .then((data) => setStations(data.data || []))
      .catch(console.error);
  }, []);

  // Fetch chargers for a station
  const fetchChargers = async (stationId) => {
    if (!stationId) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/getchargerbyid/${stationId}`);
      const data = await res.json();
      setChargers(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error(err);
      setChargers([]);
    }
  };

  // Open popup and load chargers
  const handleViewChargers = (station) => {
    if (!station.id) return;
    setSelectedStation(station);
    fetchChargers(station.id);
    setShowPopup(true);
  };

  // Add or edit charger
  const handleAdd = () => {
    if (chargers.length >= selectedStation.chargers) {
      alert(
        `You can’t add more chargers. Maximum allowed for this station is ${selectedStation.chargers}.`
      );
      return;
    }
    setSelectedCharger(null);
    setShowForm(true);
  };

  const handleEdit = (charger) => {
    setSelectedCharger(charger);
    setShowForm(true);
  };

  // Delete charger
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this charger?")) return;
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/chargerdelete/${id}`, { method: "DELETE" });
      fetchChargers(selectedStation.id);
    } catch (err) {
      console.error(err);
    }
  };
  
  // ✅ Status display with color + icon
  const getStatusDisplay = (status) => {
    let iconClass = "bi bi-question-circle";
    let color = "#6c757d";
    let text = status || "Unknown";

    switch ((status || "").toLowerCase()) {
      case "available":
        iconClass = "bi bi-check-circle-fill";
        color = "#28a745"; // green
        break;
      case "in use":
        iconClass = "bi bi-lightning-charge-fill";
        color = "#ffc107"; // yellow
        break;
      case "maintenance":
      case "under maintenance":
      case "under maintainence": // handles spelling too
        iconClass = "bi bi-tools";
        color = "#6f42c1"; // purple
        break;
      case "offline":
        iconClass = "bi bi-x-circle-fill";
        color = "#dc3545"; // red
        break;
      default:
        iconClass = "bi bi-question-circle";
        color = "#adb5bd";
    }

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          color,
          fontWeight: 600,
        }}
      >
        <i className={iconClass} style={{ fontSize: "1.2rem" }}></i>
        <span>{text}</span>
      </div>
    );
  };

  // Function to return status style
  const getStatusButton = (status) => {
    let iconClass = "bi bi-question-circle";
    let color = "#6c757d";
    let text = status || "Unknown";

    switch ((status || "").toLowerCase()) {
      case "open":
        iconClass = "bi bi-check-circle-fill";
        color = "#28a745"; // green
        break;
      case "maintenance":
        iconClass = "bi bi-tools";
        color = "#6f42c1"; // purple
        break;
      case "close":
        iconClass = "bi bi-x-circle-fill";
        color = "#dc3545"; // red
        break;
      default:
        iconClass = "bi bi-question-circle";
        color = "#adb5bd";
    }

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          color,
          fontWeight: 600,
        }}
      >
        <i className={iconClass} style={{ fontSize: "1.2rem" }}></i>
        <span>{text}</span>
      </div>
    );
  };

  // Save charger
  const handleSave = async (formData) => {
    if (!selectedStation || !selectedStation.id) return;
    try {
      if (selectedCharger) {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/chargerupdate/${selectedCharger._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch(import.meta.env.VITE_API_BASE_URL + "/api/admin/chargeradd", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, stationId: selectedStation.id }),
        });
      }
      setShowForm(false);
      fetchChargers(selectedStation.id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center text-success mb-4"><i className="bi bi-lightning-charge-fill me-2"></i>EV Charging Stations</h2>
      <div className="table-responsive shadow-sm rounded">
        <table className="table table-hover table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th className="text-center">Name</th>
              <th className="text-center">Location</th>
              <th className="text-center">Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stations.map((station) => (
              <tr key={station._id || station.name}>
                <td className="text-center">{station.name}</td>
                <td className="text-center">{station.location}</td>
                <td className="text-center">{getStatusButton(station.status || "Unknown")}</td>
                <td className="text-center">
                  <button
                    className="btn btn-info btn-sm" //style={{backgroundColor:"#0d7557ff",color:"black"}}
                    onClick={() => handleViewChargers(station)}
                  >
                    View Chargers
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chargers Popup */}
      {showPopup && selectedStation && (
        <div
          className="modal d-block"
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1050,
            overflowY: "auto",
          }}
        >
          <div
            className="modal-content p-3"
            style={{
              width: "95%",
              marginLeft:"265px",
              marginTop:"150px",
              maxWidth: "1100px",
              borderRadius: "12px",
              backgroundColor: "#fff",
            }}
          >
            <div className="modal-header bg-primary text-white d-flex justify-content-between align-items-center flex-wrap">
              <h5 className="mb-2">Chargers for {selectedStation.name}</h5>
              <button
                className="btn-close btn-close-white"
                onClick={() => setShowPopup(false)}
              ></button>
            </div>

            <div className="modal-body">
              {/* Add Button Row */}
              <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-success" onClick={handleAdd}>
                  + Add Charger
                </button>
              </div>

              {/* Responsive Table */}
              <div className="table-responsive">
                <table className="table table-bordered table-striped table-sm align-middle">
                  <thead className="table-secondary">
                    <tr>
                      <th className="text-center">Name</th>
                      <th className="text-center">Type</th>
                      <th className="text-center">Power(KW)</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Connector</th>
                      <th className="text-center">Rate</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chargers.length > 0 ? (
                      chargers.map((c, idx) => (
                        <tr key={c._id || `${c.chargername}-${idx}`}>
                          <td className="text-center">{c.chargername}</td>
                          <td className="text-center">{c.type}</td>
                          <td className="text-center">{c.poweroutput}</td>
                          <td className="text-center">{getStatusDisplay(c.status)}</td>
                          <td className="text-center">{c.connectortype}</td>
                          <td className="text-center">{c.rate}</td>
                          <td className="text-center">
                            <button
                              className="btn btn-warning btn-sm me-2"
                              onClick={() => handleEdit(c)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(c._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">
                          No chargers found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charger Form Modal */}
      {showForm && selectedStation && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5>
                  {selectedCharger ? "Edit Charger" : "Add New Charger"} (
                  {selectedStation.name})
                </h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => setShowForm(false)}
                ></button>
              </div>
              <div className="modal-body">
                <ChargerForm
                  initialData={selectedCharger || {}}
                  onSubmit={handleSave}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chargers;
