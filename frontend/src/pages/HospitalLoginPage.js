import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HospitalLogin.css";

function HospitalLoginPage() {
  const navigate = useNavigate();
  const [hospitalId, setHospitalId] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/hospital/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            hospitalId,
            password: accessCode,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        setMessage(data.message);
        return;
      }

      // ✅ ONLY NEW LINE ADDED (nothing else changed)
      localStorage.setItem("hospitalId", data.hospitalId);

      alert("Hospital login successful");
      navigate("/hospital-dashboard");

    } catch (error) {
      setMessage("Server error. Please try again later.");
    }
  };

  return (
    <div className="login-container">
      <h2>Hospital Login</h2>
      <p>Access patient daily reports</p>

      {message && <p className="error-text">{message}</p>}

      <form className="login-box" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Hospital ID (HOSP-XXXXXX)"
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

        {/* ✅ REGISTER BUTTON KEPT */}
        <button
          type="button"
          className="register-btn"
          onClick={() => navigate("/hospital-register")}
        >
          New? Register
        </button>
      </form>

      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back to Home
      </button>
    </div>
  );
}

export default HospitalLoginPage;
