import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/adminLogin.css";

function AdminLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: ""   // "success" or "error"
  });

  const showToast = (message, type) => {
    setToast({ show: true, message, type });

    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showToast("Please enter email and password", "error");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "⚠️ Invalid credentials");
      }

      // ✅ Save login flag
      localStorage.setItem("adminLoggedIn", "true");

      // ✅ Success Toast
      showToast("Login Successful ", "success");

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

      {/* 🔔 Toast */}
      {toast.show && (
  <div className={`toast ${toast.type}`}>
    {toast.type === "success" && "✅ "}
    {toast.type === "error" && "❌ "}
    {toast.type === "warning" && "⚠️ "}
    {toast.message}
  </div>
)}
    </div>
  );
}

export default AdminLoginPage;