import React, { useState, useEffect } from 'react';
import user from '../assets/images/user.png';
// import './Profile.css';

const Profile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login first.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const res = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/admin/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await res.json();
      if (res.ok) setAdmin(data.profile);
      else setError(data.err || "Failed to load profile");

    } catch (err) {
      setError('Server error. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container m-auto justify-content-center">
      <div className="profile-card border col-4 justify-content-center m-auto rounded" onClick={fetchProfile}>
        <img 
          src={admin?.profilePicture || user} 
          alt="Profile" 
          className="profile-image img img-fluid p-4" 
        />
        <div className="profile-info">
          {loading && <p>Loading...</p>}
          {error && <p className="text-error">{error}</p>}
          {admin ? (
            <>
              <h3 className="text-center">{admin.name}</h3>
              <p className="text-center">{admin.email}</p>
              <h6 className="text-center">Administrator</h6>
            </>
          ) : (
            <p>Click card to load profile</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
