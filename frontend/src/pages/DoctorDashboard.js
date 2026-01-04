import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DoctorDashboard.css";

function DoctorDashboard() {
  const navigate = useNavigate();

  const doctorName = localStorage.getItem("doctorName");
  const doctorId = localStorage.getItem("doctorId");
  const hospitalId = localStorage.getItem("hospitalId");

  // 🔐 Protect route
  useEffect(() => {
    if (!doctorId) {
      navigate("/doctor-login");
    }
  }, [doctorId, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/doctor-login");
  };

  return (
    <div className="doctor-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h2>Doctor Dashboard</h2>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>

      {/* Doctor Info */}
      <div className="doctor-info">
        <h3>Welcome, Dr. {doctorName}</h3>
        <p><strong>Doctor ID:</strong> {doctorId}</p>
        <p><strong>Hospital ID:</strong> {hospitalId}</p>
      </div>

      {/* Dashboard Cards */}
      <div className="dashboard-cards">
        <div className="card">
          <h4>My Patients</h4>
          <p>View assigned patients</p>
        </div>

        <div className="card">
          <h4>Appointments</h4>
          <p>Today's schedule</p>
        </div>

        <div className="card">
          <h4>Medical Reports</h4>
          <p>View & upload reports</p>
        </div>

        <div className="card">
          <h4>Profile</h4>
          <p>View doctor profile</p>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;
