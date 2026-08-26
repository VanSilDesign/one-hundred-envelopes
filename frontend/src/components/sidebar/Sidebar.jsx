import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose();
    navigate("/");
  };

  return (
    <>
      {/* Overlay: lo sfondo scuro che chiude il menu se cliccato */}
      {isOpen && <div className="backdrop" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>{t("menu.menu")}</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <nav className="sidebar-nav">
          {user ? (
            <div className="user-section">
              <p>
                {t("menu.welcome")}<strong>{user.username}</strong>!
              </p>
              <ul>
                <li>
                  <Link to="/" onClick={onClose}>
                    {t("menu.home")}
                  </Link>
                </li>
                <li>
                  <Link to="/settings" onClick={onClose}>
                    {t("menu.settings")}
                  </Link>
                </li>
                <li>
                  <button className="logout-btn" onClick={handleLogout}>
                    {t("common.logout")}
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="guest-section">
              <p>
                {t("common.intro")}
              </p>
              <Link to="/login" className="button" onClick={onClose}>
                {t("common.login")}
              </Link>
            </div>
          )}
        </nav>
      </aside>
    </>
  );
}
