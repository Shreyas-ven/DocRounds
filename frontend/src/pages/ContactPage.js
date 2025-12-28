import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/common.css";

function ContactPage() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <h1>Contact Us</h1>
      <p>If you have any questions or need support, reach out to us.</p>

      <div className="card">
        <p><strong>Email:</strong> alphadeveloper9@gmail.com</p>
        <p><strong>Phone:</strong> +91 96329 95016</p>
        <p><strong>Address:</strong> Bengaluru, India</p>
      </div>

      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back to Home
      </button>
    </div>
  );
}

export default ContactPage;
