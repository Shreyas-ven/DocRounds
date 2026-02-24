import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function PatientLoginPage() {
  const navigate = useNavigate();

  const [patientId, setPatientId] = useState("");
  const [accessCode, setAccessCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/patient/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          patientId,
          accessCode
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // ✅ Save patient session (simple version)
      localStorage.setItem("patient", JSON.stringify(data.patient));

      // ✅ Go to dashboard
      navigate("/patient-dashboard");

    } catch (err) {
      alert("Server not reachable");
    }
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
          placeholder="Access Code (Doctor ID)"
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
