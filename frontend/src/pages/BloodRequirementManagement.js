import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/BloodRequirement.css";

function BloodRequirementManagement() {
  const { hospitalId } = useParams();

  const [requirements, setRequirements] = useState([]);
  const [form, setForm] = useState({
    patientName: "",
    patientId: "",
    disease: "",
    bloodType: "",
    units: "",
    requiredBeforedate: "",
    requiredBeforetime: "",
    donorName: ""
  });

  // ================= FETCH REQUIREMENTS =================
  useEffect(() => {
    fetch(`http://localhost:5000/api/blood/${hospitalId}`)
      .then(res => res.json())
      .then(data => setRequirements(data));
  }, [hospitalId]);

  // ================= HANDLE FORM =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addRequirement = async () => {
    const res = await fetch(
      `http://localhost:5000/api/blood/${hospitalId}/add`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      }
    );

    const data = await res.json();
    setRequirements([data, ...requirements]);

    setForm({
      patientName: "",
      patientId: "",
      disease: "",
      bloodType: "",
      units: "",
      requiredBefore: "",
      requiredBeforetime: "",
      donorName: ""
    });
  };

  const closeRequirement = async (id) => {
    await fetch(`http://localhost:5000/api/blood/close/${id}`, {
      method: "PUT"
    });

    setRequirements(prev =>
      prev.map(r =>
        r._id === id ? { ...r, status: "CLOSED" } : r
      )
    );
  };

  const deleteRequirement = async (id) => {
    await fetch(`http://localhost:5000/api/blood/delete/${id}`, {
      method: "DELETE"
    });

    setRequirements(prev => prev.filter(r => r._id !== id));
  };

  return (
    <div className="blood-container">
      <h1>Blood Requirement Management</h1>

      {/* ===== ADD FORM ===== */}
      <div className="blood-card">
        <h3>Create Blood Requirement</h3>

        <input name="patientName" placeholder="Patient Name" value={form.patientName} onChange={handleChange} />
        <input name="patientId" placeholder="Patient ID" value={form.patientId} onChange={handleChange} />
        <input name="disease" placeholder="Disease" value={form.disease} onChange={handleChange} />
        <input name="units" placeholder="Units Required" value={form.units} onChange={handleChange} /> <br></br><br></br>
        <select
             name="bloodType"
             value={form.bloodType}
             onChange={handleChange}
             className="blood-select"
          >
                 <option value="">Select Blood Type</option>
                 <option value="A+">A+</option>
                 <option value="A-">A-</option>
                 <option value="B+">B+</option>
                 <option value="B-">B-</option>
                 <option value="AB+">AB+</option>
                 <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                 <option value="O-">O-</option>
            </select>

        
        <input type="date" placeholder="Required within (DATE) " name="requiredBeforedate" value={form.requiredBeforedate} onChange={handleChange} />
        <input type="time" placeholder="Required within (TIME) " name="requiredBeforetime" value={form.requiredBeforetime} onChange={handleChange} />

        <button onClick={addRequirement}>Post Requirement</button>
      </div>



      {/* ===== LIST ===== */}
      
      {requirements.map(req => (
        <div key={req._id} className="blood-card">
          
          <h3>Requirement ID: {req._id}</h3>
          <p><b>Patient:</b> {req.patientName}</p>
          <p><b>Patient ID:</b> {req.patientId}</p>
          <p><b>Disease:</b> {req.disease}</p>
          <p><b>Blood Type:</b> {req.bloodType}</p>
          <p><b>Units:</b> {req.units}</p>
          <p><b>Required Before:</b> {req.requiredBeforedate} at {req.requiredBeforetime}</p>
          <p><b>Status:</b> {req.status}</p>

          {req.status === "OPEN" && (
            <button onClick={() => closeRequirement(req._id)}>
              Mark as Received
            </button>
          )}

          <button className="danger-btn" onClick={() => deleteRequirement(req._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default BloodRequirementManagement;
