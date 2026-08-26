import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../components/context/AuthContext.jsx";
import useInput from "../hooks/useInput.jsx";
import { isEmail, isNotEmpty, hasMinLength } from "../util/validation.js";
import Input from "../components/UI/Input.jsx";
import apiAxios from "../api/axiosConfig.js";

export default function LoginPage() {
  const navigate = useNavigate(); // Inizializza il navigatore
  const { user, login } = useAuth();
  const { t } = useTranslation();

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

    // 1. Controllo se i campi sono vuoti
    if (!emailValue.trim() || !passwordValue.trim()) {
      alert(`${t("common.alerts.empty_fields")}`);
      return;
    }

    // 2. Controllo se ci sono errori di validazione (email non valida o pass corta)
    if (emailHasError || passwordHasError) {
      alert(`${t("common.alerts.check_data")}`);
      return;
    }

    try {
      const response = await apiAxios.post(
        "/api/auth/login",
        {
          email: emailValue, // Assicurati che il server ora legga "email" e non "username"
          password: passwordValue,
        },
        { withCredentials: true }, // FONDAMENTALE per Passport e le sessioni
      );
      if (response.status === 200) {
        alert(`${t("settings.login.login_success")}`);

        login(response.data.user);

        navigate("/");
      } else {
        console.error("ERRORE LOGIN:", data.message);
        alert(data.message || `${t("settings.password.no_valid_credentials")}`);
      }
    } catch (error) {
      console.error("ERRORE LOGIN:", error.response?.data?.message);
      alert(error.response?.data?.message || `${t("errors.server_error")}`);
    }
  }

  return (
    <div className="form-wrapper">
      <div className="form-modal">
        <h2>{t("common.login")}</h2>
        <p>{t("settings.login.login_to_progress")}</p>
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
            <button
              className="button"
              disabled={emailHasError || passwordHasError}
            >
              {t("common.login")}
            </button>
          </p>
        </form>
        <p>
          {t("settings.login.no_account")}
          <Link to="/register">{t("common.signup")}</Link>
        </p>
        <p>
          <Link to="/forgot-password">{t("settings.login.no_password")}</Link>
        </p>
        <div className="separator">
          <span>{t("common.or")}</span>
        </div>
        <div className="social-logins">
          {/* Assicurati di avere le rotte del backend per questi */}
          <a href="/api/auth/google" className="button social-button google">
            {t("settings.login.login_with_google")}
          </a>
        </div>
        <p className="footer-text">
          {t("settings.login.agree_with")}{" "}
          <Link to="/terms">{t("common.terms")}</Link> {t("common.and")}{" "}
          <Link to="/privacy">{t("common.privacy")}</Link>
        </p>
      </div>
    </div>
  );
}
