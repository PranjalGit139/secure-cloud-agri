import React from "react";
import { useNavigate } from "react-router-dom";
import farmingImage from "../assets/farming.png"; // Place your farmer/farming image here

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-green-100 via-white to-blue-100 px-6">
      
      {/* Heading */}
      <div className="text-center max-w-xl">
        <h1 className="text-5xl font-extrabold text-green-700 drop-shadow-md">
          🌾 AgroCloud
        </h1>
        <p className="mt-3 text-gray-700 text-lg leading-relaxed">
          A secure cloud platform to store, analyze and share agricultural data.
        </p>
      </div>

      {/* Farming Image */}
      <div className="mt-10">
        <img
          src={farmingImage}
          alt="Farmer Farming"
          className="w-full max-w-lg rounded-xl shadow-lg object-cover animate-fadeIn"
        />
      </div>

      {/* Buttons */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate("/login")}
          className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1"
        >
          Login
        </button>

        <button
          onClick={() => navigate("/register")}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1"
        >
          Register
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-14 text-gray-500 text-sm">
        © {new Date().getFullYear()} AgroCloud — Secure Farming, Smart Future 🌱
      </footer>
    </div>
  );
}
