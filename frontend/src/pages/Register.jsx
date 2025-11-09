// Register.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("farmer");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        email,
        password,
        name,
        role, 
      });

      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert("Registration failed: " + err.response?.data?.message || err.message);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Register</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
      <input type="text" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="farmer">Farmer</option>
        <option value="expert">Expert</option>
      </select>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}
