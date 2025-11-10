import React, { useEffect, useState } from "react";
import axios from "axios";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function ExpertDashboard() {
  const [farmers, setFarmers] = useState([]);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [files, setFiles] = useState([]);
  const [loadingFarmers, setLoadingFarmers] = useState(true);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const session = await Auth.currentSession();
        const token = session.getIdToken().getJwtToken();

        const response = await axios.get(
          "https://secure-cloud-agri.onrender.com/api/data/farmers",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setFarmers(response.data.farmers);
      } catch (err) {
        console.error("Error fetching farmers:", err);
      } finally {
        setLoadingFarmers(false);
      }
    };

    fetchFarmers();
  }, []);

  const handleFarmerClick = async (farmerId) => {
    setSelectedFarmer(farmerId);
    setFiles([]);
    setLoadingFiles(true);

    try {
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();

      const response = await axios.get(
        `https://secure-cloud-agri.onrender.com/api/data/farmer/${farmerId}/files`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFiles(response.data.files);
    } catch (err) {
      console.error("Error fetching files:", err);
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleLogout = async () => {
    try {
      await Auth.signOut();
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-green-700"
        >
          Expert Dashboard
        </motion.h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow-lg"
        >
          Logout
        </motion.button>
      </div>

      {/* Farmers List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-6 rounded-xl shadow-lg mb-6"
      >
        <h3 className="text-xl font-semibold mb-4 text-green-800">Farmers</h3>

        {loadingFarmers ? (
          <p className="text-gray-500">Loading farmers...</p>
        ) : farmers.length === 0 ? (
          <p className="text-gray-500">No farmers found.</p>
        ) : (
          <ul>
            <AnimatePresence>
              {farmers.map((farmer) => (
                <motion.li
                  key={farmer.username}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  whileHover={{ scale: 1.03, backgroundColor: "#D1FAE5" }}
                  onClick={() => handleFarmerClick(farmer.username)}
                  className={`cursor-pointer p-3 rounded-lg mb-2 transition-colors ${
                    selectedFarmer === farmer.username
                      ? "bg-green-200 text-green-900 font-medium shadow-inner"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {farmer.name} ({farmer.email})
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </motion.div>

      {/* Files Section */}
      <AnimatePresence>
        {selectedFarmer && (
          <motion.div
            key={selectedFarmer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-4">
              Files uploaded by{" "}
              <span className="text-green-600">{selectedFarmer}</span>
            </h3>

            {loadingFiles ? (
              <p className="text-gray-500">Loading files...</p>
            ) : files.length === 0 ? (
              <p className="text-gray-500">No files uploaded yet.</p>
            ) : (
              <ul>
                {files.map((file) => (
                  <motion.li
                    key={file.key}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-2 border-b border-gray-200 hover:bg-gray-50 rounded-md"
                  >
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {file.key.split("/").pop()}
                    </a>
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
