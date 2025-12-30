import React from "react";
import { useParams } from "react-router-dom";

function PatientManagement() {
  const { hospitalId } = useParams();

  return (
    <div>
      <h1>Patient Management</h1>
      <p>Hospital ID: {hospitalId}</p>
    </div>
  );
}

export default PatientManagement;
