import React from "react";
import { useNavigate, Link } from "react-router-dom";

import heroImage from "../assets/doctor-bg.jpg";
import "../styles/HomePage.css";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-container">

      {/* ===== TITLE BAR ===== */}
      <div className="title-bar">
        <h1>DocRounds – Daily Patient Care Portal</h1>
      </div>

      {/* ===== TOP MENU ===== */}
      <nav className="top-menu">
        <button className="menu-btn">Book Appointment</button>
        <button className="menu-btn">Insurance Details</button>
        <button className="menu-btn">Medicine Details</button>
        <button className="menu-btn">Blood Requirements</button>
        
        <button className="menu-btn" onClick={() => navigate("/emergency")}> Emergency Contact </button>

      </nav>

      {/* ===== HERO SECTION ===== */}
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="hero-overlay">
          <div className="hero-content">



            <h2 className="hero-title">
              Smarter Care. <br /> Better Rounds.
            </h2>

            <p className="hero-subtitle">
              A secure digital platform helping doctors manage patient care
              efficiently and transparently.
            </p>

            <div className="hero-buttons">
              <button
                className="primary-btn"
                onClick={() => navigate("/doctor-login")}
              >
                Doctor Login
              </button>

              <button
                className="secondary-btn"
                onClick={() => navigate("/patient-login")}
              >
                Patient Login
              </button>

              <button
                className="trinary-btn"
                onClick={() => navigate("/hospital-login")}
              >
                Hospital Login
              </button>


              <button
                className="quaternary-btn"
                onClick={() => navigate("/admin-login")}
              >
                Admin Login
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section className="about-section">
        <h2>About DocRounds</h2>
        <p>
          DocRounds is a modern patient care portal that enables doctors to
          update daily medical rounds digitally while allowing patients and
          families to securely track treatment progress in real time.
        </p>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div>
          <Link to="/contact">Contact Us</Link> |{" "}
          <Link to="/terms">Terms & Conditions</Link>
        </div>
        <p>© 2025 DocRounds. All Rights Reserved.</p>
      </footer>

    </div>
  );
}

export default HomePage;
