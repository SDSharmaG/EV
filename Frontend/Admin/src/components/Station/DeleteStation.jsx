import React, { useEffect, useState } from "react";
import Stations from "./Stations";

const DeleteStation = ({ station, onClose, onDeleted  }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    const stationId = station._id || station.id; // fallback
    setError(""); // clear previous error
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/stationdelete/${stationId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        onDeleted(stationId); // optional callback to update parent state
        onClose(); // close modal
      } else {
        setError(data.message || "Failed to delete station");
      }
    } catch (err) {
      console.error(err);
      setError("Error connecting to backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1050,
      }}
      onClick={onClose}
    >
      <div
        className="modal-content bg-white p-4 rounded shadow"
        style={{ maxWidth: "400px", width: "90%" }}
        onClick={(e) => e.stopPropagation()} // prevent modal close when clicking inside
      >
        <h4 className="mb-3 text-danger">Delete Station</h4>
        {error && <p className="text-danger">{error}</p>}
        <p>Are you sure you want to delete <strong>{station.name}</strong>?</p>
        <div className="d-flex justify-content-end">
          <button className="btn btn-secondary me-2" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteStation;
