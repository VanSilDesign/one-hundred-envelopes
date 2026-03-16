import { NavLink } from "react-router-dom";
import { Home, ChartSpline, FolderOpen, User } from "lucide-react"; // Usiamo Lucide per icone moderne
import "./BottomNavbar.css";

export default function BottomNavbar() {
  return (
    <div className="bottom-nav">
      <div className="bottom-nav-container">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <Home size={24} />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/stats"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <ChartSpline size={24} />
          <span>Stats</span>
        </NavLink>

        <NavLink
          to="/challenges"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <FolderOpen size={24} />
          <span>Sfide</span>
        </NavLink>

        <NavLink
          to="/profile"
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
