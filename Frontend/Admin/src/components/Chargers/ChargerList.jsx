import React, { useEffect, useState } from "react";
import ChargerForm from "./ChargerForm";

const ChargerList = ({ station }) => {
  const [chargers, setChargers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCharger, setSelectedCharger] = useState(null);

  // 🔹 Fetch chargers for this station
  const fetchChargers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/getchargerbyid/${station._id}`);
      const data = await res.json();
      setChargers(data.data || []);
    } catch (err) {
      console.error("Error fetching chargers:", err);
    }
  };

  useEffect(() => {
    fetchChargers();
  }, []);

  // 🔹 Add Charger (limit check)
  const handleAdd = () => {
    if (chargers.length >= station.chargers) {
      alert(`⚠️ You can only add ${station.chargers} chargers for this station.`);
      return;
    }
    setSelectedCharger(null);
    setShowForm(true);
  };

  // 🔹 Edit Charger
  const handleEdit = (charger) => {
    setSelectedCharger(charger);
    setShowForm(true);
  };

  // 🔹 Delete Charger
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this charger?")) {
      try {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chargerdelete/${id}`, { method: "DELETE" });
        fetchChargers();
      } catch (err) {
        console.error("Error deleting charger:", err);
      }
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

  // 🔹 Save Charger (Add / Update)
  const handleSave = async (formData) => {
    try {
      if (selectedCharger) {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chargerupdate/${selectedCharger._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch(import.meta.env.VITE_API_BASE_URL + "/api/chargeradd", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, stationId: station._id }),
        });
      }

      await fetchChargers();
      setShowForm(false);
    } catch (err) {
      console.error("Error saving charger:", err);
    }
  };

  return (
    <div className="p-3 bg-white rounded shadow-sm">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <h5 className="fw-bold mb-2 mb-sm-0">
          Chargers for <span className="text-primary">{station.name}</span>
        </h5>
        <button className="btn btn-success btn-sm" onClick={handleAdd}>
          <i className="bi bi-plus-circle me-1"></i> Add Charger
        </button>
      </div>

      {/* Table */}
      <div className="table-responsive">
        {chargers.length > 0 ? (
          <table className="table table-bordered table-striped table-hover align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Power</th>
                <th>Status</th>
                <th>Connector</th>
                <th>Rate</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {chargers.map((c) => (
                <tr key={c._id}>
                  <td>{c.chargername}</td>
                  <td>{c.type}</td>
                  <td>{c.poweroutput}</td>
                  <td>{getStatusDisplay(c.status)}</td>
                  <td>{c.connectortype}</td>
                  <td>{c.rate}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(c)}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(c._id)}
                    >
                      <i className="bi bi-trash-fill"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-muted text-center">No chargers available.</p>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.6)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-3 shadow">
              <div className="modal-header bg-primary text-white">
                <h5 className="mb-0">
                  {selectedCharger ? "Edit Charger" : "Add New Charger"}
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

export default ChargerList;
