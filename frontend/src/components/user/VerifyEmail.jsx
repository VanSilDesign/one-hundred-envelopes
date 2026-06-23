import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiAxios from "../../api/axiosConfig.js";
import confetti from "canvas-confetti";

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // 'verifying', 'success', 'error'
  const [showModal, setShowModal] = useState(false);
  const hasExpired = useRef(false);

  useEffect(() => {
    console.log("Sono nella pagina di verifica!", token);

    if (hasExpired.current) return;
    hasExpired.current = true;

    const verify = async () => {
      try {
        const response = await apiAxios.get(`/api/auth/verify-email/${token}`);
        console.log("hasExpired", hasExpired.current);
        console.log("status", response.status);
        console.log("token", token);
        if (response.status === 200) {
          setStatus("success");
          triggerSuccess();
        }
      } catch (error) {
        if (hasExpired.current && status === "success") {
          return;
        }
        console.log("Errore nel verificare la mail", error);
        setStatus("error");
      }
    };

    if (token) verify();
  }, [token]);

  const triggerSuccess = () => {
    setShowModal(true);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#a34e3f", "#e8a593", "#ff7f50", "#fff8f2"],
    });
  };

  // Funzione per chiudere la modale o andare via
  const onClose = () => {
    setShowModal(false);
    //navigate("/badges");
  };

  // 1. Se la modale è aperta, non ci interessa nient'altro: mostriamo il successo
  if (showModal) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="close-x" onClick={onClose}>
            ✕
          </button>
          <div className="badge-modal">
            <div className="badge-img">
              <img
                src="/badges/verified-account.svg"
                className="badge-unlocked-anim"
              />
              <div className="shiny-effect"></div>
            </div>
            <h3>BADGE SBLOCCATO!</h3>
            <p>
              Hai ottenuto il badge: <strong>Account Verificato</strong>
            </p>
            <button
              className="continue-btn"
              onClick={() => navigate("/badges")}
            >
              Vai alla tua bacheca
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Se siamo in fase di caricamento
  if (status === "verifying") {
    return (
      <div className="verify-container">
        <h2>Verifica in corso... ⏳</h2>
      </div>
    );
  }

  // 3. Se c'è stato un errore (e NON siamo già riusciti prima)
  if (status === "error") {
    return (
      <div className="verify-container">
        <h2>Token scaduto o non valido. ❌</h2>
        <button onClick={() => navigate("/")}>Torna alla Home</button>
      </div>
    );
  }

  // 4. Default di sicurezza (mentre i coriandoli esplodono)
  return (
    <div className="verify-container">
      <h2>Email verificata! 🎉</h2>
    </div>
  );
}
