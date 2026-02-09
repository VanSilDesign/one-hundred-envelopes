import logoImg from "../assets/logo_envelope.png";

export default function Header({ onMenuClick }) {
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
      <div id="title">
        <img src={logoImg} alt="A open envelope with a heart inside" />
        <h1>100 envelopes</h1>
      </div>
    </header>
  );
}
