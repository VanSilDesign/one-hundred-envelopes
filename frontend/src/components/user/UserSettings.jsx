import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import {
  User,
  Bell,
  Globe,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import apiAxios from "../../api/axiosConfig.js";
import { getCleanFileName } from "../../util/helper.js";
import { useTranslation } from "react-i18next";

import LanguagePicker from "../UI/LanguagePicker.jsx";
import defaultAvatar from "../../assets/default-avatar.png";
import "./UserSettings.css";

const BACKEND_URL = "http://localhost:3000"; // Porta del server Express

export default function UserSettings() {
  const { user, logout, isLoading } = useAuth();
  const { t } = useTranslation();
  console.log(user.image);

  const [previewUrl, setPreviewUrl] = useState(defaultAvatar);

  const navigate = useNavigate();

  useEffect(() => {
    if (user?.image) {
      setPreviewUrl(`${BACKEND_URL}${user.image}?t=${Date.now()}`);
    } else {
      setPreviewUrl(defaultAvatar);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (isLoading)
    return (
      <div>
        <p>{t("settings.loading")}</p>
      </div>
    );
  if (!user) return <div>{t("settings.no_login")}</div>;

  const handleRequestVerification = async () => {
    try {
      console.log("handleRequestVerification");
      const response = await apiAxios.post("/api/auth/send-verification");
      console.log(response);

      alert(`${t("settings.link_to_mail")}`);
    } catch (err) {
      console.error("handleRequestVerification Errore nell'invio:", err);
    }
  };

  const stringImage = getCleanFileName(user.image);

  const activeBadges = user.badges?.filter((b) => b.isUnlocked).length || 0;

  return (
    <div className="settings-container">
      <header className="settings-header">
        <h2>{t("settings.title")}</h2>
      </header>
      <div className="profile-section">
        <div className="avatar-placeholder">
          <img src={previewUrl} alt="Avatar Image" />
        </div>
        <div className="profile-info">
          {/* Usiamo lo username dal JSON */}
          <h3>
            {user.username} <span className="badge-user">{user.role}</span>
          </h3>

          <div className="quick-actions">
            <div className="icons-box">
              <button id="bell" className="button button-flat">
                <Bell size={18} />
              </button>

              <LanguagePicker />

              <button className="button button-flat" onClick={handleLogout}>
                <LogOut size={18} className="logout-icon" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="settings-menu">
        <div
          className={`menu-item ${user.isVerified ? "verified" : "unverified"}`}
        >
          <button onClick={handleRequestVerification} className="menu-text">
            <h4>
              {user.isVerified
                ? `${t("settings.account_verified")}`
                : `${t("settings.verify_account")}`}
            </h4>
            <p>
              {user.isVerified
                ? `${t("settings.badges_earned")}`
                : `${t("settings.verify_email")}`}
            </p>
          </button>
          {user.isVerified ? (
            <ShieldCheck size={20} color="green" />
          ) : (
            <ChevronRight size={20} />
          )}
        </div>

        <Link to="/user/profile/edit" className="menu-item">
          <div className="menu-text">
            <h4>{t("settings.edit_profile")}</h4>
            <p>{t("settings.edit_profile_desc")}</p>
          </div>
          <ChevronRight size={20} />
        </Link>

        <Link to="/user/profile/change-password" className="menu-item">
          <div className="menu-text">
            <h4>{t("settings.change_password")}</h4>
            <p>{t("settings.change_password_desc")}</p>
          </div>
          <ChevronRight size={20} />
        </Link>

        <Link to="/user/profile/badges" className="menu-item">
          <div className="menu-text">
            <h4>{t("settings.badges.title")}</h4>
            <p>{t("settings.badges.count", { count: activeBadges })}</p>
          </div>
          <ChevronRight size={20} />
        </Link>

        <Link to="/user/profile/settings" className="menu-item">
          <div className="menu-text">
            <h4>{t("settings.change_settings")}</h4>
            <p>{t("settings.change_settings_desc")}</p>
          </div>
          <ChevronRight size={20} />
        </Link>
      </section>

      <section className="details-section">
        <h3>{t("settings.details")}</h3>
        <div className="detail-field">
          <label>{t("settings.user_id")}</label>
          <input type="text" value={user._id} readOnly />
        </div>
        <div className="detail-field">
          <label>{t("settings.avatar_image")}</label>
          <input type="text" value={stringImage} readOnly />
        </div>
      </section>
    </div>
  );
}
