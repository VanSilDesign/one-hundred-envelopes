import { useState } from "react";
import useInput from "../hooks/useInput.jsx";
import { isEmail, isNotEmpty, hasMinLength } from "../util/validation.js";
import Input from "../components/UI/Input.jsx";
import { Link, useNavigate } from "react-router-dom";
import apiAxios from "../api/axiosConfig.js";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    value: emailValue,
    handleInputChange: handleEmailChange,
    handleInputBlur: handleEmailBlur,
    hasError: emailHasError,
  } = useInput("", (value) => isEmail(value) && isNotEmpty(value));

  const {
    value: passwordValue,
    handleInputChange: handlePasswordChange,
    handleInputBlur: handlePasswordBlur,
    hasError: passwordHasError,
  } = useInput("", (value) => hasMinLength(value, 8) && isNotEmpty(value));

  const {
    value: usernameValue,
    handleInputChange: handleUsernameChange,
    handleInputBlur: handleUsernameBlur,
    hasError: usernameHasError,
  } = useInput("", (value) => isNotEmpty(value));

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validazione pre-invio
    if (
      emailHasError ||
      passwordHasError ||
      usernameHasError ||
      !usernameValue
    ) {
      alert("Controlla i dati inseriti!");
      return;
    }
    setLoading(true);

    try {
      /* const response = await fetch("/api/auth/register-admin", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: emailValue,
          password: passwordValue,
        }),
      });

      const data = await response.json(); */

      const formData = {
        username: usernameValue,
        email: emailValue,
        password: passwordValue,
      };

      const response = await apiAxios.post("/api/auth/register", formData);

      if (response.status === 201) {
        alert(
          "Account creato! 🐷 Abbiamo preparato la tua prima sfida. Controlla la mail per sbloccare il tuo badge!",
        );
        navigate("/login");
      } else {
        setError(data.message || "Registrazione fallita");
      }
    } catch (error) {
      setError("Errore di connesione: ", error);
    }
  };

  return (
    <div className="form-modal">
      <form onSubmit={handleSubmit}>
        <h2>Registra il tuo account</h2>
        <p>Tutti i campi con * sono obbligatori</p>

        <div className="control-row">
          <Input
            label="Username*"
            id="username"
            type="text"
            name="username"
            onBlur={handleUsernameBlur}
            onChange={handleUsernameChange}
            value={usernameValue}
            error={usernameHasError && "Lo username non può essere vuoto!"}
          />
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
          <Input
            label="Password*"
            id="password"
            type="password"
            name="password"
            onBlur={handlePasswordBlur}
            onChange={handlePasswordChange}
            value={passwordValue}
            error={passwordHasError && "Please enter a valid password!"}
          />
        </div>

        <p className="form-actions">
          <button className="button" disabled={loading}>
            {loading ? "Caricamento..." : "Registrati"}
          </button>
        </p>
      </form>
      <p>
        Hai già un account? <Link to="/login">Accedi</Link>
      </p>
      <div className="separator">
        <span>o</span>
      </div>
      <div className="social-logins">
        {/* Assicurati di avere le rotte del backend per questi */}
        <a href="/api/auth/google" className="button social-button google">
          Register with Google
        </a>
      </div>
      <p className="footer-text">
        By clicking login, you agree to our{" "}
        <Link to="/terms">Terms of Service</Link> and{" "}
        <Link to="/privacy">Privacy Policy</Link>
      </p>
    </div>
  );
}
