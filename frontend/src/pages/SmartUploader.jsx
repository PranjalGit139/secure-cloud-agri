import React, { useState } from "react";
import { Auth } from "aws-amplify";
import axios from "axios";
import { jsPDF } from "jspdf";
import { motion } from "framer-motion";

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
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleGenerateAndUpload = async () => {
    if (!image) return alert("Please upload a crop image!");

    setLoading(true);
    try {
      const user = await Auth.currentAuthenticatedUser();
      const token = user.signInUserSession.idToken.jwtToken;

      const prompt = `
        Generate a detailed agriculture report...
        Crop: ${form.crop}, Location: ${form.location}, Condition: ${form.condition}
        Cost: ${form.cost}, Selling Price: ${form.sellingPrice}, Notes: ${form.notes}
      `;

      const llmRes = await axios.post("https://secure-cloud-agri.onrender.com/api/llm/generate", { prompt });
      let aiText = llmRes.data.output || "AI summary not available.";

      aiText = aiText.replace(/[^\x20-\x7E]/g, " ").replace(/\s+/g, " ").trim();

      const doc = new jsPDF();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("Smart Crop Report", 70, 20);
      doc.setFontSize(12);
      doc.text(`Farmer Name: ${form.name}`, 20, 40);
      doc.text(`Crop: ${form.crop}`, 20, 50);
      doc.text(`Location: ${form.location}`, 20, 60);
      doc.text(`Condition: ${form.condition}`, 20, 70);
      doc.text(`Cost of Production: ${form.cost}`, 20, 80);
      doc.text(`Selling Price: ${form.sellingPrice}`, 20, 90);
      doc.text(`Notes: ${form.notes}`, 20, 100);
      doc.text("AI Report:", 20, 120);
      doc.text(doc.splitTextToSize(aiText, 170), 20, 130);

      const reader = new FileReader();
      reader.onload = async (e) => {
        doc.addPage();
        doc.text("Crop Image", 20, 20);
        doc.addImage(e.target.result, "JPEG", 20, 30, 160, 120);

        const pdfBlob = doc.output("blob");
        const pdfFile = new File([pdfBlob], `${form.crop}_report.pdf`, { type: "application/pdf" });

        const formData = new FormData();
        formData.append("file", pdfFile);

        await axios.post("http://localhost:5000/api/data/upload", formData, {
          headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
        });

        alert("✅ PDF Generated & Uploaded Successfully!");
        setLoading(false);
      };

      reader.readAsDataURL(image);
    } catch (err) {
      console.error(err);
      alert("❌ Upload failed");
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className="max-w-xl mx-auto mt-10 p-8 rounded-xl shadow-xl bg-white/30 backdrop-blur-xl border border-white/40"
    >
      <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-green-600 to-emerald-400 text-transparent bg-clip-text mb-6">
        🌾 Smart Crop Report Generator
      </h2>

      <div className="flex flex-col gap-3">
        {Object.keys(form).map((field) => (
          <input
            key={field}
            name={field}
            type="text"
            placeholder={field.replace(/([A-Z])/g, " $1")}
            value={form[field]}
            onChange={handleChange}
            className="px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
          />
        ))}

        <input type="file" accept="image/*" onChange={handleImageUpload} className="mt-2" />

        {preview && (
          <motion.img
            src={preview}
            alt="preview"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full h-48 object-cover rounded-lg shadow-md"
          />
        )}

        <button
          onClick={handleGenerateAndUpload}
          disabled={loading}
          className="mt-4 py-3 text-lg font-semibold rounded-lg bg-gradient-to-r from-green-600 to-lime-500 text-white shadow-lg hover:scale-105 active:scale-95 transition-transform"
        >
          {loading ? "⏳ Generating & Uploading..." : "⚡ Generate & Upload PDF"}
        </button>
      </div>
    </motion.div>
  );
}
