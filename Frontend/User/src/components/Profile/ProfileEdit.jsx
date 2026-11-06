import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ProfileEdit = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const user = location.state?.user;
  console.log("Received user in edit:", user);
  const [form, setForm] = useState({
    name:"",
    phone:"",
    address:"",
    city:"",
    pincode:"",
    vehicleType:"",
    vehicleModel:"",
    preferredConnector:"",
  });
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  useEffect(()=>{
    if(user){
      setForm({
      name: user.name || "",
      phone: user.phone || "",
      address: user.address || "",
      city: user.city || "",
      pincode: user.pincode || "",
      vehicleType: user.vehicleType || "",
      vehicleModel: user.vehicleModel || "",
      preferredConnector: user.preferredConnector || "",
    })
    }
  },[user])

  const handleChange = (e) => {
    setForm(prev => ({ ...prev , [e.target.name]:e.target.value}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    console.log(userId)
    console.log(token)

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("phone", form.phone);
    formData.append("address", form.address);
    formData.append("city",form.city);
    formData.append("pincode",form.pincode);
    formData.append("vehicleType", form.vehicleType);
    formData.append("vehicleModel",form.vehicleModel);
    formData.append("preferredConnector", form.preferredConnector);
    if (file) formData.append("profileImage", file);

    try {
        if(!token) return
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/updateuser/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.message || "Update Failed");
      } else {
        setMsg("Profile Updated Successfully ✅");
        localStorage.setItem("user", JSON.stringify(data.data));
        setTimeout(() => {
        navigate('/layout/profileme',{state:{reload : true}})
        },1000);
      }

    } catch (err) {
  console.error("Update Error:", err);
  setMsg(err.response?.data?.message || err.message || "Server Error");
}
  };
 if (!user) {
    return <h3>Loading...</h3>;
  }
  return (
    <form onSubmit={handleSubmit} className="container">
      {msg && <p>{msg}</p>}
      <div className="d-flex">
      <div className="col-6 m-1">
        <label htmlFor="Name" className="form-label fw-bold"><i className="fa fa-user me-2" ></i>Name *</label>
        <input type="text" className="form-control" name="name" value={form?.name} onChange={handleChange} /></div>
      <div className="col-6 m-1"> 
        <label htmlFor="phone" className="form-label fw-bold"><i className="bi bi-telephone-fill me-2"></i>Phone *</label>
        <input type="text" className="form-control" name="phone" value={form.phone} onChange={handleChange} /></div></div>
      <div className="d-flex">
      <div className="col-md-6 m-1">
        <label htmlFor="address" className="form-label fw-bold"><i className="fa-solid fa-location-dot me-2"></i>Address *</label>
        <textarea type="text" className="form-control" name="address" value={form.address} onChange={handleChange} /></div>

      {/* <div className="col-md-6 m-1">
      <label htmlFor="City" className="form-label fw-bold"><i className="fa fa-city me-2"></i>City</label>
      <select name="city" onChange={handleChange} className="form-control">
        <option value="">Select City</option>
        <option value="Ariyankuppam">Ariyankuppam</option>
        <option value="Bahour">Bahour</option>
        <option value="Kalapet">Kalapet</option>
        <option value="Kurumambpet">Kurumambpet</option>
        <option value="Lawspet">Lawspet</option>
        <option value="Uzhavarkarai">Uzhavarkarai</option>
        <option value="Villianur">Villianur</option>
      </select></div> */}
      <div className="col-md-6 m-1">
        <label htmlFor="City"  className="form-label fw-bold"><i className="fa fa-city me-2"></i>City</label>
        <input type="text" className="form-control" name="city" value={form.city} onChange={handleChange} />
      </div></div>

      <div className="d-flex">
      <div className="col-md-6 m-1">
      <label htmlFor="vehicleType" className="form-label fw-bold"><i className="fa fa-car me-2"></i>Vehicle-Type</label>
      <select name="vehicleType" className="form-control" value={form.vehicleType} onChange={handleChange}>
        <option>Electric Car</option>
        <option>Electric Bike</option>
        <option>Electric Scooter</option>
        <option>Electric Auto</option>
        <option>Electric Van</option>
      </select></div>

      <div className="col-md-6 m-1">
      <label htmlFor="vehicleModel" className="form-label fw-bold"><i className="fa fa-car-side me-2"></i>Vehicle-Model</label>
      <input type="text" name="vehicleModel" className="form-control" value={form.vehicleModel} onChange={handleChange}/></div></div>

      <div className="d-flex">
      <div className="col-md-6 m-1">
      <label htmlFor="preferredConnector" className="form-label fw-bold"><i className="fa fa-bolt me-2"></i>Preferred-Connector</label>
      <select name="preferredConnector" className="form-control" value={form.preferredConnector} onChange={handleChange}>
          <option value="CCS2">CCS2</option> 
          <option value='Type 2 (AC)'>Type 2 (AC)</option> 
          <option value="Bharat AC001">Bharat AC001</option> 
          <option value="Bharat DC001">Bharat DC001</option> 
          <option value="CHAdeMO">CHAdeMO</option>
          <option value="GB/T">GB/T</option>
      </select></div>
<div className="col-md-6 m-1">
  <label htmlFor="image" className="form-label fw-bold d-flex align-items-center">
    <img 
      src="/mnt/data/A_digital_graphic_design_displays_a_list_of_person.png"
      alt="Image Icon"
      style={{ width: "18px", height: "18px", marginRight: "8px" }}
    />
    Image
  </label>

  <input
    type="file"
    className="form-control"
    onChange={(e) => setFile(e.target.files[0])}
  />
</div>
</div>
    <div className="d-flex justify-content-between">
      <div><button type="submit" className="btn btn-primary m-2">Update</button></div>
      <div><button type="reset" className="btn btn-secondary m-2" onClick={()=>(navigate('/layout/profileme'))}>cancel</button></div></div>
    </form>
  );
};

export default ProfileEdit;
