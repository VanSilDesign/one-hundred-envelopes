import { useParams, useNavigate } from "react-router-dom";
import apiAxios from "../api/axiosConfig.js";
import { useState } from "react";
import Input from "./UI/Input";
import useInput from "../hooks/useInput";
import { isNotEmpty, hasMinLength } from "../util/validation.js";

const ResetPassword = () => {
  const { token } = useParams(); // Prende il codice segreto dall'URL
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const {
    value: password,
    handleInputChange: handlePasswordChange,
    handleInputBlur: handlePasswordBlur,
    hasError: passwordHasError,
  } = useInput("", (value) => hasMinLength(value, 8) && isNotEmpty(value));

  const {
    value: confirmPassword,
    handleInputChange: handleConfirmPasswordChange,
    handleInputBlur: handleConfirmPasswordBlur,
    hasError: confirmPasswordHasError,
  } = useInput("", (value) => hasMinLength(value, 8) && isNotEmpty(value));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return alert("Le password non coincidono!");
    }

    try {
      // Mandiamo la nuova password alla rotta del backend che abbiamo scritto prima
      const response = await apiAxios.post(
        `/api/auth/reset-password/${token}`,
        {
          password: password,
        },
      );

      //console.log("response", response);

      alert("Password aggiornata! Ora puoi fare il login.");
      navigate("/login");
    } catch (err) {
      console.log(err);
      setMessage("Il link è scaduto o non è valido.");
    }
  };

  return (
    <div className="form-modal">
      <h2>Imposta Nuova Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="control-column">
          <Input
            label="Password*"
            id="confirm-password"
            type="password"
            name="confirmPassword"
            onBlur={handlePasswordBlur}
            onChange={handlePasswordChange}
            value={password}
            error={passwordHasError && "Please enter a valid password!"}
          />
          <Input
            label="Conferma Password*"
            id="password"
            type="password"
            name="password"
            onBlur={handleConfirmPasswordBlur}
            onChange={handleConfirmPasswordChange}
            value={confirmPassword}
            error={confirmPasswordHasError && "Please enter a valid password!"}
          />
          <div className="form-actions">
            <button className="button button-flat">Annulla</button>
            <button className="button">Salva</button>
          </div>
        </div>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
