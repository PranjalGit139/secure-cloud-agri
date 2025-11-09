import React, { useEffect, useState } from "react";
import axios from "axios";
import { Auth } from "aws-amplify";

export default function ViewFiles() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const session = await Auth.currentSession();
        const token = session.getIdToken().getJwtToken();

        const response = await axios.get("http://localhost:5000/api/data/list", {
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

      await axios.delete(`http://localhost:5000/api/data/delete/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove the file from state after deletion
      setFiles((prevFiles) => prevFiles.filter((file) => file.key !== key));
    } catch (err) {
      console.error("Error deleting file:", err);
      alert("Failed to delete file.");
    }
  };

  if (loading) return <p>Loading files...</p>;

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>Your Uploaded Files</h2>
      {files.length === 0 ? (
        <p>No files uploaded yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {files.map((file) => (
            <li key={file.key} style={{ margin: "10px 0", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <a href={file.url} target="_blank" rel="noopener noreferrer" style={{ marginRight: "10px" }}>
                {file.key.split("/").pop()}
              </a>
              <button
                onClick={() => handleDelete(file.key)}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
