import React, { useEffect, useState } from "react";
import axios from "axios";
import { Auth } from "aws-amplify";
import { motion } from "framer-motion";

export default function ViewFiles() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const session = await Auth.currentSession();
        const token = session.getIdToken().getJwtToken();

        const response = await axios.get("https://secure-cloud-agri.onrender.com/api/data/list", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFiles(response.data.files);
      } catch (err) {
        console.error("Error fetching files:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const handleDelete = async (key) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();

      await axios.delete(
        `https://secure-cloud-agri.onrender.com/api/data/delete/${encodeURIComponent(key)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFiles((prev) => prev.filter((file) => file.key !== key));
    } catch (err) {
      console.error("Error deleting file:", err);
      alert("Failed to delete file.");
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "40px" }}>Loading files...</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        maxWidth: "900px",
        margin: "60px auto",
        padding: "20px",
        borderRadius: "12px",
        background: "#f0fff4", // Mint green light
        boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "25px" }}>📂 Your Uploaded Files</h2>

      {files.length === 0 ? (
        <p style={{ textAlign: "center" }}>No files uploaded yet.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#38a169", color: "white" }}>
              <th style={thStyle}>File Name</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, index) => (
              <motion.tr
                key={file.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                style={{ background: index % 2 === 0 ? "#e6ffed" : "white" }}
              >
                <td style={tdStyle}>
                  <a href={file.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "#2f855a", fontWeight: "600" }}>
                    {file.key.split("/").pop()}
                  </a>
                </td>
                <td style={tdStyle}>
                  <motion.button
                    whileHover={{ scale: 1.07 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handleDelete(file.key)}
                    style={{
                      background: "#e53e3e",
                      border: "none",
                      padding: "8px 14px",
                      color: "white",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "500",
                    }}
                  >
                    Delete
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      )}
    </motion.div>
  );
}

const thStyle = {
  padding: "12px",
  textAlign: "center",
  fontSize: "15px",
  fontWeight: "600",
};

const tdStyle = {
  padding: "12px",
  textAlign: "center",
};
