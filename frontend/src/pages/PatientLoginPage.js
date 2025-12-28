import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function PatientLoginPage() {
  const navigate = useNavigate();
  const [patientId, setPatientId] = useState("");
  const [accessCode, setAccessCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Patient login submitted (API will be added later)");
  };

  return (
    <div className="login-container">
      <h2>Patient Login</h2>
      <p>Access patient daily reports</p>

      <form className="login-box" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Access Code"
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>

      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back to Home
      </button>
    </div>
  );
}

export default PatientLoginPage;
