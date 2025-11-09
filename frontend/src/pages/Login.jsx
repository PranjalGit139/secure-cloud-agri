import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const user = await Auth.signIn(email, password);
      console.log("User object:", user); // Debugging

      // Handle NEW_PASSWORD_REQUIRED challenge
      if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
        alert("Please set a new password for your account.");
        return;
      }

      // Handle unconfirmed users
      if (user.challengeName === "SMS_MFA" || user.challengeName === "MFA_SETUP") {
        alert("Multi-factor authentication required. Please complete setup.");
        return;
      }

      if (!user.signInUserSession) {
        alert("Login session not available. Is your account confirmed?");
        return;
      }

      // Store tokens
      const { idToken, accessToken, refreshToken } = user.signInUserSession;
      localStorage.setItem("idToken", idToken.jwtToken);
      localStorage.setItem("accessToken", accessToken.jwtToken);
      localStorage.setItem("refreshToken", refreshToken.jwtToken);

      // Redirect based on groups
      const groups = idToken.payload["cognito:groups"] || [];
      console.log("Groups:", groups);

      if (groups.includes("admin")) navigate("/admin-dashboard");
      else if (groups.includes("farmer")) navigate("/farmer-dashboard");
      else if (groups.includes("expert")) navigate("/expert-dashboard");
      else navigate("/");

    } catch (err) {
      console.error("Login error:", err);
      if (err.code === "UserNotConfirmedException") {
        alert("User not confirmed. Check your email for verification link.");
      } else if (err.code === "NotAuthorizedException") {
        alert("Incorrect username or password.");
      } else {
        alert("Login failed: " + err.message);
      }
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", margin: "10px auto", padding: "8px", width: "250px" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", margin: "10px auto", padding: "8px", width: "250px" }}
      />
      <button onClick={handleLogin} style={{ padding: "8px 16px", marginTop: "10px" }}>
        Login
      </button>

      {/* Register Button */}
      <p style={{ marginTop: "15px" }}>
        Don't have an account?{" "}
        <button
          onClick={() => navigate("/register")}
          style={{
            padding: "5px 12px",
            marginLeft: "5px",
            cursor: "pointer",
            borderRadius: "4px",
            border: "1px solid #007bff",
            backgroundColor: "#007bff",
            color: "white",
          }}
        >
          Register
        </button>
      </p>
    </div>
  );
}
