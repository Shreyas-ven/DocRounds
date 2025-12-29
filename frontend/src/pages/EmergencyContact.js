import React, { useEffect, useState } from "react";
import "../styles/EmergencyContact.css";

function EmergencyContact() {
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/emergency/hospitals")
      .then(res => res.json())
      .then(data => setHospitals(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="emergency-page">

      <h1>🚨 Emergency Contact</h1>

      {/* Ambulance */}
      <div className="ambulance-card">
        <h2>Call Ambulance</h2>
        <p className="ambulance-number">📞 108</p>
      </div>

      {/* Hospital List */}
      <h2 className="hospital-heading">Karnataka Emergency Hospitals</h2>

      <div className="hospital-list">
        {hospitals.map((h, index) => (
          <div className="hospital-card" key={index}>
            <h3>{h.hospitalName}</h3>
            <p>📍 {h.location}</p>
            <p>📞 {h.phone}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

export default EmergencyContact;
