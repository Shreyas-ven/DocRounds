import React, { useEffect, useState } from "react";
import "../styles/insurancePage.css";

function InsurancePage() {
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/insurance-providers")
      .then(res => res.json())
      .then(data => setProviders(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="insurance-container">
      <h1>Health Insurance Providers</h1>
      <p>Contact details and official websites</p>

      <div className="insurance-grid">
        {providers.map((p, index) => (
          <div className="insurance-card" key={index}>
            <h3>{p.providerName}</h3>
            <p><strong>Type:</strong> {p.type}</p>
            <p><strong>Contact:</strong> {p.phone}</p>
            <a
              href={p.website}
              target="_blank"
              rel="noopener noreferrer"
              className="visit-btn"
            >
              Visit Website
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InsurancePage;
