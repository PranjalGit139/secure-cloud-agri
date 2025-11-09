import React, { useState } from "react";
import { Auth } from "aws-amplify";
import axios from "axios";

const Upload = () => {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    try {
      console.log("🔹 Getting current user...");
      const user = await Auth.currentAuthenticatedUser();
      const token = user.signInUserSession.idToken.jwtToken;
      console.log("✅ Got token:", token ? "Yes" : "No");

      const formData = new FormData();
      formData.append("file", file);

      console.log("📤 Uploading file:", file.name);

      const response = await axios.post("http://localhost:5000/api/data/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // <-- add Bearer if backend uses passport-jwt or similar
        },
      });

      console.log("✅ Upload successful:", response.data);
      alert("File uploaded successfully!");
    } catch (err) {
      console.error("❌ Upload failed:", err);

      if (err.response) {
        console.error("Server responded with:", err.response.status, err.response.data);
      } else if (err.request) {
        console.error("No response from server:", err.request);
      } else {
        console.error("Error setting up request:", err.message);
      }

      alert("Upload failed — check console for details.");
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default Upload;
