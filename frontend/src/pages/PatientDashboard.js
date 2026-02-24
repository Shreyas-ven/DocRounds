import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "../styles/PatientDashboard.css";

function PatientDashboard() {
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("patient");
    if (stored) {
      setPatient(JSON.parse(stored));
    }
  }, []);

  if (!patient) {
    return <h2 className="not-logged">Not Logged In</h2>;
  }

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Patient Report", 14, 20);

    doc.setFontSize(12);
    let y = 35;

    const line = (label, value) => {
      doc.text(`${label}: ${value || "-"}`, 14, y);
      y += 8;
    };

    line("Patient ID", patient.patientId);
    line("Name", patient.patientName);
    line("Disease", patient.disease);
    line("Doctor ID", patient.doctorId);
    line("Guardian Number", patient.guardianNumber);
    line("Ward Number", patient.wardNumber);
    line("Insurance Claim", patient.insuranceClaim);

    y += 5;
    line("Total Fees", `₹ ${patient.totalFees}`);
    line("Paid Fees", `₹ ${patient.paidFees}`);
    line("Balance", `₹ ${patient.balance}`);

    y += 5;
    line(
      "Admitted On",
      patient.createdAt
        ? new Date(patient.createdAt).toLocaleString()
        : "N/A"
    );

    doc.save(`${patient.patientId}_Patient_Report.pdf`);
  };

  return (
    <div className="patient-dashboard">
      <h2>Patient Dashboard</h2>

      <div className="patient-card">
        {patient.patientImage && (
          <img
            src={patient.patientImage}
            alt="Patient"
            className="patient-image"
          />
        )}

        <div className="row"><span>Patient ID</span><b>{patient.patientId}</b></div>
        <div className="row"><span>Name</span><b>{patient.patientName}</b></div>
        <div className="row"><span>Disease</span><b>{patient.disease}</b></div>
        <div className="row"><span>Doctor ID</span><b>{patient.doctorId}</b></div>
        <div className="row"><span>Guardian Number</span><b>{patient.guardianNumber}</b></div>
        <div className="row"><span>Ward Number</span><b>{patient.wardNumber}</b></div>
        <div className="row"><span>Insurance Claim</span><b>{patient.insuranceClaim}</b></div>

        <hr />

        <div className="row"><span>Total Fees</span><b>₹ {patient.totalFees}</b></div>
        <div className="row"><span>Paid Fees</span><b>₹ {patient.paidFees}</b></div>
        <div className="row balance"><span>Balance</span><b>₹ {patient.balance}</b></div>

        <div className="created">
          Admitted On: {new Date(patient.createdAt).toLocaleString()}
        </div>
      </div>

      {/* ✅ BUTTON BELOW CARD */}
      <button className="pdf-btn" onClick={downloadPDF}>
        ⬇ Download PDF
      </button>
    </div>
  );
}

export default PatientDashboard;