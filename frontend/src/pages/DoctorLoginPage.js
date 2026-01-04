import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function DoctorLoginPage() {
  const navigate = useNavigate();

  const [doctorId, setDoctorId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/doctor/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId,
          password
        })
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message);
        return;
      }

      // ✅ Save doctor session
      localStorage.setItem("doctorId", data.doctorId);
      localStorage.setItem("doctorMongoId", data.doctorMongoId);
      localStorage.setItem("hospitalId", data.hospitalId);
      localStorage.setItem("doctorName", data.name);

      // ✅ Redirect to dashboard
      navigate("/doctor-dashboard");

    } catch (err) {
      setError("Server error. Try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>Doctor Login</h2>
      <p>Access doctor dashboard</p>

      {error && <p className="error-msg">{error}</p>}

      <form className="login-box" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Doctor ID (DOC-XXXXXX)"
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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

export default DoctorLoginPage;
