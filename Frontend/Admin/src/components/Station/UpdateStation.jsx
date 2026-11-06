import React, { useState ,useEffect} from "react";


const UpdateStation = ({ station, onClose, onUpdated }) => {
  const [form, setForm] = useState({
    id: "",
    name: "",
    location: "",
    chargers: 0,
    address: "",
    status: "Open",
    image: null,
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔄 Sync form when station changes
  useEffect(() => {
    if (station) {
      setForm({
        id: station._id || station.id, // ✅ support both safely
        name: station.name || "",
        location: station.location || "",
        chargers: station.chargers || 0,
        address: station.address || "",
        status: station.status || "Open",
        image: null,
      });
    }
  }, [station]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    console.log("Edit station:", station);
    console.log("Updating station with ID:", form.id);

    if (!form.id) {
      setMessage("Station ID missing!");
      return;
    }

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("location", form.location);
    formData.append("chargers", Number(form.chargers));
    formData.append("address", form.address);
    formData.append("status", form.status);
    if (form.image) formData.append("image", form.image);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/stationupdate/${form.id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const data = await res.json();
      console.log("Update response:", data);

      if (!res.ok) {
        setMessage(data.message || "Failed to update station");
        return;
      }

      alert("Station updated successfully");

      onUpdated?.(form.id, {
        ...form,
        imageUrl: data.data?.imageUrl,
      });

      onClose();
    } catch (error) {
      console.error("Update error:", error);
      setMessage("Error connecting to backend");
    } finally {
      setLoading(false);
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
        style={{ maxWidth: "600px", width: "95%" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h4 className="mb-3">Update Station</h4>
        {message && <p className="text-danger">{message}</p>}
        <form onSubmit={handleUpdate}>
          <div className="mb-3">
            <label className="form-label">Station Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Chargers</label>
            <input
              type="number"
              name="chargers"
              value={form.chargers}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="Open">Open</option>
              <option value="Close">Close</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Image (optional)</label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-secondary me-2"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-warning" disabled={loading}>
              {loading ? "Updating..." : "Update Station"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStation;
