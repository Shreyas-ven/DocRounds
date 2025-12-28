import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HospitalLogin.css";

function HospitalLoginPage() {
  const navigate = useNavigate();
  const [hospitalId, setHospitalId] = useState("");
  const [accessCode, setAccessCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Hospital login submitted (API will be added later)");
  };

  return (
    <div className="login-container">
      <h2>Hospital Login</h2>
      <p>Access patient daily reports</p>

      <form className="login-box" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Hospital ID"
          value={hospitalId}
          onChange={(e) => setHospitalId(e.target.value)}
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
        <button type="hospitalReg" onClick={() => navigate("/hospital-register")} >New? Register</button>
      </form>

      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back to Home
      </button>
    </div>
  );
}

export default HospitalLoginPage;