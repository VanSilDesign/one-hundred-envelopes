import logoImg from "../assets/logo_envelope.png";
import { useLocation, Link } from "react-router-dom";

export default function Header({ onMenuClick }) {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header id="main-header">
       <button
        className="menu-toggle"
        onClick={onMenuClick}
        aria-label="Apri menu"
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 7H25M5 15H25M5 23H25"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <div id="title" className="main-header">
        <Link to="/" className={`${isHome ? 'home-variant' : 'compact-variant'}`}>
          <img
            src={logoImg}
            alt="A open envelope with a heart inside"
          />
          {!isHome && <span className="site-title">100 Envelopes</span>}
          {isHome && <h1>100 envelopes</h1>}
        </Link>
      </div>
    </header>
  );
}
