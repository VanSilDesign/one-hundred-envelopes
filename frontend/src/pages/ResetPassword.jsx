import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import apiAxios from "../api/axiosConfig.js";
import { isNotEmpty, hasMinLength } from "../util/validation.js";
import Input from "../components/UI/Input.jsx";
import useInput from "../hooks/useInput.jsx";

const ResetPassword = () => {
  const { token } = useParams(); // Prende il codice segreto dall'URL
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

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
      return alert(`${t("errors.error_password")}`);
    }

    try {
      // Mandiamo la nuova password alla rotta del backend che abbiamo scritto prima
      const response = await apiAxios.post(
        `/api/auth/reset-password/${token}`,
        {
          password,
        },
      );

      //console.log("response", response);

      alert(`${t("settings.password.updated_password")}`);
      navigate("/login");
    } catch (err) {
      console.log(err);
      setMessage(`${t("errors.link_error")}`);
    }
  };

  return (
    <div className="form-modal">
      <h2>Imposta Nuova Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="control-column">
          <Input
            label={t("settings.password.new_password")}
            id="password"
            type="password"
            name="password"
            onBlur={handlePasswordBlur}
            onChange={handlePasswordChange}
            value={password}
            error={passwordHasError && `${t("settings.password.valid_password")}`}
          />
          <Input
            label={t("settings.password.confirm_new_password")}
            id="password"
            type="password"
            name="confirmPassword"
            onBlur={handleConfirmPasswordBlur}
            onChange={handleConfirmPasswordChange}
            value={confirmPassword}
            error={confirmPasswordHasError && `${t("settings.password.valid_password")}`}
          />
          <div className="form-actions">
            <button className="button button-flat" onClick={() => navigate("/login")}>{t("common.cancel")}</button>
            <button className="button">{t("common.save")}</button>
          </div>
        </div>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
