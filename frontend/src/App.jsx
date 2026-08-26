import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Layout & UI
import RootLayout from "./pages/RootLayout.jsx";
import UserLayout from "./pages/user/UserLayout.jsx";
import ErrorPage from "./pages/Error.jsx";

// Pages
import HomePage from "./pages/Home.jsx";
import LoginPage from "./pages/Login.jsx";
import RegisterPage from "./pages/Register.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import StatsLayout from "./components/stats/StatsLayout.jsx";
import TermsPage from "./pages/TermsPage.jsx";
import PrivacyPage from "./pages/PrivacyPage.jsx";
import CookiesPage from "./pages/CookiesPage.jsx";

// User Pages
import UserSettings from "./components/user/UserSettings.jsx";
import BadgesPage from "./components/user/BadgesPage.jsx";
import VerifyEmail from "./components/user/VerifyEmail.jsx";
import ChangePassword from "./components/user/ChangePassword.jsx";

// Context
import { useAuth } from "./components/context/AuthContext.jsx";
import EditProfile from "./components/user/EditProfile.jsx";
import ChallengesSettings from "./components/challenges/ChallengesSettings.jsx";

function App() {
  const { user, isLoading } = useAuth();
  const { t } = useTranslation();

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "login", element: <LoginPage /> },
        { path: "register", element: <RegisterPage /> },
        { path: "forgot-password", element: <ForgotPassword /> },
        { path: "reset-password/:token", element: <ResetPassword /> },
        { path: "verify-email/:token", element: <VerifyEmail /> },
        {
          path: "user",
          element: <UserLayout />,
          children: [
            {
              path: "profile",
              children: [
                { index: true, element: <UserSettings /> },
                { path: "edit", element: <EditProfile /> },
                { path: "badges", element: <BadgesPage /> },
                { path: "change-password", element: <ChangePassword /> },
              ],
            },
            { path: "stats", element: <StatsLayout /> },
            { path: "challenges", element: <ChallengesSettings />}
          ],
        },
        { path: "terms", element: <TermsPage /> },
        { path: "privacy", element: <PrivacyPage /> },
        { path: "cookies", element: <CookiesPage /> },
      ],
    },
  ]);

  if (isLoading)
    return (
      <div>
        <p>{t("settings.loading")}</p>
      </div>
    );

  return <RouterProvider router={router} />;
}

export default App;
