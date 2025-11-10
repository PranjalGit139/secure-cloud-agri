import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SmartUploader from "./pages/SmartUploader";
import ViewFiles from "./pages/ViewFiles";
import FarmerDashboard from "./pages/FarmerDashboard";
import ExpertDashboard from "./pages/ExpertDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Register from "./pages/Register";
import LandingPage from "./pages/LandingPage";
import LlmWidget from "./pages/LlmWidget";
import ProtectedRoute from "./protectedRoutes"; // ✅ added

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ Protected routes */}
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <SmartUploader />
            </ProtectedRoute>
          }
        />
        <Route
          path="/viewfiles"
          element={
            <ProtectedRoute>
              <ViewFiles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farmer-dashboard"
          element={
            <ProtectedRoute>
              <FarmerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/expert-dashboard"
          element={
            <ProtectedRoute>
              <ExpertDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* ✅ Always visible chat widget */}
      <LlmWidget />
    </Router>
  );
}

export default App;
