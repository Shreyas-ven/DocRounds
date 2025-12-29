import "../styles/termsPage.css";
import React, { useEffect } from "react";


function TermsPage() {

     useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (

    
    <div className="terms-container">
      <h1>Terms & Conditions</h1>
      <p className="last-updated">Last Updated: January 2026</p>

      {/* ===== GENERAL TERMS ===== */}
      <section className="terms-section">
        <h2>1. General Terms</h2>
        <p>
          DocRounds is a digital healthcare management platform designed to
          facilitate communication between hospitals, doctors, patients, and
          administrators. By accessing or using this platform, you agree to
          comply with and be bound by these Terms & Conditions.
        </p>
        <p>
          DocRounds does not replace professional medical judgment and is meant
          solely for information management and communication.
        </p>
      </section>

      {/* ===== DOCTOR TERMS ===== */}
      <section className="terms-section">
        <h2>2. Terms for Doctors</h2>
        <ul>
          <li>
            Doctors must ensure that all medical updates entered during daily
            rounds are accurate, timely, and truthful.
          </li>
          <li>
            Medical records should only be accessed for patients under the
            doctor’s direct care.
          </li>
          <li>
            Doctors are responsible for maintaining the confidentiality of
            patient data and login credentials.
          </li>
          <li>
            DocRounds is not responsible for medical decisions made based on
            incorrect or incomplete information entered by doctors.
          </li>
        </ul>
      </section>

      {/* ===== PATIENT TERMS ===== */}
      <section className="terms-section">
        <h2>3. Terms for Patients</h2>
        <ul>
          <li>
            Patients may view medical updates, prescriptions, and treatment
            progress provided by authorized doctors.
          </li>
          <li>
            The platform does not guarantee treatment outcomes or medical
            recovery.
          </li>
          <li>
            Patients must not misuse or attempt to alter medical data shown on
            the platform.
          </li>
          <li>
            Emergency situations should be handled by contacting hospitals or
            emergency services directly.
          </li>
        </ul>
      </section>

      {/* ===== HOSPITAL TERMS ===== */}
      <section className="terms-section">
        <h2>4. Terms for Hospitals</h2>
        <ul>
          <li>
            Hospitals must provide valid registration details, licenses, and
            identification during onboarding.
          </li>
          <li>
            Hospitals are responsible for managing doctor accounts and ensuring
            that only authorized personnel access the system.
          </li>
          <li>
            Any misuse of the platform may result in suspension or termination
            of hospital access.
          </li>
          <li>
            Hospitals must comply with applicable healthcare regulations and
            data protection laws.
          </li>
        </ul>
      </section>

      {/* ===== ADMIN TERMS ===== */}
      <section className="terms-section">
        <h2>5. Terms for Admin</h2>
        <ul>
          <li>
            Admins have the authority to verify, approve, or reject hospital
            registrations.
          </li>
          <li>
            Admins must ensure fair, unbiased, and accurate verification of
            submitted hospital details.
          </li>
          <li>
            Admins are responsible for maintaining system integrity and
            monitoring misuse.
          </li>
          <li>
            Admin actions are logged and monitored for security and audit
            purposes.
          </li>
        </ul>
      </section>

      {/* ===== DATA & PRIVACY ===== */}
      <section className="terms-section">
        <h2>6. Data Privacy & Security</h2>
        <p>
          DocRounds implements industry-standard security practices to protect
          user data. However, no digital platform can guarantee absolute
          security.
        </p>
        <p>
          By using DocRounds, you consent to the collection and processing of
          data necessary for healthcare operations.
        </p>
      </section>

      {/* ===== TERMINATION ===== */}
      <section className="terms-section">
        <h2>7. Termination of Access</h2>
        <p>
          DocRounds reserves the right to suspend or terminate any account found
          violating these Terms & Conditions without prior notice.
        </p>
      </section>

      {/* ===== DISCLAIMER ===== */}
      <section className="terms-section">
        <h2>8. Disclaimer</h2>
        <p>
          DocRounds is an information management system and does not provide
          direct medical advice, diagnosis, or treatment.
        </p>
      </section>

      {/* ===== CONTACT ===== */}
      <section className="terms-section">
        <h2>9. Contact Information</h2>
        <p>
          For any queries regarding these Terms & Conditions, please contact us
          at <strong>support@docrRounds.com</strong>.
        </p>
      </section>
    </div>
  );
}

export default TermsPage;
