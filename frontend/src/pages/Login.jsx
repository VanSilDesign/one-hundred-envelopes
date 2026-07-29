import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/context/AuthContext.jsx";
import useInput from "../hooks/useInput.jsx";
import { isEmail, isNotEmpty, hasMinLength } from "../util/validation.js";
import Input from "../components/UI/Input.jsx";
import apiAxios from "../api/axiosConfig.js";

export default function LoginPage() {
  const navigate = useNavigate(); // Inizializza il navigatore
  const { user, login } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/"); // Se sei già loggata, via di qui!
    }
  }, [user, navigate]);

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

  async function handleSubmit(event) {
    event.preventDefault();

    if (emailHasError || passwordHasError) {
      return;
    }

    try {
      //METODO CON IL FETCH
      /* const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailValue, // o email, in base a come lo chiami sul server
          password: passwordValue,
        }),
        credentials: "include", // Fondamentale per ricevere il cookie di sessione!
      }); 
      
      const data = await response.json();
      
      if (response.ok) {
        alert("Login effettuato con successo!");
        // Salviamo i dati nello stato globale user in App.jsx dal Provider di AuthContext
        login(data.user);

      */

      //METODO CON AXIOS
      const response = await apiAxios.post(
        "/api/auth/login",
        {
          email: emailValue, // Assicurati che il server ora legga "email" e non "username"
          password: passwordValue,
        },
        { withCredentials: true }, // FONDAMENTALE per Passport e le sessioni
      );
      if (response.status === 200) {
        alert("Login effettuato con successo!");

        // Il backend ora restituisce l'utente (grazie a Mongoose)
        // data.user conterrà username, email, ruolo, ecc.
        login(response.data.user);

        // MAGIA: Spostiamo l'utente sulla Dashboard
        navigate("/");
      } else {
        console.error("ERRORE LOGIN:", data.message);
        alert(data.message || "Credenziali non valide");
      }
    } catch (error) {
      console.error("ERRORE LOGIN:", error.response?.data?.message);
      alert(error.response?.data?.message || "Errore di connessione al server");
    }
  }

  return (
    <div className="form-wrapper">
      <div className="form-modal">
        <h2>Login</h2>
        <p>Accedi per vedere i tuoi progressi</p>
        <form onSubmit={handleSubmit}>
          <div className="control-column">
            <Input
              label="Email*"
              id="email"
              type="email"
              name="email"
              autoComplete="email"
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
              autoComplete="new-password"
              onBlur={handlePasswordBlur}
              onChange={handlePasswordChange}
              value={passwordValue}
              error={passwordHasError && "Please enter a valid password!"}
            />
          </div>

          <p className="form-actions">
            <button className="button">Login</button>
          </p>
        </form>
        <p>
          Non hai un account? <Link to="/register">Iscriviti</Link>
        </p>
        <p>
          <Link to="/forgot-password">Hai dimenticato la password?</Link>
        </p>
        <div className="separator">
          <span>o</span>
        </div>
        <div className="social-logins">
          {/* Assicurati di avere le rotte del backend per questi */}
          <a href="/api/auth/google" className="button social-button google">
            Login with Google
          </a>
        </div>
        <p className="footer-text">
          By clicking login, you agree to our{" "}
          <Link to="/terms">Terms of Service</Link> and{" "}
          <Link to="/privacy">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
