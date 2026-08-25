import { useState } from "react";
import { Mail, ArrowLeft, Loader2, CircleDivideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../components/UI/Input.jsx";
import useInput from "../hooks/useInput.jsx";
import { isEmail, isNotEmpty } from "../util/validation.js";
import apiAxios from "../api/axiosConfig.js";

export default function ForgotPassword() {
  const [status, setStatus] = useState(null); //stati: loading, success, error,

  const {
    value: emailValue,
    handleInputChange: handleEmailChange,
    handleInputBlur: handleEmailBlur,
    hasError: emailHasError,
  } = useInput("", (value) => isEmail(value) && isNotEmpty(value));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (emailHasError || !emailValue) return;

    setStatus("loading");

    try {
      const response = await apiAxios.post("/api/auth/forgot-password", {
        email: emailValue,
      });

      console.log(response.data);
      setStatus("success");
    } catch (error) {
      console.error("Errore invio mail:", error);
      setStatus("error");

      // Opzionale: un alert per capire cosa è andato storto
      alert(error.response?.data?.message || "Errore nel server");
    }
  };

  return (
    <div className="form-modal">
      <div className="forms-header">
        <Link title="Torna al login" to="/login" className="back-link">
          <ArrowLeft size={18} />
        </Link>
      </div>

      <h2>Recupera Password</h2>

      <p className="auth-subtitle">
        Inserisci la tua email e ti invieremo le istruzioni per resettare la
        password.
      </p>
      <div className="control">
        {status === "success" ? (
          <div className="success-message">
            📧 Controlla la tua posta! Ti abbiamo inviato un link di recupero.
          </div>
        ) : (
          <form className="control-column" onSubmit={handleSubmit}>
            {/* <Mail className="input-icon" size={18} /> */}
            <Input
              label="Email*"
              id="email"
              type="email"
              name="email"
              onBlur={handleEmailBlur}
              onChange={handleEmailChange}
              value={emailValue}
              error={emailHasError && "Please enter a valid email!"}
            />

            <div className="form-actions">
              <button
                type="submit"
                className="button"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <Loader2 className="spinner" />
                ) : (
                  "Invia Link"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
