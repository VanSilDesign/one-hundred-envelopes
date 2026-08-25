import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import apiAxios from "../../api/axiosConfig.js";
import ImageWithSkeleton from "../UI/ImageWithSkeleton.jsx";
import "./BadgesPage.css";

function BadgesPage() {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const response = await apiAxios.get("/api/user/my-badges");
        console.log(response.data);

        setBadges(response.data);
      } catch (err) {
        console.error("Errore fetch badges", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, []);

  /*  const { loading, badges, errror, data } = useQuery({
    queryKey: ["badges"],
    queryFn: () => apiAxios.then((res) => res.data),
  });
 */

  if (loading)
    return (
      <div>
        <p>{t("settings.badges.loading")}</p>
      </div>
    );

  return (
    <div className="badges-container">
      <h2>{t("settings.badges.title")}</h2>
      <div className="badges-grid">
        {badges.map((badge) => (
          <div
            key={badge._id}
            className={`badge-card ${badge.isUnlocked ? "unlocked" : "locked"}`}
          >
            <div className="badge-icon-wrapper">
              <ImageWithSkeleton src={badge.path} alt={badge.name} className="badge-icon" />
            </div>
            <p className="badge-name">{badge.name}</p>
            {badge.unlockedAt && (
              <span className="unlocked-date">
                {new Date(badge.unlockedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default BadgesPage;

/* 
export async function loader() {
  try {
    const response = await apiAxios.get("/user/badges");
    return response.data;
  } catch (error) {
    // 🧠 AGGIRIAMO L'INTERCETTORE:
    // Avendo messo il try/catch qui, l'errore lanciato da Axios viene "catturato" qui dentro
    // prima che possa raggiungere il raggio d'azione globale di React Router.

    console.log("Gestisco l'errore localmente per i badge...");

    // Invece di fare il throw, ritorniamo un valore di fallback sicuro!
    return {
      badges: [],
      errorNotice: "Impossibile caricare i badge al momento.",
    };
  }
}
 */