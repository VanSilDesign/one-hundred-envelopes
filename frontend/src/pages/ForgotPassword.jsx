import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Mail, ArrowLeft, Loader2, CircleDivideIcon } from "lucide-react";
import Input from "../components/UI/Input.jsx";
import useInput from "../hooks/useInput.jsx";
import { isEmail, isNotEmpty } from "../util/validation.js";
import apiAxios from "../api/axiosConfig.js";

export default function ForgotPassword() {
  const [status, setStatus] = useState(null); //stati: loading, success, error,
  const { t } = useTranslation();

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
      alert(error.response?.data?.message || `${t("errors.error_generic")}`);
    }
  };

  return (
    <div className="form-modal">
      <div className="forms-header">
        <Link title="Torna al login" to="/login" className="back-link">
          <ArrowLeft size={18} />
        </Link>
      </div>

      <h2>{t("settings.forgot_password.title")}</h2>

      <p className="auth-subtitle">{t("settings.forgot_password.desc")}</p>
      <div className="control">
        {status === "success" ? (
          <div className="success-message">
            {t("setting.forgot_password.success")}
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
              error={emailHasError && `${t("settings.login.valid_email")}`}
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
                  `${t("settings.forgot_password.send_link")}`
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
