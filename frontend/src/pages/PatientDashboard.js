import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import "../styles/PatientDashboard.css";

function PatientDashboard() {
  const [patient, setPatient] = useState(null);
  const [report, setReport] = useState(null);
  const [loadingReport, setLoadingReport] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("patient");

    if (stored) {
      const parsedPatient = JSON.parse(stored);
      setPatient(parsedPatient);

      fetchReport(parsedPatient.patientId);
    } else {
      setLoadingReport(false);
    }
  }, []);

  const fetchReport = async (patientId) => {
    try {
      // ✅ CHANGE URL to your backend
      const res = await fetch(`http://localhost:5000/api/reports/${patientId}`);
      const data = await res.json();

      if (res.ok && data) {
        setReport(data);
      }
    } catch (err) {
      console.error("Report fetch failed:", err);
    } finally {
      setLoadingReport(false);
    }
  };

  if (!patient) {
    return <h2 className="not-logged">Not Logged In</h2>;
  }

  const downloadPDF = async () => {
    const doc = new jsPDF();

    const reportId = uuidv4(); // Unique identity
    const generatedAt = new Date().toLocaleString();

    const verifyURL = `https://yourdomain.com/verify/${reportId}`;

    const qrImage = await QRCode.toDataURL(verifyURL);

    doc.setFontSize(18);
    doc.text("Patient Report", 14, 20);

    doc.setFontSize(11);
    doc.text(`Report ID: ${reportId}`, 14, 30);
    doc.text(`Generated On: ${generatedAt}`, 14, 36);

    let y = 50;

    const line = (label, value) => {
      doc.text(`${label}: ${value || "-"}`, 14, y);
      y += 8;
    };

    line("Patient ID", patient.patientId);
    line("Name", patient.patientName);
    line("Disease", patient.disease);
    line("Doctor ID", patient.doctorId);
    line("Ward Number", patient.wardNumber);

    y += 10;

    doc.text(`Total Fees: ₹ ${patient.totalFees}`, 14, y);
    y += 8;
    doc.text(`Paid Fees: ₹ ${patient.paidFees}`, 14, y);
    y += 8;
    doc.text(`Balance: ₹ ${patient.balance}`, 14, y);

    doc.addImage(qrImage, "PNG", 140, 20, 50, 50);

    doc.setFontSize(9);
    doc.text("Scan QR to verify document authenticity", 140, 75);

    doc.save(`${patient.patientId}_Report.pdf`);
  };

  return (
    <div className="patient-dashboard">
      <h2>Patient Dashboard</h2>

      {/* ✅ PATIENT CARD */}
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

        <hr />

        <div className="row"><span>Total Fees</span><b>₹ {patient.totalFees}</b></div>
        <div className="row"><span>Paid Fees</span><b>₹ {patient.paidFees}</b></div>
        <div className="row balance"><span>Balance</span><b>₹ {patient.balance}</b></div>

        <div className="created">
          Admitted On: {new Date(patient.createdAt).toLocaleString()}
        </div>
      </div>

      {/* ✅ REPORT SECTION */}
      {loadingReport ? (
        <div className="report-loading">Loading report...</div>
      ) : report ? (
        <div className="report-card">
          <h3>Patient Report</h3>

          <div className="row"><span>Doctor</span><b>{report.doctorName}</b></div>
          <div className="row"><span>Remarks</span><b>{report.report}</b></div>
          <div className="row"><span>Time</span><b>{report.time}</b></div>
          <div className="row">
            <span>Created</span>
            <b>{new Date(report.createdAt).toLocaleString()}</b>
          </div>
        </div>
      ) : (
        <div className="no-report">No report available</div>
      )}

      {/* ✅ PDF BUTTON */}
      <button className="pdf-btn" onClick={downloadPDF}>
        ⬇ Download PDF
      </button>
    </div>
  );
}

export default PatientDashboard;