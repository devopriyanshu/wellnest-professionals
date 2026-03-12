import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoute";

// Auth & Entry
import RoleSelectionPage from "./pages/RoleSelectionPage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import GoogleCallbackPage from "./pages/auth/GoogleCallbackPage";

// Expert Pages
import ExpertRegistrationPage from "./pages/expert/ExpertRegistrationPage";
import ExpertDashboard from "./pages/expert/ExpertDashboard";
import PatientLogsPage from "./pages/expert/PatientLogsPage";
import ExpertPendingPage from "./pages/expert/PendingPage";
import ExpertRejectedPage from "./pages/expert/RejectedPage";

// Center Pages
import CenterRegistrationPage from "./pages/center/CenterRegistrationPage";
import CenterDashboard from "./pages/center/CenterDashboard";
import CenterPendingPage from "./pages/center/PendingPage";
import CenterRejectedPage from "./pages/center/RejectedPage";

function App() {
  return (
    <Routes>
      {/* Public Entry Routes */}
      <Route path="/" element={<RoleSelectionPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/auth/callback" element={<GoogleCallbackPage />} />

      {/* Protected Expert Routes */}
      <Route element={<ProtectedRoute allowedRoles={['expert']} />}>
        <Route path="/expert/register" element={<ExpertRegistrationPage />} />
        <Route path="/expert/pending" element={<ExpertPendingPage />} />
        <Route path="/expert/rejected" element={<ExpertRejectedPage />} />
        <Route path="/expert/dashboard" element={<ExpertDashboard />} />
        <Route path="/expert/patient/:userId/logs" element={<PatientLogsPage />} />
      </Route>

      {/* Protected Center Routes */}
      <Route element={<ProtectedRoute allowedRoles={['center']} />}>
        <Route path="/center/register" element={<CenterRegistrationPage />} />
        <Route path="/center/pending" element={<CenterPendingPage />} />
        <Route path="/center/rejected" element={<CenterRejectedPage />} />
        <Route path="/center/dashboard" element={<CenterDashboard />} />
      </Route>
      
      {/* Catch All - Redirect to Role Selection */}
      <Route path="*" element={<RoleSelectionPage />} />
    </Routes>
  );
}

export default App;
