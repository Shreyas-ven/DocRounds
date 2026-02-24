import React, { useEffect, useState } from "react";
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

  return (
    <div className="patient-dashboard">
      <h2>Patient Dashboard</h2>

      <div className="patient-card">

        <div className="row"><span>Patient ID</span><b>{patient.patientId}</b></div>
        <div className="row"><span>Name</span><b>{patient.patientName}</b></div>
        <div className="row"><span>Age</span><b>{patient.age}</b></div>
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
    </div>
  );
}

export default PatientDashboard;
