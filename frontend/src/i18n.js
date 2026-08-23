import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import itTranslation from "./locales/it.json";
import enTranslation from "./locales/en.json";

i18n
  // Rileva la lingua dell'utente (browser, localStorage, ecc.)
  .use(LanguageDetector)
  // Passa l'istanza di i18n a react-i18next
  .use(initReactI18next)
  // Inizializzazione
  .init({
    resources: {
      it: { translation: itTranslation },
      en: { translation: enTranslation },
    },
    fallback: "it", // Lingua di default se quella del browser non è disponibile
    interpolation: { escapeValue: false }, // React gestisce già la protezione da XSS
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

  export default i18n;
