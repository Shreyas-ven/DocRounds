import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/adminLogin.css";
import adminBg from "../assets/admin-bg.webp";

function AdminLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: ""
  });

  /* ✅ Dynamic Toast Controller */
  const showToast = (message, type) => {
    setToast({ show: true, message, type });
  };

  /* ✅ Auto hide toast with animation */
  useEffect(() => {
    if (!toast.show) return;

    const timer = setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 2500);

    return () => clearTimeout(timer);
  }, [toast.show]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showToast("Please enter email and password", "error");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/admin/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      localStorage.setItem("adminLoggedIn", "true");

      showToast("Login Successful", "success");

      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 2000);

    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="admin-page"
      style={{
        background: `linear-gradient(rgba(10,15,30,0.75),
                     rgba(10,15,30,0.75)),
                     url(${adminBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      {/* HEADER */}
      <header className="main-header">
        DocRounds Admin
      </header>

      {/* LOGIN */}
      <div className="admin-login-container">
        <h2>Admin Login</h2>
        <p>Authorized access only</p>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>

      {/* ✅ MODERN TOAST */}
      <div
        className={`toast-container ${
          toast.show ? "show" : ""
        } ${toast.type}`}
      >
        <span className="toast-icon">
          {toast.type === "success" && "✅"}
          {toast.type === "error" && "❌"}
          {toast.type === "warning" && "⚠️"}
        </span>

        <span className="toast-message">
          {toast.message}
        </span>

        <div className="toast-progress"></div>
      </div>

      {/* FOOTER */}
      <footer className="main-footer">
        © 2025 DocRounds. All Rights Reserved.
      </footer>
    </div>
  );
}

export default AdminLoginPage;