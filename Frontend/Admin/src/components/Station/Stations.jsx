import React, { useState, useEffect } from "react";
import AddStation from "./AddStation";
import UpdateStation from "../Station/UpdateStation";
import DeleteStation from "../Station/DeleteStation";

const Stations = () => {
  const [stations, setStations] = useState([]);
  const [viewStation, setViewStation] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editStation, setEditStation] = useState(null);
  const [deleteStationState, setDeleteStationState] = useState(null);

  // Fetch stations
  const fetchStations = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_BASE_URL + "/api/admin/stationinfo");
      const data = await res.json();
      setStations(data.data || []);
    } catch (error) {
      console.error("Error fetching stations:", error);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  // Remove deleted station from state
  const handleDeleted = (deletedId) => {
    setStations((prev) => prev.filter((s) => s._id !== deletedId && s.id !== deletedId));
  };

  // Handle updated station
  const handleUpdated = (id, updatedStation) => {
    setStations((prev) =>
      prev.map((s) => (s._id === id || s.id === id ? updatedStation : s))
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

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <h3 className="mb-4 mb-md-0">
          <i className="bi bi-lightning-charge-fill me-2"></i> Station Management
        </h3>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-plus-circle me-2"></i> Add New Station
        </button>
      </div>

      {/* Stations Table */}
      <table className="table table-bordered table-hover mt-4">
        <thead className="table-light">
          <tr>
            <th className="text-center">Name</th>
            <th className="text-center">Location</th>
            <th className="text-center">Chargers</th>
            <th className="text-center">Status</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {stations.length > 0 ? (
            stations.map((station) => (
              <tr key={station._id || station.id}>
                <td className="text-center">{station.name}</td>
                <td className="text-center">{station.location}</td>
                <td className="text-center">{station.chargers}</td>
                <td className="text-center">{getStatusButton(station.status || "Open")}</td>
                <td className="text-center">
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => setViewStation(station)}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => setEditStation(station)}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => setDeleteStationState(station)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No stations found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Add Modal */}
      {showAddModal && (
        <AddStation
          onClose={() => {
            setShowAddModal(false);
            fetchStations();
          }}
        />
      )}

      {/* Update Modal */}
      {editStation && (
        <UpdateStation
          station={editStation}
          onClose={() => setEditStation(null)}
          onUpdated={handleUpdated} // pass handleUpdated
        />
      )}

      {/* Delete Modal */}
      {deleteStationState && (
        <DeleteStation
          station={deleteStationState}
          onClose={() => setDeleteStationState(null)}
          onDeleted={handleDeleted}
         
        />
      )}

      {/* View Station Modal */}
      {viewStation && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1050,
          }}
          onClick={() => setViewStation(null)}
        >
          <div
            className="modal-content bg-white p-4 rounded shadow"
            style={{ maxWidth: "400px", width: "90%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="mb-3">Station Details</h4>
            <p>
              <strong>Name:</strong> {viewStation.name}
            </p>
            <p>
              <strong>Location:</strong> {viewStation.location}
            </p>
            <p>
              <strong>Chargers:</strong> {viewStation.chargers}
            </p>
            <p>
              <strong>Address : </strong> {viewStation.address}
            </p>
            <p>
              <strong>Status:</strong> {viewStation.status || "Open"}
            </p>
            {viewStation.imageUrl && (
              <div className="mb-3 text-center">
                <img
                  src={viewStation.imageUrl}
                  alt={viewStation.name}
                  style={{ maxWidth: "100%", borderRadius: "8px" }}
                />
              </div>
            )}
            <button
              className="btn btn-secondary mt-2"
              onClick={() => setViewStation(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stations;
