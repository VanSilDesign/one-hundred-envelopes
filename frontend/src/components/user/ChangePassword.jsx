import { useState } from "react";
import {useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import apiAxios from "../../api/axiosConfig.js";
import { isNotEmpty, hasMinLength } from "../../util/validation.js";
import useInput from "../../hooks/useInput.jsx";
import Input from "../UI/Input.jsx";

function ChangePassword() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

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
      return alert(`${t("errors.error_password")}`);
    }

    try {
      const response = await apiAxios.put(`/api/user/update-password`, {
        currentPassword,
        newPassword,
      });

      alert(`${t("settings.password.password_success")}`);
      navigate("/user/profile"); // Torna alle impostazioni del profilo
    } catch (err) {
      console.error(err);
      // Prende il messaggio dal backend, es: "La password attuale non è corretta."
      console.log(err);
      const errorMsg =
        err.response?.data?.message || `${t("errors.error_generic")}`;
      setMessage(errorMsg);
    }
  };
  return (
    <div className="form-container">
      <header className="form-header">
        <h2>{t("settings.input_password")}</h2>
      </header>
      
      <form onSubmit={handleSubmit}>
        <div className="control-column">
          <Input
            label={t("settings.password.current_password")}
            id="current-password"
            type="password"
            name="currentPassword"
            onBlur={handleCurrentPasswordBlur}
            onChange={handleCurrentPasswordChange}
            value={currentPassword}
            error={currentPasswordHasError && `${t("settings.password.valid_password")}`}
          />
          <Input
            label={t("settings.password.new_password")}
            id="new-password"
            type="password"
            name="newPassword"
            onBlur={handleNewPasswordBlur}
            onChange={handleNewPasswordChange}
            value={newPassword}
            error={newPasswordHasError && `${t("settings.password.valid_password")}`}
          />
          <Input
            label={t("settings.password.confirm_new_password")}
            id="confirm-new-password"
            type="password"
            name="confirmNewPassword"
            onBlur={handleConfirmNewPasswordBlur}
            onChange={handleConfirmNewPasswordChange}
            value={confirmNewPassword}
            error={
              confirmNewPasswordHasError && `${t("settings.password.valid_password")}`
            }
          />
          <div className="form-actions">
            <button className="button button-back" onClick={() => navigate("/user/profile")}>{t("common.cancel")}</button>
            <button className="button">{t("common.save")}</button>
          </div>
        </div>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ChangePassword;
