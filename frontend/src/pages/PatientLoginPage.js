import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function PatientLoginPage() {
  const navigate = useNavigate();

  const [patientId, setPatientId] = useState("");
  const [accessCode, setAccessCode] = useState("");

  // ✅ Toast state
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "" // success | error
  });

  // ✅ Toast helper
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

      // ❌ Invalid credentials
      if (!res.ok) {
        showToast(data.message || "Invalid Credentials", "error");
        return;
      }

      // ✅ Save session
      localStorage.setItem("patient", JSON.stringify(data.patient));

      // ✅ Success message
      showToast("Login Success", "success");

      // ✅ Small delay for better UX
      setTimeout(() => {
        navigate("/patient-dashboard");
      }, 800);

    } catch (err) {
      // ❌ Network / Server failure
      showToast("Server error / Internet connection missing", "error");
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

      {/* ✅ Toast Notification */}
      {toast.show && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default PatientLoginPage;