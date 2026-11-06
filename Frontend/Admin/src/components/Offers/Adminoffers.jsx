import React, { useState, useEffect } from "react";
import "../css/adminoffer.css"; // Import external CSS

const AdminOffers = () => {
  const [offers, setOffers] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    discountType: "flat",
    discountValue: "",
    minAmount: 0,
    applicableStations: "all",
    validFrom: "",
    validTill: "",
    image: null,
  });

  const fetchOffers = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_BASE_URL + "/api/offers/all-offers");
      const data = await res.json();
      setOffers(data.data || []);
    } catch (err) {
      console.error("Error fetching offers:", err);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddOffer = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      for (let key in form) formData.append(key, form[key]);

      const res = await fetch(import.meta.env.VITE_API_BASE_URL + "/api/offers/addoffers", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      await res.json();
      setForm({
        title: "",
        description: "",
        discountType: "flat",
        discountValue: "",
        minAmount: 0,
        applicableStations: "all",
        validFrom: "",
        validTill: "",
        image: null,
      });
      fetchOffers();
    } catch (err) {
      console.error("Error adding offer:", err);
    }
  };

  const handleDeleteOffer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/offers/delete/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      await res.json();
      fetchOffers();
    } catch (err) {
      console.error("Error deleting offer:", err);
    }
  };

  return (
    <div className="admin-offers-container">
      <h2 className="mb-4">Admin Offers</h2>

      {/* ===== ADD OFFER FORM ===== */}
      <form onSubmit={handleAddOffer} className="offer-form">
        <div className="row g-3">
          <div className="col-md-6">
            <label>Title</label>
            <input type="text" className="form-control" name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label>Discount Type</label>
            <select className="form-select" name="discountType" value={form.discountType} onChange={handleChange}>
              <option value="flat">Flat</option>
              <option value="percentage">Percentage</option>
            </select>
          </div>
          <div className="col-md-6">
            <label>Discount Value</label>
            <input type="number" className="form-control" name="discountValue" value={form.discountValue} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label>Minimum Amount</label>
            <input type="number" className="form-control" name="minAmount" value={form.minAmount} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label>Applicable Stations</label>
            <input type="text" className="form-control" name="applicableStations" value={form.applicableStations} onChange={handleChange} />
          </div>
          <div className="col-md-3">
            <label>Valid From</label>
            <input type="date" className="form-control" name="validFrom" value={form.validFrom} onChange={handleChange} />
          </div>
          <div className="col-md-3">
            <label>Valid Till</label>
            <input type="date" className="form-control" name="validTill" value={form.validTill} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label>Offer Image</label>
            <input type="file" className="form-control" name="image" onChange={handleChange} />
          </div>
          <div className="col-12">
            <button type="submit" className="btn-add mt-2">Add Offer</button>
          </div>
        </div>
      </form>

      {/* ===== LIST OFFERS ===== */}
      <h3>All Offers</h3>
      <div className="table-responsive">
        <table className="offer-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Discount</th>
              <th>Min Amount</th>
              <th>Applicable Stations</th>
              <th>Valid From</th>
              <th>Valid Till</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {offers.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">No offers found</td>
              </tr>
            ) : (
              offers.map((offer) => (
                <tr key={offer._id || offer.id}>
                  <td>{offer.title}</td>
                  <td>{offer.discountType === "flat" ? `₹${offer.discountValue}` : `${offer.discountValue}%`}</td>
                  <td>{offer.minAmount}</td>
                  <td>{Array.isArray(offer.applicableStations) ? offer.applicableStations.join(", ") : offer.applicableStations}</td>
                  <td>{new Date(offer.validFrom).toLocaleDateString()}</td>
                  <td>{new Date(offer.validTill).toLocaleDateString()}</td>
                  <td>
                    {offer.image && (
                      <img
                        src={
                          offer.imageUrl ||
                          (offer.image.startsWith("http")
                            ? offer.image
                            : `${import.meta.env.VITE_API_BASE_URL}/uploads/offers/${offer.image}`)
                        }
                        alt={offer.title}
                        className="img-thumbnail"
                        width="80"
                      />
                    )}
                    {!offer.image && "No Image"}
                  </td>
                  <td>
                    <button className="btn-delete" onClick={() => handleDeleteOffer(offer._id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOffers;
