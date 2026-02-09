import useInput from "../hooks/useInput.jsx";
import {
  isEmail,
  isNotEmpty,
  hasMinLength,
  isEqualsToOtherValue,
} from "../util/validation.js";
import Input from "./UI/Input";
import { useNavigate } from "react-router-dom";

export default function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate(); // Inizializza il navigatore

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
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: emailValue, // o email, in base a come lo chiami sul server
          password: passwordValue,
        }),
        credentials: "include", // Fondamentale per ricevere il cookie di sessione!
      });

      const data = await response.json();

      if (response.ok) {
        console.log("SUCCESSOTOTALE:", data);
        alert("Login effettuato con successo!");
        // Salviamo i dati nello stato globale user in App.jsx
        onLoginSuccess(data.user); 
        // MAGIA: Spostiamo l'utente sulla Dashboard
        navigate("/user/dashboard");
      } else {
        console.error("ERRORE LOGIN:", data.message);
        alert(data.message || "Credenziali non valide");
      }
    } catch (error) {
      console.error("Errore di rete:", error);
      alert("Il server non risponde. Controlla se è acceso!");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <div className="control-row">
        <Input
          label="Email"
          id="email"
          type="email"
          name="email"
          onBlur={handleEmailBlur}
          onChange={handleEmailChange}
          value={emailValue}
          error={emailHasError && "Please enter a valid email!"}
        />
        <Input
          label="Password"
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
        <button className="button button-flat">Reset</button>
        <button className="button">Login</button>
      </p>
    </form>
  );
}
