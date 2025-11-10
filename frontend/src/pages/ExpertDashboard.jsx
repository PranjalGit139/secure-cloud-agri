import React, { useEffect, useState } from "react";
import axios from "axios";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";

export default function ExpertDashboard() {
  const [farmers, setFarmers] = useState([]);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [files, setFiles] = useState([]);
  const [loadingFarmers, setLoadingFarmers] = useState(true);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const navigate = useNavigate();

  // Fetch all farmers
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

  // Fetch files for selected farmer
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

  // Logout handler
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
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Expert Dashboard</h2>
        <button onClick={handleLogout} style={{ padding: "5px 10px", cursor: "pointer" }}>
          Logout
        </button>
      </div>

      {/* Farmers List */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Farmers</h3>
        {loadingFarmers ? (
          <p>Loading farmers...</p>
        ) : farmers.length === 0 ? (
          <p>No farmers found.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {farmers.map((farmer) => (
              <li
                key={farmer.username}
                style={{
                  margin: "8px 0",
                  cursor: "pointer",
                  color: selectedFarmer === farmer.username ? "blue" : "black",
                  textDecoration: selectedFarmer === farmer.username ? "underline" : "none",
                }}
                onClick={() => handleFarmerClick(farmer.username)}
              >
                {farmer.name} ({farmer.email})
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Farmer Files */}
      {selectedFarmer && (
        <div>
          <h3>Files of {selectedFarmer}</h3>
          {loadingFiles ? (
            <p>Loading files...</p>
          ) : files.length === 0 ? (
            <p>No files uploaded yet.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {files.map((file) => (
                <li key={file.key} style={{ margin: "5px 0" }}>
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    {file.key.split("/").pop()}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
