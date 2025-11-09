// LandingPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
        textAlign: "center",
      }}
    >
      <h1>Welcome to AgroCloud</h1>
      <p>Please login or register to continue</p>
      
      <div style={{ marginTop: "30px" }}>
        <button
          onClick={() => navigate("/login")}
          style={{
            padding: "10px 20px",
            margin: "10px",
            fontSize: "16px",
            cursor: "pointer",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#4CAF50",
            color: "white",
          }}
        >
          Login
        </button>

        <button
          onClick={() => navigate("/register")}
          style={{
            padding: "10px 20px",
            margin: "10px",
            fontSize: "16px",
            cursor: "pointer",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#2196F3",
            color: "white",
          }}
        >
          Register
        </button>
      </div>
    </div>
  );
}
