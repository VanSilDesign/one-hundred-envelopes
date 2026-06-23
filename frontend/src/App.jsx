import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Layout & UI
import RootLayout from "./pages/RootLayout.jsx";
import UserLayout from "./pages/user/UserLayout.jsx";
import ErrorPage from "./pages/Error.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

// Pages
import HomePage from "./pages/Home.jsx";
import LoginPage from "./pages/Login.jsx";
import RegisterPage from "./pages/Register.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import DashboardPage from "./pages/Dashboard.jsx";
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

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <HomePage user={user} /> },
        { path: "login", element: <LoginPage /> },
        { path: "register", element: <RegisterPage /> },
        { path: "forgot-password", element: <ForgotPassword /> },
        { path: "reset-password/:token", element: <ResetPassword /> },
        { path: "verify-email/:token", element: <VerifyEmail /> },
        {
          path: "user",
          element: <UserLayout />,
          children: [
            { path: "dashboard", element: <DashboardPage /> },
            { path: "history", element: <EnvelopesHistory /> },
            { path: "profile", element: <UserSettings /> },
            { path: "badges", element: <BadgesPage /> },
          ],
        },
        { path: "setting", element: <Settings /> },
        { path: "stats", element: <StatsLayout /> },
        { path: "setting", element: <Settings /> },
      ],
    },
  ]);

  if (isLoading)
    return (
      <div>
        <p>Caricamento...</p>
      </div>
    );

  return <RouterProvider router={router} />;
}

export default App;
