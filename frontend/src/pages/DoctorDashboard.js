import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DoctorDashboard.css";
import Swal from "sweetalert2";
import animBg from "../assets/anim-bg.webp";

function DoctorDashboard() {
  const navigate = useNavigate();

  const doctorName = localStorage.getItem("doctorName");
  const doctorId = localStorage.getItem("doctorId");
  const hospitalId = localStorage.getItem("hospitalId");

  const [patients, setPatients] = useState([]);

  const [showReport, setShowReport] = useState(null);
  const [showMedical, setShowMedical] = useState(null);
  const [showWardShift, setShowWardShift] = useState(null);

  const [reportText, setReportText] = useState("");
  const [reportTime, setReportTime] = useState("Morning");

  const [medicalItem, setMedicalItem] = useState("");
  const [medicalTime, setMedicalTime] = useState("");

  const [newWard, setNewWard] = useState("");

  const Toast = Swal.mixin({
  toast: true,
  position: "bottom-end",
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



  // 🔐 Protect route
  useEffect(() => {
    if (!doctorId) {
      navigate("/doctor-login");
    }
  }, [doctorId, navigate]);

  // 📥 Fetch ONLY patients linked to this doctor
  useEffect(() => {
    if (!doctorId) return;

    fetch(`http://localhost:5000/api/doctor/${doctorId}/patients`)
      .then(res => res.json())
      .then(data => {
        setPatients(data);
      })
      .catch(err => console.error("Error fetching patients:", err));
  }, [doctorId]);

// 📝 Save Round Report
const saveRoundReport = (patientId) => {
  fetch("http://localhost:5000/api/patient/round-report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      patientId,
      doctorId,
      reportText,
      reportTime
    })
  }).then(() => {
    Toast.fire({
    icon: "success",
    title: `Round report sent for ${patientId}`
    });
    setShowReport(null);
    setReportText("");
  });
};

// 💊 Medical Requirements
const sendMedicalReq = (patientId) => {
  fetch("http://localhost:5000/api/patient/medical-requirement", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      patientId,
      doctorId,
      medicalItem,
      medicalTime
    })
  }).then(() => {
    Toast.fire({
    icon: "success",
    title: `Medical requirement sent for ${patientId}`
    });
    setShowMedical(null);
    setMedicalItem("");
  });
};

// 🏥 Shift Ward
const shiftWard = (patientId) => {
  fetch("http://localhost:5000/api/patient/shift-ward", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      patientId,
      newWard
    })
  }).then(() => {
    Toast.fire({
    icon: "success",
    title: `Ward updated for ${patientId}`
    } );
    setShowWardShift(null);
    setNewWard("");
  });
};



  const handleLogout = () => {
    localStorage.clear();
    navigate("/doctor-login");
  };

  return (
    <div
  className="doctor-dashboard"
  style={{
    background: `linear-gradient(rgba(15,23,42,0.75),
                 rgba(15,23,42,0.85)),
                 url(${animBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed"
  }}
>
      {/* Header */}
      <header className="dashboard-header">
        <h2>Doctor Dashboard</h2>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>

      {/* Doctor Info */}
      <div className="doctor-info">
        <h3>Welcome, Dr. {doctorName}</h3>
        <p><strong>Doctor ID:</strong> {doctorId}</p>
        <p><strong>Hospital ID:</strong> {hospitalId}</p>
      </div>

      {/* My Patients */}
      <div className="patients-section">
        <h3>My Patients</h3>

        {patients.length === 0 ? (
          <p>No patients assigned to you.</p>
        ) : (
          <div className="patients-grid">
            {patients.map(patient => (
              <div className="patient-card" key={patient._id}>
                <h4>{patient.patientName}</h4>
                <p><strong>Patient ID:</strong> {patient.patientId}</p>
                <p><strong>Disease:</strong> {patient.disease}</p>
                <p><strong>Branch:</strong> {patient.branch}</p>
                <p><strong>Ward No:</strong> {patient.wardNumber || "N/A"}</p>
                <p><strong>Parent/Family/Guardian Phone:</strong> {patient.guardianNumber}</p>
                <p><strong>Total Fees:</strong> ₹{patient.totalFees || 0}</p>
                <p><strong>Paid:</strong> ₹{patient.paidFees || 0}</p>
                <p><strong>Balance:</strong> ₹{patient.balance || 0}</p>

                <hr />

<button onClick={() => setShowReport(patient.patientId)}>
  Update Round Report
</button>

{showReport === patient.patientId && (
  <>
    <select onChange={(e) => setReportTime(e.target.value)}>
      <option>Morning</option>
      <option>Evening</option>
      <option>Emergency</option>
    </select>

    <textarea
      placeholder="Write report..."
      onChange={(e) => setReportText(e.target.value)}
    />

    <button onClick={() => saveRoundReport(patient.patientId)}>
      Save & Send
    </button>
  </>
)}

<button onClick={() => setShowMedical(patient.patientId)}>
  Medical Requirements
</button>

{showMedical === patient.patientId && (
  <>
    <input
      placeholder="Equipment / Medicine name"
      onChange={(e) => setMedicalItem(e.target.value)}
    />
    <input
      placeholder="Within (Timings)"
      onChange={(e) => setMedicalTime(e.target.value)}
    />
    <button onClick={() => sendMedicalReq(patient.patientId)}>
      Send
    </button>
  </>
)}

<button onClick={() => setShowWardShift(patient.patientId)}>
  Shift Ward
</button>

{showWardShift === patient.patientId && (
  <>
    <input
      placeholder="New Ward / ICU Number"
      onChange={(e) => setNewWard(e.target.value)}
    />
    <button onClick={() => shiftWard(patient.patientId)}>
      Update Ward
    </button>
  </>
)}

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorDashboard;
