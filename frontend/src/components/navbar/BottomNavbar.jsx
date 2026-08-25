import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Home, ChartSpline, FolderOpen, User } from "lucide-react"; // Usiamo Lucide per icone moderne
import { useTranslation } from "react-i18next";
import "./BottomNavbar.css";

export default function BottomNavbar() {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (!user) return null;

  return (
    <div className="bottom-nav">
      <div className="bottom-nav-container">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
          end
        >
          <Home size={24} />
          <span>{t("menu.home")}</span>
        </NavLink>

        <NavLink
          to="/user/stats"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <ChartSpline size={24} />
          <span>{t("menu.stats")}</span>
        </NavLink>

        <NavLink
          to="/user/challenges"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <FolderOpen size={24} />
          <span>{t("menu.challenges")}</span>
        </NavLink>

        <NavLink
          to="/user/profile"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <User size={24} />
          <span>{t("menu.user")}</span>
        </NavLink>
      </div>
    </div>
  );
}
