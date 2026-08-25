import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Home, ChartSpline, FolderOpen, User } from "lucide-react"; // Usiamo Lucide per icone moderne
import "./BottomNavbar.css";

export default function BottomNavbar() {
  const {user} = useAuth();

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
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/user/stats"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <ChartSpline size={24} />
          <span>Stats</span>
        </NavLink>

        <NavLink
          to="/user/challenges"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <FolderOpen size={24} />
          <span>Sfide</span>
        </NavLink>

        <NavLink
          to="/user/profile"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <User size={24} />
          <span>Profilo</span>
        </NavLink>
      </div>
    </div>
  );
}
