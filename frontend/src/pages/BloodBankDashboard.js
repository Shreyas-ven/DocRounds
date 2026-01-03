import React, { useEffect, useState } from "react";
import "../styles/BloodBankDashboard.css";

function BloodBankDashboard() {
  const [bloodRequests, setBloodRequests] = useState([]);

  useEffect(() => {
  fetch("http://localhost:5000/api/blood/all")
    .then(res => res.json())
    .then(data => setBloodRequests(data))
    .catch(err => console.error(err));
}, []);


  const calculateRemainingTime = (date, time) => {
    const target = new Date(`${date}T${time}`);
    const now = new Date();
    const diff = target - now;

    if (diff <= 0) return "Time Over";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    return `${hours}h ${minutes}m remaining`;
  };

  const handleDonate = async (id, donorName, donorContact) => {
    await fetch(`http://localhost:5000/api/blood/donate/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ donorName, donorContact })
    });

    alert("Thank you for donating ❤️");

    setBloodRequests(prev =>
      prev.filter(b => b._id !== id)
    );
  };

  return (
    <div className="blood-dashboard">
      <h1>🚨 Emergency Blood Requirement</h1>

      <div className="blood-grid">
        {bloodRequests.map(blood => {
          let donorName = "";
          let donorContact = "";

          return (
            <div className="blood-card" key={blood._id}>
              <h2>{blood.bloodType} Blood Needed</h2>

              <p>
                Patient from <b>{blood.hospitalName}</b> suffering from{" "}
                <b>{blood.disease}</b>
              </p>

              <p className="deadline">
                ⏳ {calculateRemainingTime(
                  blood.requiredBeforedate,
                  blood.requiredBeforetime
                )}
              </p>

              <input
                type="text"
                placeholder="Donor Name"
                onChange={e => donorName = e.target.value}
              />

              <input
                type="text"
                placeholder="Donor Contact Number"
                onChange={e => donorContact = e.target.value}
              />

              <button
                onClick={() =>
                  handleDonate(blood._id, donorName, donorContact)
                }
              >
                Donate Blood
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BloodBankDashboard;
