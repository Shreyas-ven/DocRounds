import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import bgImage from "../assets/login-bg.webp";

function DoctorLoginPage() {
  const navigate = useNavigate();

  const [doctorId, setDoctorId] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Toast State
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "" // success | error
  });

  /* =========================
     SHOW TOAST FUNCTION
  ========================= */
  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });

    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  /* =========================
     LOGIN SUBMIT
  ========================= */
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
        showToast(data.message || "Invalid credentials", "error");
        return;
      }

      // ✅ Save login data
      localStorage.setItem("doctorId", data.doctorId);
      localStorage.setItem("doctorMongoId", data.doctorMongoId);
      localStorage.setItem("hospitalId", data.hospitalId);
      localStorage.setItem("doctorName", data.name);

      showToast("Login successful!", "success");

      setTimeout(() => {
        navigate("/doctor-dashboard");
      }, 1200);

    } catch (err) {
      showToast("Server error. Try again.", "error");
    }
  };

  return (
    <div
      className="doctor-page"
      style={{
        background: `linear-gradient(rgba(15,23,42,0.65),
             rgba(15,23,42,0.65)),
             url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >

      {/* HEADER */}
      <header className="main-header">
        DocRounds
      </header>

      {/* LOGIN CONTENT */}
      <div className="login-container">
        <h2>Doctor Login</h2>
        <p>Access doctor dashboard</p>

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

      {/* ✅ DYNAMIC TOAST */}
      {toast.show && (
        <div className={`login-toast ${toast.type}`}>
          {toast.type === "success" ? "✅ " : "❌ "}
          {toast.message}
        </div>
      )}

      {/* FOOTER */}
      <footer className="main-footer">
        © 2025 DocRounds. All Rights Reserved.
      </footer>

    </div>
  );
}

export default DoctorLoginPage;