import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function TermsPage() {
  const { i18n } = useTranslation();
  const [content, setContent] = useState("");

  useEffect(() => {
    const lang = i18n.language?.substring(0, 2) || "it";

    // Carica il file della lingua attiva; se non esiste, carica la versione 'en'
    import(`../content/terms/terms.${lang}.md?raw`)
      .then((res) => setContent(res.default))
      .catch(() => {
        import(`../content/terms/terms.en.md?raw`).then((res) =>
          setContent(res.default),
        );
      });
  }, [i18n.language]);

  return (
    <>
      <div className="forms-header">
        <Link title="Torna al login" to="/login" className="back-link">
          <ArrowLeft size={18} />
        </Link>
      </div>
      <div className="static-page-wrapper static-content">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </>
  );
}
