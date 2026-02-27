import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/adminDashboard.css";

/* ✅ Background Image */
import dashBg from "../assets/admin-dash-bg.webp";

function AdminDashboard() {
  const [hospitals, setHospitals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/hospitals")
      .then(res => res.json())
      .then(data => {
        console.log("API DATA:", data);
        setHospitals(data);
      })
      .catch(err => console.error(err));
  }, []);

  const pending = hospitals.filter(
    h => h.status?.trim().toUpperCase() === "PENDING"
  );

  const approved = hospitals.filter(
    h => h.status?.trim().toUpperCase() === "APPROVED"
  );

  return (
    <div
      className="admin-dashboard"
      style={{
        background: `linear-gradient(rgba(10,15,30,0.85),
                     rgba(10,15,30,0.9)),
                     url(${dashBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      {/* HEADER */}
      <header className="dash-header">
        DocRounds Admin Dashboard
      </header>

      {/* 🔴 Pending Section */}
      <section className="section">
        <h2 className="section-title pending-title">
          Pending Verification
        </h2>

        <div className="hospital-grid">
          {pending.length === 0 ? (
            <p className="empty-text">No pending hospitals</p>
          ) : (
            pending.map(h => (
              <div
                className="hospital-card pending-card"
                key={`${h.hospital_id}-${h.status}`}
              >
                <h3>{h.hospitalName}</h3>
                <span className="status pending">PENDING</span>

                <button
                  className="action-btn"
                  onClick={() =>
                    navigate(`/admin/hospital/${h.hospital_id}`)
                  }
                >
                  Verify Hospital
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 🟢 Approved Section */}
      <section className="section">
        <h2 className="section-title approved-title">
          Approved Hospitals
        </h2>

        <div className="hospital-grid">
          {approved.length === 0 ? (
            <p className="empty-text">No approved hospitals</p>
          ) : (
            approved.map(h => (
              <div
                className="hospital-card approved-card"
                key={h.hospital_id}
              >
                <h3>{h.hospitalName}</h3>
                <span className="status approved">APPROVED</span>

                <button
                  className="action-btn approved-btn"
                  onClick={() =>
                    navigate(`/admin/hospital/${h.hospital_id}`)
                  }
                >
                  Manage Hospital
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="dash-footer">
        © 2025 DocRounds. All Rights Reserved.
      </footer>
    </div>
  );
}

export default AdminDashboard;