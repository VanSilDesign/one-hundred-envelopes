import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../components/context/AuthContext.jsx";
import logoFooterImg from "../assets/logo_footer.png";
import "./Footer.css";

export default function Footer() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <>
      <div className="footer">
        <div className="footer-container">
          <img src={logoFooterImg} alt={t("common.logo_alt")} />
          <div className="footer-blocks">
            <ul>
              <li>
                <Link to="/">{t("common.contacts")}</Link>
              </li>
              <li>
                <Link to="/">{t("common.instruction")}</Link>
              </li>
              <li>
                <Link to="/">{t("common.about_us")}</Link>
              </li>
            </ul>
            <ul>
              <li>
                <Link to="/terms">{t("common.terms")}</Link>
              </li>
              <li>
                <Link to="/privacy">{t("common.privacy")}</Link>
              </li>
              <li>
                <Link to="/cookies">{t("common.cookies")}</Link>
              </li>
            </ul>
            {user && (
              <ul>
                <li>
                  <Link to="/user/profile">{t("menu.user")}</Link>
                </li>
                <li>
                  <Link to="/user/challenges">{t("menu.challenges")}</Link>
                </li>
                <li>
                  <Link to="/user/stats">{t("menu.stats")}</Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
      <div className="footer-copy">
        <p>
          © {currentYear} Envelopes. {t("footer.rights")}
        </p>
      </div>
    </>
  );
}
