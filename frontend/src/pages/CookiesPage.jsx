import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function CookiesPage() {
  const { i18n } = useTranslation();
  const [content, setContent] = useState("");

  useEffect(() => {
    const lang = i18n.language?.substring(0, 2) || "it";

    // Carica il file della lingua attiva; se non esiste, carica la versione 'en'
    import(`../content/cookies/cookies.${lang}.md?raw`)
      .then((res) => setContent(res.default))
      .catch(() => {
        import(`../content/cookies/cookies.en.md?raw`).then((res) =>
          setContent(res.default),
        );
      });
  }, [i18n.language]);

  return (
    <>
      <div className="forms-header">
        <Link title="Torna alla home" to="/" className="back-link">
          <ArrowLeft size={18} />
        </Link>
      </div>
      <div className="static-page-wrapper static-content">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </>
  );
}
