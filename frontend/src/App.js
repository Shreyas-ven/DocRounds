
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import DoctorLoginPage from "./pages/DoctorLoginPage";
import PatientLoginPage from "./pages/PatientLoginPage";
import ContactPage from "./pages/ContactPage";
import TermsPage from "./pages/TermsPage";
import HospitalLoginPage from "./pages/HospitalLoginPage";
import HospitalRegisterPage from "./pages/HospitalRegisterPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import HospitalActionPage from "./pages/HospitalActionPage";
import EmergencyContact from "./pages/EmergencyContact";
import InsurancePage from "./pages/InsurancePage";
import HospitalDashboard from "./pages/HospitalDashboard";
import PatientManagement from "./pages/PatientManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/doctor-login" element={<DoctorLoginPage />} />
        <Route path="/patient-login" element={<PatientLoginPage />} />
        <Route path="/hospital-login" element={<HospitalLoginPage />} />
        <Route path="/hospital-register" element={<HospitalRegisterPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/terms" element={<TermsPage />} />

        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/hospital/:hospitalId"element={<HospitalActionPage />} />
        <Route path="/emergency" element={<EmergencyContact />} />
        <Route path="/insurance" element={<InsurancePage />} />
        <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
       <Route path="/hospital/:hospitalId/patient-management" element={<PatientManagement />}/>



      </Routes>
    </BrowserRouter>
  );
}

export default App;
