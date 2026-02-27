import React, { useState } from "react";
import "../styles/PatientManagement.css";
import Swal from "sweetalert2";

/* ✅ background image */
import patBg from "../assets/pat-man-bg.webp";

function PatientManagement() {

  const generatePatientId = () =>
    `PAT-${Math.floor(100000 + Math.random() * 900000)}`;

  const [patient, setPatient] = useState({
    patientId: generatePatientId(),
    patientName: "",
    disease: "",
    branch: "",
    doctorId: "",
    guardianNumber: "",
    wardNumber: "",
    insuranceClaim: "",
    totalFees: "",
    paidFees: "",
    balance: "",
    patientImage: null
  });

  const Toast = Swal.mixin({
  toast: true,
  position: "bottom-end",   // ✅ bottom right
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
  background: "#111827",
  color: "#fff",
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

  const [dischargeId, setDischargeId] = useState("");

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    let updated = { ...patient, [name]: value };

    if (name === "totalFees" || name === "paidFees") {
      updated.balance =
        (updated.totalFees || 0) - (updated.paidFees || 0);
    }

    setPatient(updated);
  };

  const handleImage = (e) => {
    setPatient({ ...patient, patientImage: e.target.files[0] });
  };

  // ================= ADMIT PATIENT =================
  const admitPatient = async () => {
    const formData = new FormData();

    Object.keys(patient).forEach(key => {
      formData.append(key, patient[key]);
    });

    await fetch("http://localhost:5000/api/patient/admit", {
      method: "POST",
      body: formData
    });

    Toast.fire({
      icon: "success",
      title: `Patient ${patient.patientId} admitted successfully`
      });

    setPatient({
      patientId: generatePatientId(),
      patientName: "",
      disease: "",
      branch: "",
      doctorId: "",
      guardianNumber: "",
      wardNumber: "",
      insuranceClaim: "",
      totalFees: "",
      paidFees: "",
      balance: "",
      patientImage: null
    });
  };

  // ================= DISCHARGE PATIENT =================
  const dischargePatient = async () => {
    await fetch(
      `http://localhost:5000/api/patient/discharge/${dischargeId}`,
      { method: "DELETE" }
    );

    Toast.fire({
      icon: "success",
     title: `Patient ${dischargeId} discharged successfully`
   });
    setDischargeId("");
  };

  return (
    <div
      className="patient-page"
      style={{
        background: `linear-gradient(rgba(15,23,42,0.8),
                     rgba(15,23,42,0.85)),
                     url(${patBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <h1 className="page-title">Patient Management</h1>

      {/* ✅ LEFT RIGHT LAYOUT */}
      <div className="patient-grid">

        <div className="patient-card glass">
  <h2>Admit Patient</h2>

  <p><b>Patient ID:</b> {patient.patientId}</p>

  {/* Patient Name */}
  <div className="form-group">
    <label>Patient Name</label>
    <input
      name="patientName"
      value={patient.patientName}
      onChange={handleChange}
    />
  </div>

  {/* Disease */}
  <div className="form-group">
    <label>Disease Name</label>
    <input
      name="disease"
      value={patient.disease}
      onChange={handleChange}
    />
  </div>

  {/* Branch */}
  <div className="form-group">
    <label>Select Branch</label>
    <select
      name="branch"
      value={patient.branch}
      onChange={handleChange}
    >
      <option value="">Select Branch</option>
      <option>Neurology</option>
      <option>Cardiology</option>
      <option>Orthopedics</option>
      <option>Oncology</option>
      <option>Pediatrics</option>
    </select>
  </div>

  {/* Doctor ID */}
  <div className="form-group">
    <label>Doctor ID (DOCT-123456)</label>
    <input
      name="doctorId"
      value={patient.doctorId}
      onChange={handleChange}
    />
  </div>

  {/* Guardian */}
  <div className="form-group">
    <label>Guardian Contact</label>
    <input
      name="guardianNumber"
      value={patient.guardianNumber}
      onChange={handleChange}
    />
  </div>

  {/* Ward */}
  <div className="form-group">
    <label>Ward / ICU / Room</label>
    <input
      name="wardNumber"
      value={patient.wardNumber}
      onChange={handleChange}
    />
  </div>

  {/* Insurance */}
  <div className="form-group">
    <label>Insurance Amount</label>
    <input
      name="insuranceClaim"
      value={patient.insuranceClaim}
      onChange={handleChange}
    />
  </div>

  {/* Fees */}
  <div className="form-group">
    <label>Total Fees</label>
    <input
      name="totalFees"
      value={patient.totalFees}
      onChange={handleChange}
    />
  </div>

  <div className="form-group">
    <label>Paid Amount</label>
    <input
      name="paidFees"
      value={patient.paidFees}
      onChange={handleChange}
    />
  </div>

  <p className="balance">
    Balance: ₹{patient.balance}
  </p>

  <div className="form-group">
    <label>Patient Image</label>
    <input type="file" onChange={handleImage} />
  </div>

  <button className="primary-btn" onClick={admitPatient}>
    Admit Patient
  </button>
</div>

        {/* ================= DISCHARGE ================= */}
        <div className="patient-card glass danger">
          <h2>Discharge Patient</h2>

          <input
            placeholder="Enter Patient ID (PAT-123456)"
            value={dischargeId}
            onChange={e => setDischargeId(e.target.value)}
          />

          <button className="danger-btn" onClick={dischargePatient}>
            Discharge Patient
          </button>
        </div>

      </div>
    </div>
  );
}

export default PatientManagement;