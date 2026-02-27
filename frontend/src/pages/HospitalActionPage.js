import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/hospitalAction.css";
import dashBg from "../assets/admin-dash-bg.webp";

function HospitalActionPage() {
  const { hospitalId } = useParams();
  const navigate = useNavigate();
  const [hospital, setHospital] = useState(null);

  /* ================= FETCH HOSPITAL ================= */
  useEffect(() => {
    fetch(`http://localhost:5000/api/admin/hospital/${hospitalId}`)
      .then(res => res.json())
      .then(data => setHospital(data))
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load hospital details",
        });
      });
  }, [hospitalId]);

  /* ================= APPROVE ================= */
  const approveHospital = async () => {
    try {
      await fetch(
        `http://localhost:5000/api/admin/hospital/approve/${hospitalId}`,
        { method: "PUT" }
      );

      await Swal.fire({
        icon: "success",
        title: "Approved!",
        text: "Hospital approved successfully",
        confirmButtonColor: "#4f46e5",
        background: "#111827",
        color: "#fff",
      });

      navigate("/admin-dashboard");
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Approval failed!",
      });
    }
  };

  /* ================= DELETE / REJECT ================= */
  const deleteHospital = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This hospital will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete",
    });

    if (result.isConfirmed) {
      try {
        await fetch(
          `http://localhost:5000/api/admin/hospital/delete/${hospitalId}`,
          { method: "DELETE" }
        );

        await Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Hospital deleted successfully",
          confirmButtonColor: "#4f46e5",
          background: "#111827",
          color: "#fff",
        });

        navigate("/admin-dashboard");
      } catch {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Deletion failed!",
        });
      }
    }
  };

  if (!hospital) return <p className="loading">Loading...</p>;

  return (
    <div
      className="hospital-action-page"
      style={{
        background: `linear-gradient(rgba(10,15,30,0.85),
                    rgba(10,15,30,0.9)),
                    url(${dashBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="hospital-detail-card">

        <h1 className="hospital-title">{hospital.hospitalName}</h1>

        <span className={`status-badge ${hospital.status.toLowerCase()}`}>
          {hospital.status}
        </span>

        {/* DETAILS */}
        <div className="details-grid">
          <p><strong>Hospital ID:</strong> {hospital.hospital_id}</p>
          <p><strong>Manager Number:</strong> {hospital.managerNumber}</p>
          <p><strong>Location:</strong> {hospital.location}</p>
          <p><strong>ICU Wards:</strong> {hospital.icuWards}</p>
          <p><strong>General Wards:</strong> {hospital.generalWards}</p>
          <p><strong>Medical Shop:</strong> {hospital.medicalShop}</p>
          <p><strong>Owner Aadhaar:</strong> {hospital.ownerAadhar}</p>
          <p>
            <strong>Verified By Admin:</strong>{" "}
            {hospital.verifiedByAdmin ? "Yes" : "No"}
          </p>
          
        </div>

        {/* IMAGES */}
        <div className="image-section">
          <div>
            <h4>License Image</h4>
            <img src={hospital.licenseImage} alt="License" />
          </div>

          <div>
            <h4>Hospital Image</h4>
            <img src={hospital.hospitalImage} alt="Hospital" />
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="action-buttons">

          {/* PENDING → Approve + Reject */}
          {hospital.status === "PENDING" && (
            <>
              <button className="approve-btn" onClick={approveHospital}>
                Approve Hospital
              </button>

              <button className="reject-btn" onClick={deleteHospital}>
                Reject Hospital
              </button>
            </>
          )}

          {/* APPROVED → Delete only */}
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