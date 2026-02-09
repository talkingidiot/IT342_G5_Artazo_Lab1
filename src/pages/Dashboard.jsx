import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getMe();
        setProfileData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="dashboard-container"><div className="loading">Loading...</div></div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="profile-card">
        <h2>Your Profile</h2>
        {profileData ? (
          <div className="profile-info">
            <div className="info-group">
              <label>First Name:</label>
              <p>{profileData.firstName}</p>
            </div>
            <div className="info-group">
              <label>Last Name:</label>
              <p>{profileData.lastName}</p>
            </div>
            <div className="info-group">
              <label>Email:</label>
              <p>{profileData.email}</p>
            </div>
            <div className="info-group">
              <label>User ID:</label>
              <p>{profileData.id}</p>
            </div>
          </div>
        ) : (
          <p>No profile data available</p>
        )}
      </div>

      <div className="welcome-card">
        <h3>Welcome!</h3>
        <p>
          Hello {user?.firstName} {user?.lastName}, you are successfully logged in.
        </p>
        <p>This is your protected dashboard page. Only authenticated users can access this.</p>
      </div>
    </div>
  );
};
