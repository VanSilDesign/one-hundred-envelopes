import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import apiAxios from "../../api/axiosConfig.js";
import confetti from "canvas-confetti";

// TOKEN PER NON RIFARE TUTTO DA CAPO E TESTARE QUESTO PEZZO: 
// 0bea73e2f64264dff20399fb329f058cc8684d39c7656f204665aab2b5376ecb

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // 'verifying', 'success', 'error'
  const [showModal, setShowModal] = useState(false);
  const { login } = useAuth();

  const isVerifyingRef = useRef(false);

  useEffect(() => {
    console.log("Sono nella pagina di verifica con il token:", token);

    // Se una chiamata è già partita o abbiamo già finito, NON fare nulla!
    if (isVerifyingRef.current || status !== "verifying" || !token) return;

    isVerifyingRef.current = true; // Blocco sincrono per chiamate simultanee

    const verify = async () => {
      try {
        const response = await apiAxios.get(`/api/auth/verify-email/${token}`);

        console.log("status", response.status);
        console.log("token", token);

        if (response.status === 200) {
          if (response.data?.user) {
            login(response.data.user);
          }
          setStatus("success");
          triggerSuccess();
        }
      } catch (error) {
        console.log("Errore nel verificare la mail", error);
        setStatus((prev) => (prev === "success" ? "success" : "error"));
      }
    };

    if (token) verify();
  }, [token]);

  const triggerSuccess = () => {
    setShowModal(true);
    setTimeout(() => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#a34e3f", "#e8a593", "#ff7f50", "#fff8f2"],
    });
    }, 300);
  };

  // Funzione per chiudere la modale o andare via
  const onClose = () => {
    setShowModal(false);
    //navigate("/badges");
  };

  const handleGoToBadges = async () => {
    console.log("handleGoToBadges token:", token);
    
    try {
      if(token) await apiAxios.post(`/api/auth/clear-verification-token/${token}`);
    } catch (error) {
      console.log("Cleanup non andato a buon fine.");
    } finally {
      navigate("/user/profile/badges");
    }
  }

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
              className="modal-btn continue-btn"
              onClick={handleGoToBadges}
            >
              Vai ai tuoi badges
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
        <button className="continue-btn" onClick={() => navigate("/")}>
          Torna alla Home
        </button>
      </div>
    );
  }

  // 4. Default di sicurezza (mentre i coriandoli esplodono)
  return (
    <div className="verify-container">
      <h2>Email verificata! 🎉</h2>
      <p>
        Hai ottenuto il badge: <strong>Account Verificato</strong>
      </p>
      <p>Guarda tutti i badges che hai sbloccato nella tua area riservata!</p>
      <button className="button" onClick={handleGoToBadges}>
        Effetua il login
      </button>
    </div>
  );
}
