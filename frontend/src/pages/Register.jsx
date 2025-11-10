import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("farmer");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post("https://secure-cloud-agri.onrender.com/api/auth/register", {
        email,
        password,
        name,
        role,
      });

      alert("✅ Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert("❌ Registration failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-300 via-emerald-200 to-green-400 relative overflow-hidden">

      {/* Floating Blobs */}
      <motion.div
        className="absolute w-64 h-64 bg-green-500/40 blur-3xl rounded-full top-10 left-10"
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-64 h-64 bg-green-700/30 blur-3xl rounded-full bottom-12 right-10"
        animate={{ x: [0, -60, 0], y: [0, -40, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Glass Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="backdrop-blur-xl bg-white/40 p-10 rounded-3xl shadow-xl border border-white/30 w-[90%] max-w-[450px] text-center"
      >
        <h1 className="text-4xl font-extrabold text-green-700 drop-shadow-lg">
          🌿 Create Account
        </h1>
        <p className="text-gray-700 mt-1">Join AgroCloud Smart Farming</p>

        <div className="mt-8 space-y-5">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/70 border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none"
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/70 border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none"
          />

          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/70 border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/70 border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none"
          >
            <option value="farmer">👨‍🌾 Farmer</option>
            <option value="expert">🧑‍🔬 Expert</option>
          </select>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleRegister}
          className="mt-8 w-full py-3 bg-green-600 hover:bg-green-700 text-white text-lg rounded-xl shadow-lg transition"
        >
          Create Account
        </motion.button>

        <p className="mt-6 text-gray-700">
          Already have an account?
          <button
            onClick={() => navigate("/login")}
            className="text-blue-700 font-semibold hover:underline ml-1"
          >
            Login
          </button>
        </p>

        <p className="mt-6 text-xs text-gray-600">
          © 2025 AgroCloud • Cultivating Smart Agriculture 🌾
        </p>
      </motion.div>
    </div>
  );
}
