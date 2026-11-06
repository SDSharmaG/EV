import React, { useEffect, useState } from "react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); 
  const [profile, setProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch All Users
  const FetchUsers = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(import.meta.env.VITE_API_BASE_URL + "/api/allusers",{
        headers:{
          Authorization:`Bearer ${token}`,
          "Content-Type" : "application/json",
        }
      })
      const data = await res.json();
      console.log(data)
      if(data.success){
        setUsers(data.data);
      }else{
        console.error(data.message); 
      }
      // setUsers(data.data || []);
      console.log(data)
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };


  // Fetch User + Profile (combined API)
  const fetchFullDetails = async (userId) => {
  const token = localStorage.getItem("token")
  console.log("Clicked user ID:", userId);
  console.log(users);

  if (!userId) {
    alert("❌ User ID missing from button click");
    return;
  }
    try {
      
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/viewuser/${userId}`, {
        method : "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type" : "application/json"
        },
      });
      const data = await res.json();
      console.log("here is the data",data)

      setSelectedUser(data.data);
      setProfile(data.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching full details:", error);
    }
  };
  const handleDeleteUser = async (userId) => {
  if (!window.confirm("Are you sure you want to delete this user?")) return;

  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/deleteuser/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (data.success) {
      alert("User deleted successfully!");
      // Refresh the users list
      FetchUsers();
    } else {
      alert(data.message || "Failed to delete user");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    alert("Something went wrong while deleting the user.");
  }
};


  useEffect(() => {
    FetchUsers();
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="mb-4">
        <i className="bi bi-people-fill me-2"></i> Users
      </h3>

      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th className="text-center">Name</th>
            <th className="text-center">Email</th>
            <th className="text-center">Phone</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id || user.id}>
                <td className="text-center">{user.name}</td>
                <td className="text-center">{user.email}</td>
                <td className="text-center">{user.phone}</td>
                <td className="text-center">
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => {
                      console.log(user)
                      fetchFullDetails(user.id)}}
                  >
                    View
                  </button>
                   <button
            className="btn btn-danger btn-sm ms-3"
            onClick={() => handleDeleteUser(user._id)}
          >
            Delete
          </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                No Users Found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* User Details Modal */}
      {showModal && selectedUser && (
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
            zIndex: 2000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="modal-content bg-white p-4 rounded shadow"
            style={{ maxWidth: "600px", width: "90%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="mb-3 text-center"><i className="bi bi-person "></i>{selectedUser.name}</h4>
            <div className="d-flex justify-content-around">
            <div>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Address:</strong> {profile?.address || "Not Added"}</p>
            <p><strong>City:</strong> {profile?.city || "Not Added"}</p>
            <p><strong>Phone:</strong> {profile?.phone || "Not Added"}</p></div>
            <div className="">
              <p><strong>Vehicle-model : </strong>{profile?.vehicleModel}</p>
              <p><strong>Preffered-Connector : </strong>{profile?.preferredConnector}</p>
            </div></div>

            {profile?.profileImage && (
  <div
    className="text-center mb-2"
    style={{
      width: "150px",   // fixed width of container
      height: "150px",  // fixed height of container
      margin: "0 auto",
      overflow: "hidden",
      borderRadius: "10px",
    }}
  >
    <img
      src={
        profile.profileImage.startsWith("http")
          ? profile.profileImage
          : `${import.meta.env.VITE_API_BASE_URL}/uploads/Users/${profile.profileImage}`
      }
      alt="profile"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover", // fills container and crops if needed
      }}
    />
  </div>
)}


            <button className="btn btn-secondary w-100" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
