import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import apiAxios from "../api/axiosConfig.js";
import useInput from "../hooks/useInput.jsx";
import { isEmail, isNotEmpty, hasMinLength } from "../util/validation.js";
import Input from "../components/UI/Input.jsx";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

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
      alert(`${t("common.alerts.check_data")}`);
      return;
    }
    setLoading(true);

    try {
      const formData = {
        username: usernameValue,
        email: emailValue,
        password: passwordValue,
      };

      const response = await apiAxios.post("/api/auth/register", formData);

      if (response.status === 201) {
        alert(`${t("common.alerts.created_account")}`);
        navigate("/login");
      } else {
        setError(data.message || `${t("settings.register.failed_signup")}`);
      }
    } catch (error) {
      setError("Errore di connesione: ", error);
    }
  };

  return (
    <div className="form-modal">
      <form onSubmit={handleSubmit}>
        <h2>{t("settings.register.title")}</h2>
        <p>{t("settings.register.desc")}</p>

        <div className="control-row">
          <Input
            label="Username*"
            id="username"
            type="text"
            name="username"
            autoComplete="username"
            onBlur={handleUsernameBlur}
            onChange={handleUsernameChange}
            value={usernameValue}
            error={
              usernameHasError && `${t("settings.register.valid_username")}`
            }
          />
          <Input
            label="Email*"
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            onBlur={handleEmailBlur}
            onChange={handleEmailChange}
            value={emailValue}
            error={emailHasError && `${t("settings.login.valid_email")}`}
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
            error={
              passwordHasError && `${t("settings.password.valid_password")}`
            }
          />
        </div>

        <p className="form-actions">
          <button className="button" disabled={loading}>
            {loading
              ? `${t("settings.register.loading")}`
              : `${t("settings.register.action_btn")}`}
          </button>
        </p>
      </form>
      <p>
        {t("settings.register.already_logged")}{" "}
        <Link to="/login">{t("common.login")}</Link>
      </p>
      <div className="separator">
        <span>{t("common.or")}</span>
      </div>
      <div className="social-logins">
        {/* Assicurati di avere le rotte del backend per questi */}
        <a href="/api/auth/google" className="button social-button google">
          {t("settings.register.register_with_google")}
        </a>
      </div>
      <p className="footer-text">
        {t("settings.login.agree_with")}{" "}
        <Link to="/terms">{t("common.terms")}</Link> {t("common.and")}{" "}
        <Link to="/privacy">{t("common.privacy")}</Link>
      </p>
    </div>
  );
}
