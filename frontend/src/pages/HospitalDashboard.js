import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HospitalDashboard.css";
import dashBg from "../assets/hospital-dash.webp";

function HospitalDashboard() {
  const hospitalId = localStorage.getItem("hospitalId");
  const navigate = useNavigate();

  // ================= AUTH CHECK =================
  useEffect(() => {
    if (!hospitalId) {
      navigate("/hospital-login");
    }
  }, [hospitalId, navigate]);

  // ================= STATES =================
  const [hospital, setHospital] = useState({
    hospitalName: "",
    managerNumber: "",
    location: "",
    icuWards: "",
    generalWards: "",
    medicalShop: ""
  });

  const [doctors, setDoctors] = useState([]);
  const [message, setMessage] = useState("");
  const [showUpdateHospital, setShowUpdateHospital] = useState(false);

  // 🔹 Add Doctor States
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [doctorForm, setDoctorForm] = useState({
    name: "",
    qualification: "",
    specialty: "",
    experience: "",
    languages: "",
    credentials: ""
  });



  // ================= FETCH HOSPITAL =================
  useEffect(() => {
    if (!hospitalId) return;

    fetch(`http://localhost:5000/api/hospital/${hospitalId}`)
      .then(res => res.json())
      .then(data => {
        setHospital({
          hospitalName: data.hospitalName || "",
          managerNumber: data.managerNumber || "",
          location: data.location || "",
          icuWards: data.icuWards || "",
          generalWards: data.generalWards || "",
          medicalShop: data.medicalShop || ""
        });
      });
  }, [hospitalId]);

  // ================= FETCH DOCTORS =================
  useEffect(() => {
    if (!hospitalId) return;

    fetch(`http://localhost:5000/api/hospital/${hospitalId}/doctors?limit=5`)
      .then(res => res.json())
      .then(data => setDoctors(data));
  }, [hospitalId]);

  // ================= UPDATE HOSPITAL =================
  const handleHospitalChange = (e) => {
    setHospital({ ...hospital, [e.target.name]: e.target.value });
  };

  const updateHospitalDetails = async () => {
    const res = await fetch(
      `http://localhost:5000/api/hospital/update/${hospitalId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hospital)
      }
    );

    const data = await res.json();
    setMessage(data.message);
    setShowUpdateHospital(false);
  };

  // ================= DOCTOR HANDLERS =================
  const updateDoctor = (doctorId) => {
    navigate(`/doctor/update/${doctorId}`);
  };

  const deleteDoctor = async (doctorId) => {
  if (!window.confirm("Are you sure you want to delete this doctor?")) return;

  await fetch(`http://localhost:5000/api/doctor/delete/${doctorId}`, {
    method: "DELETE"
  });

  setDoctors(prev => prev.filter(doc => doc._id !== doctorId));
};


  const handleDoctorChange = (e) => {
    setDoctorForm({ ...doctorForm, [e.target.name]: e.target.value });
  };

  const saveDoctor = async () => {
    const res = await fetch(
      `http://localhost:5000/api/hospital/${hospitalId}/add-doctor`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doctorForm)
      }
    );

    const data = await res.json();


   

    // show new doctor instantly
    setDoctors([data.doctor, ...doctors]);

    setDoctorForm({
      name: "",
      qualification: "",
      password: "",
      specialty: "",
      experience: "",
      languages: "",
      credentials: ""
    });

    setShowAddDoctor(false);
  };

  if (!hospital) return <p className="loading">Loading hospital details...</p>;

  return (
    <div
        className="dashboard-container"
        style={{
          background: `linear-gradient(rgba(15,23,42,0.75),
                 rgba(15,23,42,0.85)),
                 url(${dashBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >

      {/* ===== HEADER ===== */}
      <div className="dashboard-header">
        <h1>Hospital Dashboard</h1>
        <button
          className="small-btn"
          onClick={() => setShowUpdateHospital(!showUpdateHospital)}
        >
          Update Hospital Details
        </button>
      </div>

      {/* ===== SCROLLING WARNING TEXT ===== */}
      <div className="scrolling-text-container">
        <p className="scrolling-text">
          Hospital management is responsible for the doctors list, verify the
          doctor's certificate before adding to the website and the DocRounds community
          will not be responsible for the unfair decision made by the hospital
          management.
        </p>
      </div>

      {/* ===== UPDATE HOSPITAL ===== */}
      {showUpdateHospital && (
        <div className="dashboard-card">
          {message && <p className="success-msg">{message}</p>}

          <label>Hospital Name</label>
          <input name="hospitalName" value={hospital.hospitalName} onChange={handleHospitalChange} />

          <label>Manager Phone</label>
          <input name="managerNumber" value={hospital.managerNumber} onChange={handleHospitalChange} />

          <label>Location</label>
          <input name="location" value={hospital.location} onChange={handleHospitalChange} />

          <label>ICU Wards</label>
          <input name="icuWards" value={hospital.icuWards} onChange={handleHospitalChange} />

          <label>General Wards</label>
          <input name="generalWards" value={hospital.generalWards} onChange={handleHospitalChange} />

          <label>Medical Shop</label>
          <input name="medicalShop" value={hospital.medicalShop} onChange={handleHospitalChange} />

          <button className="update-btn" onClick={updateHospitalDetails}>
            Save
          </button>
        </div>
      )}

      {/* ===== DOCTORS SECTION ===== */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Recently Added Doctors</h2>
          <button className="small-btn" onClick={() => setShowAddDoctor(true)}>
            Add Doctor
          </button>
        </div>

        {showAddDoctor && (
          <div className="dashboard-card">
            <h3>Add New Doctor</h3>

            <label>Doctor Name</label>
            <input name="name" value={doctorForm.name} onChange={handleDoctorChange} />

            <label>Highest Qualification</label>
            <input name="qualification" value={doctorForm.qualification} onChange={handleDoctorChange} />

            <label>Specialist</label>
            <input name="specialty" value={doctorForm.specialty} onChange={handleDoctorChange} />

            <label>Years of Experience</label>
            <input name="experience" value={doctorForm.experience} onChange={handleDoctorChange} />

            <label>Languages Spoken</label>
            <input name="languages" value={doctorForm.languages} onChange={handleDoctorChange} />

            <label>Credentials / Awards</label>
            <input name="credentials" value={doctorForm.credentials} onChange={handleDoctorChange} />

            <label>Temporary Password</label>
            <input name="password" type="password" value={doctorForm.password} onChange={handleDoctorChange} />

            <button className="update-btn" onClick={saveDoctor}>
              Save Doctor
            </button>
          </div>
        )}

        {doctors.length === 0 ? (
          <p className="empty-text">No doctors added yet</p>
        ) : (
          <div className="card-grid">
            {doctors.map(doc => (
              <div key={doc._id} className="card">
                <h3>{doc.name}</h3>
                <br></br>
                 <p><strong>Doctor ID:</strong> {doc.doctorId}</p>
                <p>Qualification: {doc.qualification}</p>
                <p>Specialty: {doc.specialty}</p>
                <p>Experience: {doc.experience} years</p>
                <p>Languages: {doc.languages}</p> <br></br>
                <button className="small-btn" onClick={() => updateDoctor(doc._id)}>
                  Update Doctor
                </button> <br></br>
                <button className="danger-btn" onClick={() => deleteDoctor(doc._id)}> Delete Doctor</button>

              </div>
            ))}
          </div>
        )}
      </section>

      {/* ===== PATIENTS SECTION ===== */}
      <section className="section">
        <h2 className="section-title">Manage Patients</h2>
        <button
          className="update-btn"
          onClick={() => navigate(`/hospital/${hospitalId}/patient-management`)}
        >
          Go to Patient Management
        </button>

        <h2 className="section-title">Post Blood Requirements </h2>
        <button
          className="blood_bank-btn"
          onClick={() => navigate(`/hospital/${hospitalId}/blood-requirements`)}
        >
          Go to Blood Requirement Management
        </button>

      </section>

    </div>
  );
}

export default HospitalDashboard;
