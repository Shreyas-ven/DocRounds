import React, { useEffect, useState } from "react";
import "../styles/HospitalDashboard.css";


function HospitalDashboard() {
  const hospitalId = localStorage.getItem("hospitalId");
  const [hospital, setHospital] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/api/hospital/${hospitalId}`)
      .then(res => res.json())
      .then(data => setHospital(data));
  }, [hospitalId]);

  const handleChange = (e) => {
    setHospital({ ...hospital, [e.target.name]: e.target.value });
  };

  const updateDetails = async () => {
    const res = await fetch(
      `http://localhost:5000/api/hospital/update/${hospitalId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hospital)
      }
    );

    const data = await res.json();
    setMessage(data.message);
  };

  if (!hospital) return <p className="loading">Loading hospital details...</p>;

return (
  <div className="dashboard-container">
    <h1>Hospital Dashboard</h1>

    {message && <p className="success-msg">{message}</p>}

    <div className="dashboard-card">
      <label>Hospital Name</label>
      <input name="hospitalName" value={hospital.hospitalName} onChange={handleChange} />

      <label>Manager Phone</label>
      <input name="managerNumber" value={hospital.managerNumber} onChange={handleChange} />

      <label>Location</label>
      <input name="location" value={hospital.location} onChange={handleChange} />

      <label>ICU Wards</label>
      <input name="icuWards" value={hospital.icuWards} onChange={handleChange} />

      <label>General Wards</label>
      <input name="generalWards" value={hospital.generalWards} onChange={handleChange} />

      <label>Medical Shop</label>
      <input name="medicalShop" value={hospital.medicalShop} onChange={handleChange} />

      <button className="update-btn" onClick={updateDetails}>
        Update Details
      </button>
    </div>
  </div>
);

}

export default HospitalDashboard;
