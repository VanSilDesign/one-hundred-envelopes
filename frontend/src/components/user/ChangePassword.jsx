import {useNavigate } from "react-router-dom";
import apiAxios from "../../api/axiosConfig.js";
import { useState } from "react";
import useInput from "../../hooks/useInput.jsx";
import Input from "../UI/Input.jsx";
import { isNotEmpty, hasMinLength } from "../../util/validation.js";
import { ArrowLeft } from "lucide-react";

function ChangePassword() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const {
    value: currentPassword,
    handleInputChange: handleCurrentPasswordChange,
    handleInputBlur: handleCurrentPasswordBlur,
    hasError: currentPasswordHasError,
  } = useInput("", (value) => hasMinLength(value, 8) && isNotEmpty(value));

  const {
    value: newPassword,
    handleInputChange: handleNewPasswordChange,
    handleInputBlur: handleNewPasswordBlur,
    hasError: newPasswordHasError,
  } = useInput("", (value) => hasMinLength(value, 8) && isNotEmpty(value));

  const {
    value: confirmNewPassword,
    handleInputChange: handleConfirmNewPasswordChange,
    handleInputBlur: handleConfirmNewPasswordBlur,
    hasError: confirmNewPasswordHasError,
  } = useInput("", (value) => hasMinLength(value, 8) && isNotEmpty(value));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      return alert("Le password non coincidono!");
    }

    try {
      const response = await apiAxios.put(`/api/user/update-password`, {
        currentPassword,
        newPassword,
      });

      alert("Password aggiornata con successo!");
      navigate("/user/profile"); // Torna alle impostazioni del profilo
    } catch (err) {
      console.error(err);
      // Prende il messaggio dal backend, es: "La password attuale non è corretta."
      console.log(err);
      const errorMsg =
        err.response?.data?.message || "Si è verificato un errore. Riprova.";
      setMessage(errorMsg);
    }
  };
  return (
    <div className="form-modal">
      <h2>Imposta Nuova Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="control-column">
          <Input
            label="Vecchia Password*"
            id="current-password"
            type="password"
            name="currentPassword"
            onBlur={handleCurrentPasswordBlur}
            onChange={handleCurrentPasswordChange}
            value={currentPassword}
            error={currentPasswordHasError && "Per favore inserisci una password valida"}
          />
          <Input
            label="Nuova Password*"
            id="new-password"
            type="password"
            name="newPassword"
            onBlur={handleNewPasswordBlur}
            onChange={handleNewPasswordChange}
            value={newPassword}
            error={newPasswordHasError && "Per favore inserisci una password valida"}
          />
          <Input
            label="Conferma Nuova Password*"
            id="confirm-new-password"
            type="password"
            name="confirmNewPassword"
            onBlur={handleConfirmNewPasswordBlur}
            onChange={handleConfirmNewPasswordChange}
            value={confirmNewPassword}
            error={
              confirmNewPasswordHasError && "Per favore inserisci una password valida"
            }
          />
          <div className="form-actions">
            <button className="button button-flat" onClick={() => navigate("/user/profile")}>Annulla</button>
            <button className="button">Salva</button>
          </div>
        </div>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ChangePassword;
