import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/hospitalRegister.css";

function HospitalRegisterPage() {
  const navigate = useNavigate();

  const [licenseFile, setLicenseFile] = useState(null);
  const [hospitalFile, setHospitalFile] = useState(null);

  const [formData, setFormData] = useState({
    hospitalName: "",
    managerNumber: "",
    location: "",
    icuWards: "",
    generalWards: "",
    medicalShop: "yes",
    ownerAadhar: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!licenseFile || !hospitalFile) {
      alert("Please upload hospital license and hospital image");
      return;
    }

    try {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      formDataToSend.append("licenseImage", licenseFile);
      formDataToSend.append("hospitalImage", hospitalFile);

      const response = await fetch(
        "http://localhost:5000/api/hospital/register",
        {
          method: "POST",
          body: formDataToSend
        }
      );

      if (!response.ok) {
        throw new Error("Server error");
      }

      const result = await response.json();

      // ✅ SHOW HOSPITAL ID IN POPUP
      alert(
        `Hospital registered successfully!\n\nYour Hospital ID: ${result.hospital_id}\nPlease save this ID for login.`
      );

      navigate("/");

    } catch (error) {
      console.error(error);
      alert("Registration failed. Please check server.");
    }
  };

  return (
    <div className="hospital-container">
      <h2>Hospital Registration</h2>
      <p>Register your hospital to access DocRounds</p>

      <form className="hospital-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="hospitalName"
          placeholder="Hospital Name"
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          name="managerNumber"
          placeholder="Hospital Manager Mobile Number"
          onChange={handleChange}
          required
        />

        <textarea
          name="location"
          placeholder="Hospital Location / Address"
          rows="3"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Create Password"
          onChange={handleChange}
          required
        />

        <label>Hospital License Upload</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setLicenseFile(e.target.files[0])}
          required
        />

        <label>Hospital Image Upload</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setHospitalFile(e.target.files[0])}
          required
        />

        <input
          type="number"
          name="icuWards"
          placeholder="Number of ICU Wards"
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="generalWards"
          placeholder="Number of General Wards"
          onChange={handleChange}
          required
        />

        <select name="medicalShop" onChange={handleChange}>
          <option value="yes">Medical Shop Attached - Yes</option>
          <option value="no">Medical Shop Attached - No</option>
        </select>

        <input
          type="text"
          name="ownerAadhar"
          placeholder="Owner Aadhaar Number"
          maxLength="12"
          onChange={handleChange}
          required
        />

        <button type="submit">Register Hospital</button>
      </form>
    </div>
  );
}

export default HospitalRegisterPage;
