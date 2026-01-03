import React, { useState } from "react";
import "../styles/PatientManagement.css";

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

    alert("Patient admitted successfully ✅");

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

    alert("Patient discharged successfully 🏥");
    setDischargeId("");
  };

  return (
    <div className="patient-container">

      <h1>Patient Management</h1>

      {/* ================= ADMIT PATIENT ================= */}
      <div className="patient-card">
        <h2>Admit Patient</h2>

        <p><b>Patient ID:</b> {patient.patientId}</p>

        <input
          name="patientName"
          placeholder="Patient Name"
          value={patient.patientName}
          onChange={handleChange}
        />

        <input
          name="disease"
          placeholder="Disease Name"
          value={patient.disease}
          onChange={handleChange}
        />

        <select name="branch" value={patient.branch} onChange={handleChange}>
          <option value="">Select Branch</option>
          <option>Neurology</option>
          <option>Cardiology</option>
          <option>Orthopedics</option>
          <option>Oncology</option>
          <option>Pediatrics</option>
        </select>

        <input
          name="doctorId"
          placeholder="Doctor ID (DOCT-123456)"
          value={patient.doctorId}
          onChange={handleChange}
        />

        <input
          name="guardianNumber"
          placeholder="Parent / Guardian Contact"
          value={patient.guardianNumber}
          onChange={handleChange}
        />

        <input
          name="wardNumber"
          placeholder="Ward / ICU / Room Number"
          value={patient.wardNumber}
          onChange={handleChange}
        />

        <input
          name="insuranceClaim"
          placeholder="Insurance Amount Received"
          value={patient.insuranceClaim}
          onChange={handleChange}
        />

        <input
          name="totalFees"
          placeholder="Total Fees"
          value={patient.totalFees}
          onChange={handleChange}
        />

        <input
          name="paidFees"
          placeholder="Paid Amount"
          value={patient.paidFees}
          onChange={handleChange}
        />

        <p><b>Balance to be Paid:</b> ₹{patient.balance}</p>

        <input type="file" onChange={handleImage} />

        <button onClick={admitPatient}>Admit Patient</button>
      </div>

      {/* ================= DISCHARGE PATIENT ================= */}
      <div className="patient-card danger">
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
  );
}

export default PatientManagement;
