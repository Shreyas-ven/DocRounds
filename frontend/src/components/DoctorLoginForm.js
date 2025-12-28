import React from "react";

function DoctorLoginForm() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Doctor Login</h2>

      <form>
        <input type="email" placeholder="Email" />
        <br /><br />
        <input type="password" placeholder="Password" />
        <br /><br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default DoctorLoginForm;
