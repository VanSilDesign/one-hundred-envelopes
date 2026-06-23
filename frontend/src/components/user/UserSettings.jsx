import useAuth from "../../hooks/useAuth";
import {
  User,
  Bell,
  Globe,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import "./UserSettings.css";
import { Link } from "react-router-dom";
import apiAxios from "../../api/axiosConfig.js";

export default function UserSettings() {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div>
        <p>Caricamento...</p>
      </div>
    );
  if (!user) return <div>Effettua il login per vedere questa pagina.</div>;

  const handleRequestVerification = async () => {
    try {
    
      const response = await apiAxios.post("/api/auth/send-verification");
      console.log(response);
      
      alert("Controlla la tua posta! Ti abbiamo inviato il link.");
    } catch (err) {
      console.error("handleRequestVerification Errore nell'invio:", err);
    }
  };

  return (
    <div className="settings-container">
      <header className="settings-header">
        <h2>USER SETTINGS</h2>
        <div className="profile-section">
          <div className="avatar-placeholder">
            <User size={40} />
          </div>
          <div className="profile-info">
            {/* Usiamo lo username dal JSON */}
            <h3>
              {user.username} <span className="badge-user">{user.role}</span>
            </h3>
            <div className="quick-actions">
              <Bell size={18} />
              <Globe size={18} />
              <LogOut size={18} className="logout-icon" />
            </div>
          </div>
        </div>
      </header>

      <section className="settings-menu">

        <div className={`menu-item ${user.isVerified ? "verified" : "unverified"}`}>
          <button onClick={handleRequestVerification} className="menu-text">
            <h4>
              {user.isVerified ? "Account Verified" : "Verify your account"}
            </h4>
            <p>
              {user.isVerified
                ? "You earned the Pioneer Badge!"
                : "Send a verifying email and earn a badge!"}
            </p>
          </button>
          {user.isVerified ? (
            <ShieldCheck size={20} color="green" />
          ) : (
            <ChevronRight size={20} />
          )}
        </div>

        <div className="menu-item">
          <div className="menu-text">
            <h4>Edit Profile</h4>
            <p>Edit avatar image and username</p>
          </div>
          <ChevronRight size={20} />
        </div>

        <div className="menu-item">
          <div className="menu-text">
            <h4>Change Password</h4>
            <p>Change your password</p>
          </div>
          <ChevronRight size={20} />
        </div>

        <Link to="/badges" className="menu-item">
          <div className="menu-text">
            <h4>Your badges</h4>
            <p>{user.badges.length} badges earned</p>
          </div>
          <ChevronRight size={20} />
        </Link>

        <Link to="/settings" className="menu-item">
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
          <input type="text" value={user.email} readOnly />
        </div>
      </section>
    </div>
  );
}
