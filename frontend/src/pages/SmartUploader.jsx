import React, { useState } from "react";
import { Auth } from "aws-amplify";
import axios from "axios";
import { jsPDF } from "jspdf";

export default function SmartUploader() {
  const [form, setForm] = useState({
    name: "",
    crop: "",
    location: "",
    condition: "",
    cost: "",
    sellingPrice: "",
    notes: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const handleGenerateAndUpload = async () => {
    if (!image) {
      alert("Please upload a crop image!");
      return;
    }

    setLoading(true);
    try {
      // 🔹 Get current user session
      const user = await Auth.currentAuthenticatedUser();
      const token = user.signInUserSession.idToken.jwtToken;

      // 🧠 Step 1: Generate AI report
const prompt = `
Generate a detailed agricultural report in plain text format only (no Markdown, no bullet points).
This report will be provided to an expert who may not be familiar with the specific crop or region.

Include:
1. A brief background of the crop in the given location (climate, soil, suitability).
2. The farmer's current crop details and observed condition.
3. A short economic analysis based on the cost and selling price.
4. Expert recommendations for improving yield and sustainability.

Make sure the report uses full sentences and proper spacing.

Farmer: ${form.name}
Crop: ${form.crop}
Location: ${form.location}
Condition: ${form.condition}
Cost of Production: ${form.cost}
Selling Price: ${form.sellingPrice}
Notes: ${form.notes}
`;

      const llmRes = await axios.post("https://secure-cloud-agri.onrender.com/api/llm/generate", { prompt });
      var aiText = llmRes.data.output || "AI summary not available.";

function cleanTextForPDF(text) {
  return text
    // remove weird unicode and non-printable chars
    .replace(/[^\x20-\x7E]/g, " ")
    // normalize newlines
    .replace(/[\r\n]+/g, "\n")
    // collapse multiple spaces
    .replace(/\s+/g, " ")
    // fix smart quotes
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    // fix weird slashes and spacing
    .replace(/\/\s+/g, "/")
    .replace(/\s+\/+/g, "/")
    .trim();
}


         aiText = cleanTextForPDF(aiText);

      // 🧾 Step 2: Create PDF
      const doc = new jsPDF();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("Smart Crop Report", 70, 20);

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Farmer Name: ${form.name}`, 20, 40);
      doc.text(`Crop: ${form.crop}`, 20, 50);
      doc.text(`Location: ${form.location}`, 20, 60);
      doc.text(`Condition: ${form.condition}`, 20, 70);
      doc.text(`Cost of Production: ${form.cost}`, 20, 80);
      doc.text(`Selling Price: ${form.sellingPrice}`, 20, 90);
      doc.text(`Notes: ${form.notes}`, 20, 100);

      doc.text("AI-Generated Report:", 20, 120);
      const cleanText = aiText.replace(/\*|#|`|_/g, "").trim(); // remove stray markdown
      const splitText = doc.splitTextToSize(cleanText, 170);
      doc.text(splitText, 20, 130);

      // 🖼️ Step 3: Add image page
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imgData = e.target.result;

        doc.addPage();
        doc.text("Crop Image", 20, 20);
        doc.addImage(imgData, "JPEG", 20, 30, 160, 120);

        // Convert to Blob
        const pdfBlob = doc.output("blob");
        const pdfFile = new File([pdfBlob], `${form.crop}_report.pdf`, { type: "application/pdf" });

        // 🗂️ Step 4: Upload to backend (which stores in S3)
        const formData = new FormData();
        formData.append("file", pdfFile);

        const uploadRes = await axios.post("http://localhost:5000/api/data/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("✅ Uploaded to S3:", uploadRes.data);
        alert("✅ PDF report created and uploaded successfully!");
        setLoading(false);
      };

      reader.readAsDataURL(image);
    } catch (err) {
      console.error("❌ Error generating/uploading:", err);
      alert("Upload failed — check console for details.");
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "30px auto", textAlign: "center" }}>
      <h2>🌾 Smart Crop Report Generator</h2>

      {["name", "crop", "location", "condition", "cost", "sellingPrice", "notes"].map((field) => (
        <input
          key={field}
          type="text"
          name={field}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          value={form[field]}
          onChange={handleChange}
          style={{ display: "block", margin: "10px auto", width: "90%", padding: "8px" }}
        />
      ))}

      <input type="file" accept="image/*" onChange={handleImageUpload} style={{ marginTop: "10px" }} />

      <button
        onClick={handleGenerateAndUpload}
        disabled={loading}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        {loading ? "Generating & Uploading..." : "Generate & Upload PDF"}
      </button>
    </div>
  );
}
