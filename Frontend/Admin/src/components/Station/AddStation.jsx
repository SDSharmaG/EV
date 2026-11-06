import React, { useState } from "react";

const AddStation = ({ onClose }) => {
  const [station, setStation] = useState({
    name: "",
    location: "",
    chargers: "",
    address: "",
    status: "Open", // default status
    image: null,
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setStation({ ...station, image: files[0] });
    } else {
      setStation({ ...station, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!station.name || !station.location || !station.chargers || !station.address ) {
      setMessage("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("name", station.name);
    formData.append("location", station.location);
    formData.append("chargers", station.chargers);
    formData.append("address" , station.address);
    formData.append("status", station.status); // append status
    if (station.image) formData.append("image", station.image);

    try {
      const res = await fetch(import.meta.env.VITE_API_BASE_URL + "/api/admin/stationregister", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        onClose();
      } else {
        setMessage(data.message || "Failed to add station");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error connecting to backend");
    }
  };

  return (
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
      onClick={onClose}
    >
      <div
        className="modal-content bg-white p-4 rounded shadow"
        style={{ maxWidth: "500px", width: "90%" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h4 className="mb-3">Add New Station</h4>
        {message && <p className="text-danger">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Station Name</label>
            <input
              type="text"
              name="name"
              value={station.name}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Location</label>
            <input
              type="text"
              name="location"
              value={station.location}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Chargers</label>
            <input
              type="number"
              name="chargers"
              value={station.chargers}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div>
            <label className="mb-3">Address</label>
            <input
              type="text"
              name="address"
              value={station.address}
              onChange={handleChange}
              className="form-control" />
          </div>
          <div className="mb-3">
            <label className="form-label">Status</label>
            <select
              name="status"
              value={station.status}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Open">Open</option>
              <option value="Close">Close</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Image</label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="d-flex justify-content-end">
            <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Station
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStation;
