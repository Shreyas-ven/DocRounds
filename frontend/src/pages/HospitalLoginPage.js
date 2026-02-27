import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/HospitalLogin.css";
import hospitalBg from "../assets/hospital-bg.webp";

function HospitalLoginPage() {
  const navigate = useNavigate();

  const [hospitalId, setHospitalId] = useState("");
  const [accessCode, setAccessCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/hospital/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            hospitalId,
            password: accessCode,
          }),
        }
      );

      const data = await response.json();

      /* ❌ LOGIN FAILED */
      if (!data.success) {
        await Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: data.message,
          confirmButtonColor: "#ef4444",
          background: "#111827",
          color: "#ffffff",
        });
        return;
      }

      /* ✅ LOGIN SUCCESS */
      localStorage.setItem("hospitalId", data.hospitalId);
      localStorage.setItem("hospitalId", data.hospital_id);

      await Swal.fire({
        icon: "success",
        title: "Welcome!",
        text: "Hospital login successful",
        confirmButtonColor: "#22c55e",
        background: "#111827",
        color: "#ffffff",
        timer: 1800,
        showConfirmButton: false,
      });

      navigate("/hospital-dashboard");

    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Please try again later.",
        confirmButtonColor: "#ef4444",
        background: "#111827",
        color: "#ffffff",
      });
    }
  };

  return (
    <div
      className="hospital-page"
      style={{
        background: `linear-gradient(rgba(15,23,42,0.65),
                     rgba(15,23,42,0.65)),
                     url(${hospitalBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <header className="main-header">DocRounds</header>

      <div className="login-container">
        <h2>Hospital Login</h2>
        <p>Access patient daily reports</p>

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

      <footer className="main-footer">
        © 2025 DocRounds. All Rights Reserved.
      </footer>
    </div>
  );
}

export default HospitalLoginPage;