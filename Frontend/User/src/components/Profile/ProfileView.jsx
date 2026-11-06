import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token) {
        setMessage("No token found. Please login again.");
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/getuserbyid/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("API Response:", data);

        if (!res.ok) {
          setMessage(data.message || "Failed to load profile");
          return;
        }

        setUser(data.data); // backend sends { message, data }
      } catch (error) {
        setMessage("Something went wrong");
      }
    };

    fetchProfile();
  }, [location.state]);

  if (message) return <h3 className="text-center text-danger mt-4">{message}</h3>;
  if (!user) return <h3 className="text-center mt-4">Loading...</h3>;

  return (
    <div className="container mt-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3">
        <h2 className="text-center text-md-start mb-3 mb-md-0">My Profile</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/layout/profileedit",{ state : {user}})}
        >
          Edit Profile
        </button>
      </div>

      <div className="card shadow-lg p-3 p-md-4">
        <div className="row">
          {/* Left: Profile Image */}
          <div className="col-12 col-md-4 text-center mb-3 mb-md-0">
            {user?.profileImage ? (
              <img
                src={
                  user.profileImage.startsWith("http")
                    ? user.profileImage
                    : `${import.meta.env.VITE_API_BASE_URL}/uploads/Users/${user.profileImage}`
                }
                alt="Profile"
                className="img-fluid rounded-circle"
                style={{ width: "300px", height: "300px", objectFit: "cover" ,marginTop:"70px"}}
              />
            ) : (<div style={{ width: "250px", height: "250px", objectFit: "cover",border:"1px solid black", marginTop:"70px",           
                marginLeft:"70px", borderRadius:"150px"}}>         
                <i className="bi bi-person-circle fs-1" style={{height:"100px"}}></i></div>
            )}
          </div>

          {/* Right: User Details */}
          <div className="col-12 col-md-8">
            <h4 className="text-center text-md-start mb-3">{user.name}</h4>
            <div className="table-responsive">
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <th>Email</th>
                    <td>{user.email}</td>
                  </tr>
                  <tr>
                    <th>Phone</th>
                    <td>{user.phone}</td>
                  </tr>
                  <tr>
                    <th>Address</th>
                    <td>{user.address}</td>
                  </tr>
                  <tr>
                    <th>City</th>
                    <td>{user.city}</td>
                  </tr>
                  <tr>
                    <th>State</th>
                    <td>{user.state}</td>
                  </tr>
                  <tr>
                    <th>Pincode</th>
                    <td>{user.pincode}</td>
                  </tr>
                  <tr>
                    <th>Vehicle Type</th>
                    <td>{user.vehicleType}</td>
                  </tr>
                  <tr>
                    <th>Vehicle Model</th>
                    <td>{user.vehicleModel}</td>
                  </tr>
                  <tr>
                    <th>Preferred Connector</th>
                    <td>{user.preferredConnector}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
