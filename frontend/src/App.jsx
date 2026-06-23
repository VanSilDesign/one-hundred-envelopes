import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Layout & UI
import Header from "./components/Header.jsx";
import Sidebar from "./components/sidebar/Sidebar.jsx";
import Modal from "./components/modals/Modal.jsx";
import ErrorPage from "./components/modals/ErrorPage";
import PrivateRoute from "./components/PrivateRoute.jsx";
import BottomNavbar from "./components/navbar/BottomNavbar.jsx";

// Pages
import HomePage from "./components/HomePage.jsx";
import LoginPage from "./components/LoginPage.jsx";
import RegisterPage from "./components/RegisterPage";
import ResetPassword from "./components/ResetPassword.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";
import DashboardPage from "./components/DashboardPage.jsx"; // La tua nuova Dashboard a quadratini
import StatsLayout from "./components/stats/StatsLayout.jsx";
import EnvelopesHistory from "./components/envelopes/EnvelopeHistory.jsx";

// User Pages
import UserSettings from "./components/user/UserSettings.jsx";
import Settings from "./components/Settings.jsx";
import BadgesPage from "./components/user/BadgesPage.jsx";
import VerifyEmail from "./components/user/VerifyEmail.jsx";

// Context
import { useAuth } from "./components/context/AuthContext.jsx";

function App() {

  const { user, isLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [error, setError] = useState(null);

  if (isLoading)
    return (
      <div>
        <p>Caricamento...</p>
      </div>
    );

  return (
    <Router>
      {/* Gestione Errori Globale */}
      <Modal open={!!error} onClose={() => setError(null)}>
        {error && (
          <ErrorPage
            title="Errore"
            message={error.message}
            onConfirm={() => setError(null)}
          />
        )}
      </Modal>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Header onMenuClick={() => setIsSidebarOpen(true)} />

      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route path="/" element={<HomePage user={user} />} />

          {/* Private Routes - Challenge & Stats */}
          <Route
            path="/user/dashboard"
            element={
              <PrivateRoute user={user}>
                {/* Qui ora passeremo alla DashboardPage che caricherà i suoi dati internamente */}
                <DashboardPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/user/history"
            element={
              <PrivateRoute user={user}>
                <EnvelopesHistory />
              </PrivateRoute>
            }
          />

          <Route
            path="/stats"
            element={
              <PrivateRoute user={user}>
                <StatsLayout />
              </PrivateRoute>
            }
          />

          {/* User Setting */}

          <Route
            path="/profile"
            element={
              <PrivateRoute user={user}>
                <UserSettings />
              </PrivateRoute>
            }
          />

          <Route path="/verify-email/:token" element={<VerifyEmail />} />

          <Route
            path="/settings"
            element={
              <PrivateRoute user={user}>
                <Settings />
              </PrivateRoute>
            }
          />

          <Route
            path="/badges"
            element={
              <PrivateRoute user={user}>
                <BadgesPage />
              </PrivateRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <BottomNavbar />
      </main>
    </Router>
  );
}

export default App;
