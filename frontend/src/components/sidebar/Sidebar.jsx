import { Link } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar({ isOpen, onClose, user , onLogout}) {
  return (
    <>
      {/* Overlay: lo sfondo scuro che chiude il menu se cliccato */}
      {isOpen && <div className="backdrop" onClick={onClose} />}
      
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <nav className="sidebar-nav">
          {user ? (
            <div className="user-section">
              <p>Benvenuta, <strong>{user.username}</strong>!</p>
              <ul>
                <li><Link to="/user/dashboard" onClick={onClose}>La mia Dashboard</Link></li>
                <li><Link to="/user/settings" onClick={onClose}>Impostazioni</Link></li>
                <li><button className="logout-btn" onClick={onLogout}>Logout</button></li>
              </ul>
            </div>
          ) : (
            <div className="guest-section">
              <p>Accedi per salvare i tuoi progressi e vedere le statistiche.</p>
              <Link to="/login" className="button" onClick={onClose}>
                Vai al Login
              </Link>
            </div>
          )}
        </nav>
      </aside>
    </>
  );
}