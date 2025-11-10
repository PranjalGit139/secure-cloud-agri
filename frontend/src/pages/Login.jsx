import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const user = await Auth.signIn(email, password);

      if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
        alert("Please set a new password for your account.");
        return;
      }

      const { idToken, accessToken, refreshToken } = user.signInUserSession;
      localStorage.setItem("idToken", idToken.jwtToken);
      localStorage.setItem("accessToken", accessToken.jwtToken);
      localStorage.setItem("refreshToken", refreshToken.jwtToken);

      const groups = idToken.payload["cognito:groups"] || [];

      if (groups.includes("admin")) navigate("/admin-dashboard");
      else if (groups.includes("farmer")) navigate("/farmer-dashboard");
      else if (groups.includes("expert")) navigate("/expert-dashboard");
      else navigate("/");

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-300 via-emerald-200 to-green-400 relative overflow-hidden">

      {/* Floating Blobs */}
      <motion.div
        className="absolute w-64 h-64 bg-green-500/40 blur-3xl rounded-full top-12 left-10"
        animate={{ x: [0, 80, 0], y: [0, 40, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-64 h-64 bg-green-700/40 blur-3xl rounded-full bottom-14 right-12"
        animate={{ x: [0, -80, 0], y: [0, -40, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Glass Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="backdrop-blur-xl bg-white/40 p-10 rounded-3xl shadow-2xl border border-white/30 w-[90%] max-w-[420px] text-center"
      >
        <h1 className="text-4xl font-extrabold text-green-700 drop-shadow-lg">
          🌱 AgroCloud Login
        </h1>
        <p className="mt-2 text-gray-700">Secure | Smart | Cloud Farming</p>

        {/* Inputs */}
        <div className="mt-8 space-y-5">
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/70 border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none"
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/70 border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none"
          />
        </div>

        {/* Login Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleLogin}
          className="mt-8 w-full py-3 bg-green-600 hover:bg-green-700 text-white text-lg rounded-xl shadow-lg transition"
        >
          Login
        </motion.button>

        {/* Register Redirect */}
        <p className="mt-6 text-gray-700">
          Don’t have an account?
          <button
            onClick={() => navigate("/register")}
            className="text-blue-700 font-semibold hover:underline ml-1"
          >
            Register
          </button>
        </p>

        <p className="mt-6 text-xs text-gray-600">
          © 2025 AgroCloud • Smart Farming Starts Here 🌾
        </p>
      </motion.div>
    </div>
  );
}
