import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

/* ✅ import same background image */
import bgImage from "../assets/login-bg.webp";

function PatientLoginPage() {
  const navigate = useNavigate();

  const [patientId, setPatientId] = useState("");
  const [accessCode, setAccessCode] = useState("");

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: ""
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });

    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

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
        showToast(data.message || "Invalid Credentials", "error");
        return;
      }

      localStorage.setItem("patient", JSON.stringify(data.patient));

      showToast("Login Success", "success");

      setTimeout(() => {
        navigate("/patient-dashboard");
      }, 800);

    } catch (err) {
      showToast("Server error / Internet connection missing", "error");
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

      {/* ✅ SAME HEADER */}
      <header className="main-header">
        DocRounds
      </header>

      {/* LOGIN CONTENT */}
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

        {/* ✅ Toast */}
        {toast.show && (
          <div className={`toast ${toast.type}`}>
            {toast.message}
          </div>
        )}
      </div>

      {/* ✅ SAME FOOTER */}
      <footer className="main-footer">
        © 2025 DocRounds. All Rights Reserved.
      </footer>

    </div>
  );
}

export default PatientLoginPage;