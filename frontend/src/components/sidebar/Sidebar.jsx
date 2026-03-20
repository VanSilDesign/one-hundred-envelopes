import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose();
  };
  return (
    <>
      {/* Overlay: lo sfondo scuro che chiude il menu se cliccato */}
      {isOpen && <div className="backdrop" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <nav className="sidebar-nav">
          {user ? (
            <div className="user-section">
              <p>
                Welcome, <strong>{user.username}</strong>!
              </p>
              <ul>
                <li>
                  <Link to="/" onClick={onClose}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/user/dashboard" onClick={onClose}>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/stats" onClick={onClose}>
                    Stats
                  </Link>
                </li>
                <li>
                  <Link to="/settings" onClick={onClose}>
                    Settings
                  </Link>
                </li>
                <li>
                  <button className="logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="guest-section">
              <p>
                Login to save your history, check your progress and set
                different score.
              </p>
              <Link to="/login" className="button" onClick={onClose}>
                Login
              </Link>
            </div>
          )}
        </nav>
      </aside>
    </>
  );
}
