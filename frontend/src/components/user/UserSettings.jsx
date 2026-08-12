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
import "./UserSettings.css";
import { Link, useNavigate } from "react-router-dom";
import apiAxios from "../../api/axiosConfig.js";
const BACKEND_URL = "http://localhost:3000"; // Porta del server Express
import defaultAvatar from "../../assets/default-avatar.png";
import { getCleanFileName } from "../../util/helper.js";

export default function UserSettings() {
  const { user, logout, isLoading } = useAuth();
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
        <p>Caricamento...</p>
      </div>
    );
  if (!user) return <div>Effettua il login per vedere questa pagina.</div>;

  const handleRequestVerification = async () => {
    try {
      console.log("handleRequestVerification");
      const response = await apiAxios.post("/api/auth/send-verification");
      console.log(response);

      alert("Controlla la tua posta! Ti abbiamo inviato il link.");
    } catch (err) {
      console.error("handleRequestVerification Errore nell'invio:", err);
    }
  };

  const stringImage = getCleanFileName(user.image);

  return (
    <div className="settings-container">
      <header className="settings-header">
        <h2>User settings</h2>
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
              <Bell size={18} />
              <Globe size={18} />
              <button className="button button-exit" onClick={handleLogout}>
                <LogOut size={18} className="logout-icon" />
              </button>
            </div>
          </div>
        </div>

      <section className="settings-menu">
        <div
          className={`menu-item ${user.isVerified ? "verified" : "unverified"}`}
        >
          <button onClick={handleRequestVerification} className="menu-text">
            <h4>
              {user.isVerified ? "Account Verified" : "Verify your account"}
            </h4>
            <p>
              {user.isVerified
                ? "You earned the Verify Account Badge!"
                : "Send a verifying email and earn a badge!"}
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
            <h4>Edit Profile</h4>
            <p>Edit avatar image and username</p>
          </div>
          <ChevronRight size={20} />
        </Link>

        <Link to="/user/profile/change-password" className="menu-item">
          <div className="menu-text">
            <h4>Change Password</h4>
            <p>Change your password</p>
          </div>
          <ChevronRight size={20} />
        </Link>

        <Link to="/user/profile/badges" className="menu-item">
          <div className="menu-text">
            <h4>Your badges</h4>
            <p>{user.badges?.length || 0} badges earned</p>
          </div>
          <ChevronRight size={20} />
        </Link>

        <Link to="/user/profile/settings" className="menu-item">
          <div className="menu-text">
            <h4>Change Settings</h4>
            <p>Choose different settings for your challenges</p>
          </div>
          <ChevronRight size={20} />
        </Link>
      </section>

      <section className="details-section">
        <h3>Details</h3>
        <div className="detail-field">
          <label>User ID</label>
          <input type="text" value={user._id} readOnly />
        </div>
        <div className="detail-field">
          <label>Avatar Image</label>
          <input type="text" value={stringImage} readOnly />
        </div>
      </section>
    </div>
  );
}
