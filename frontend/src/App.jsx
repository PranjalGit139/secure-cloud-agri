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


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/upload" element={<SmartUploader />} />
        <Route path="/viewfiles" element={<ViewFiles />} />
        <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
        <Route path="/expert-dashboard" element={<ExpertDashboard />}/>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />


      </Routes>

      <LlmWidget />
       
    </Router>
  );
}

export default App;
