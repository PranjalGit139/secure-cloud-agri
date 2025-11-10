import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  const images = [
    "https://images.pexels.com/photos/167364/pexels-photo-167364.jpeg",
    "https://images.pexels.com/photos/219794/pexels-photo-219794.jpeg",
    "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg",
  ];

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    await Auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Carousel */}
      <div className="relative w-full h-[55vh] overflow-hidden">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt="farm"
            className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
              index === i ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-wide drop-shadow-lg">
            Farmer Dashboard
          </h1>
        </div>
      </div>

      {/* Buttons Section */}
      <div className="flex flex-col md:flex-row justify-center gap-6 mt-10 px-4">
        <button
          onClick={() => navigate("/upload")}
          className="px-8 py-3 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 hover:shadow-green-400/50 hover:scale-105 transition-transform"
        >
          Upload / Replace
        </button>

        <button
          onClick={() => navigate("/viewfiles")}
          className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 hover:shadow-blue-400/50 hover:scale-105 transition-transform"
        >
          View Files
        </button>

        <button
          onClick={handleLogout}
          className="px-8 py-3 bg-red-600 text-white font-medium rounded-lg shadow-md hover:bg-red-700 hover:shadow-red-400/50 hover:scale-105 transition-transform"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
