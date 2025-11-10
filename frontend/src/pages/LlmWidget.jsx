import React, { useState } from "react";
import { Send } from "lucide-react";
import axios from "axios";

export default function LlmWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post("https://secure-cloud-agri.onrender.com/api/llm/generate", {
        prompt: input,
      });
      setResponse(res.data.output || "No response received.");
    } catch (err) {
      console.error("LLM Error:", err);
      setResponse("❌ Error contacting the AI server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating LLM Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: "fixed",
            bottom: "25px",
            right: "25px",
            background: "#2563eb",
            color: "white",
            borderRadius: "50%",
            width: "60px",
            height: "60px",
            border: "none",
            cursor: "pointer",
            fontSize: "28px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
          }}
          title="Ask AI"
        >
          💬
        </button>
      )}

      {/* LLM Chat Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "350px",
            height: "420px",
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            fontFamily: "system-ui, sans-serif",
            zIndex: 9999,
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "#2563eb",
              color: "white",
              padding: "10px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h4 style={{ margin: 0 }}>AI Assistant 🤖</h4>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              ✖
            </button>
          </div>

          {/* Response area */}
          <div
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto",
              fontSize: "14px",
              whiteSpace: "pre-wrap",
              color: "#111",
            }}
          >
            {loading ? "💭 Generating response..." : response || "Ask me anything about your crops!"}
          </div>

          {/* Input area */}
          <div
            style={{
              display: "flex",
              borderTop: "1px solid #ddd",
              padding: "8px",
              gap: "6px",
            }}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                resize: "none",
                height: "45px",
              }}
            />
            <button
              onClick={handleSend}
              disabled={loading}
              style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "0 12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              title="Send"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
