import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/hospitalAction.css";

function HospitalActionPage() {
  const { hospitalId } = useParams();
  const navigate = useNavigate();
  const [hospital, setHospital] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/admin/hospital/${hospitalId}`)
      .then(res => res.json())
      .then(data => setHospital(data));
  }, [hospitalId]);

  const approveHospital = async () => {
    await fetch(
      `http://localhost:5000/api/admin/hospital/approve/${hospitalId}`,
      { method: "PUT" }
    );
    alert("Hospital approved successfully");
    navigate("/admin-dashboard");
  };

  const deleteHospital = async () => {
    await fetch(
      `http://localhost:5000/api/admin/hospital/delete/${hospitalId}`,
      { method: "DELETE" }
    );
    alert("Hospital deleted successfully");
    navigate("/admin-dashboard");
  };

  if (!hospital) return <p className="loading">Loading...</p>;

  return (
    <div className="hospital-action-page">
      <div className="hospital-detail-card">
        <h1 className="hospital-title">{hospital.hospitalName}</h1>

        <span className={`status-badge ${hospital.status.toLowerCase()}`}>
          {hospital.status}
        </span>

        <div className="details-grid">
          <p><strong>Hospital ID:</strong> {hospital.hospital_id}</p>
          <p><strong>Manager Number:</strong> {hospital.managerNumber}</p>
          <p><strong>Location:</strong> {hospital.location}</p>
          <p><strong>ICU Wards:</strong> {hospital.icuWards}</p>
          <p><strong>General Wards:</strong> {hospital.generalWards}</p>
          <p><strong>Medical Shop:</strong> {hospital.medicalShop}</p>
          <p><strong>Owner Aadhaar:</strong> {hospital.ownerAadhar}</p>
          <p><strong>Verified By Admin:</strong> {hospital.verifiedByAdmin ? "Yes" : "No"}</p>
          <p><strong>Created At:</strong> {new Date(hospital.createdAt).toLocaleString()}</p>
        </div>

        <div className="image-section">
          <div>
            <h4>License Image</h4>
            <img
               src={hospital.licenseImage}
               alt="License"
            />

          </div>

          <div>
            <h4>Hospital Image</h4>
            <img
                src={hospital.hospitalImage}
                alt="Hospital"
            />

          </div>
        </div>

        <div className="action-buttons">
          {hospital.status === "PENDING" && (
            <button className="approve-btn" onClick={approveHospital}>
              Approve Hospital
            </button>
          )}

          {hospital.status === "APPROVED" && (
            <button className="delete-btn" onClick={deleteHospital}>
              Delete Hospital
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default HospitalActionPage;
