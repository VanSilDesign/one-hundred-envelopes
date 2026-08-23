import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
//import { useLanguage } from "../context/LanguageContext";
import { Globe } from "lucide-react";

export default function LanguagePicker() {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Se il click è avvenuto FUORI dal contenitoreRef, chiudiamo il menu
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    // Aggiungiamo il listener quando il componente è montato
    document.addEventListener("mousedown", handleClickOutside);

    // Puliamo il listener allo smontaggio per evitare memory leak
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Quando il mouse entra (sul globo o sul menu), annulliamo eventuale chiusura programmata
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  // Quando il mouse esce, impostiamo un piccolo delay prima di chiudere
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 250); // 250ms di grace period
  };

  const handleToggle = () => {
    // Gestione del click diretto per schermi touch o per chi preferisce cliccare
    setIsOpen((prev) => !prev);
  };

  const handleSelectLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setiIsOpen(false);
  };

  return (
    <div
      className="language-picker-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        className="button button-flat"
        onClick={handleToggle}
        aria-label="Select language"
      >
        <Globe size={18} />
      </button>

      {isOpen && (
        <div className="language-box">
          <ul>
            <li>
              <button
                type="button"
                className={i18n.language === "it" ? "active" : ""}
                onClick={() => handleSelectLanguage("it")}
              >
                {t("common.lang.italian")}
              </button>
            </li>
            <li>
              <button
                type="button"
                className={i18n.language === "en" ? "active" : ""}
                onClick={() => handleSelectLanguage("en")}
              >
                {t("common.lang.english")}
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
