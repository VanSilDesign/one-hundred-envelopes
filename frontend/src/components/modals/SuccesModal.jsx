import { useEffect } from "react";
import confetti from "canvas-confetti";
import logoImg from "../../assets/logo_envelope.png";
import "./SuccessModal.css";

export default function SuccessModal({
  isOpen,
  amount,
  challengeName,
  onClose,
}) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        // Esplosione dei coriandoli in tema Soft Apricot
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#8f3a2b", "#e8a593", "#f8af84", "#fff8f2"],
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-x" onClick={onClose}>
          ✕
        </button>

        <div className="icon-circle">
          <img src={logoImg} alt="A open envelope with a heart inside" />
        </div>

        <h2 className="modal-title">Ottimo Lavoro!</h2>
        <div className="amount-display">{amount}€</div>

        <p className="modal-text">
          Hai appena aggiunto un tassello a <br />
          <strong>{challengeName}</strong>!
        </p>

        <button className="continue-btn" onClick={onClose}>
          Continua
        </button>
      </div>
    </div>
  );
}
