import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function DoctorLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Doctor login submitted (API will be added later)");
  };

  return (
    <div className="login-container">
      <h2>Doctor Login</h2>
      <p>Access doctor dashboard</p>

      <form className="login-box" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Doctor Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
