import React, { useState, useEffect } from "react";

const ChargerForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    chargername: "",
    type: "",
    poweroutput: "",
    status: "",
    connectortype: "",
    rate: "",
  });

  // Update formData whenever initialData changes (for edit)
  useEffect(() => {
    if (initialData) {
      setFormData({
        chargername: initialData.chargername || "",
        type: initialData.type || "",
        poweroutput: initialData.poweroutput || "",
        status: initialData.status || "",
        connectortype: initialData.connectortype || "",
        rate: initialData.rate || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
        <label>ChargerName</label>
        <input
          type="text"
          className="form-control"
          name="chargername"
          value={formData.chargername}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-2">
        <label>Type</label>
        <select
          className="form-control"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <option value="">Select</option>
          <option value="AC">AC</option>
          <option value="DC Fast">DC Fast</option>
          <option value="Superfast">Superfast</option>
        </select>
      </div>

      <div className="mb-2">
        <label>Power</label>
        <input
          type="number"
          className="form-control"
          name="poweroutput"
          value={formData.poweroutput}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-2">
        <label>Status</label>
        <select
          name="status"
          className="form-control"
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value="">Select</option>
          <option value="Available">Available</option>
          <option value="In Use">In Use</option>
          <option value="Under Maintenance">Under Maintenance</option>
          <option value="Offline">Offline</option>
        </select>
      </div>

      <div className="mb-2">
        <label>Connector-Type</label>
        <select
          className="form-control"
          name="connectortype"
          value={formData.connectortype}
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option value="Type 1">Type 1</option>
          <option value="Type 2">Type 2</option>
          <option value="GB/T (AC)">GB/T (AC)</option>
        </select>
      </div>

      <div className="mb-2">
        <label>Rate</label>
        <input
          type="number"
          className="form-control"
          name="rate"
          value={formData.rate}
          onChange={handleChange}
        />
      </div>

      <div className="d-flex justify-content-end mt-3">
        <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </div>
    </form>
  );
};

export default ChargerForm;
