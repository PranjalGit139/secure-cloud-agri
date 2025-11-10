import React from "react";
import { useNavigate } from "react-router-dom";

import { Auth } from "aws-amplify";

export default function FarmerDashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await Auth.signOut();
    navigate("/login");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>Farmer Dashboard</h1>
      <button onClick={() => navigate("/upload")}>Upload / Replace</button>
      <button onClick={() => navigate("/viewfiles")}>View Files</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
