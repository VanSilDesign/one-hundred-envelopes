import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../components/context/AuthContext";
import EnvelopesContainer from "../components/envelopes/EnvelopesContainer";
import EnvelopesGridDisplay from "../components/envelopes/EnvelopesGridDisplay";

export default function HomePage() {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { t } = useTranslation();

  // Funzione per caricare la sfida dal database
  const fetchChallenge = useCallback(async () => {
    try {
      const response = await fetch("/api/challenge/get-current", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setChallenge({ ...data });
      }
    } catch (error) {
      console.error("Errore nel caricamento della sfida:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChallenge();
  }, [fetchChallenge]);

  if (loading)
    return (
      <div>
        <h2>{t("common.loading")}</h2>
      </div>
    );

  // Se l'utente non ha ancora creato una sfida (es. primo accesso)
  if (!challenge) {
    return (
      <div className="center">
        <p>{t("homepage.no_challenges")}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {!user && <div className="center"></div>}
      {user && (
        <div className="center">
          <p>{t("homepage.welcome")}</p>
        </div>
      )}
      <section className="top-section">
        <EnvelopesContainer
          user={user}
          challengeTitle={challenge.challengeName}
          amounts={challenge.amounts}
          currency={challenge.currency}
          onSaveSuccess={fetchChallenge} // Fondamentale: ricarica la griglia dopo il Save
        />
      </section>
      {user ? (
        <section className="grid-section">
          <h3 className="stat-title">{t("homepage.progression")}</h3>
          <div className="stats-grid two-columns">
            <div className="stats-card stats-counter">
              <p className="stats-title">{t("homepage.opened_envelopes")}</p>
              <p className="stats-value">
                <strong>
                  {challenge?.amounts?.filter((env) => env.isOpened).length ||
                    0}{" "}
                  / 100
                </strong>
              </p>
            </div>
            <div className="stats-card stats-total">
              <p className="stats-title">{t("homepage.total_saved")}</p>
              <p className="stats-value">
                <strong>
                  {challenge?.amounts
                    ?.filter((env) => env.isOpened)
                    .reduce((acc, env) => acc + env.value, 0) || 0}
                  €
                </strong>
              </p>
            </div>
          </div>
          <EnvelopesGridDisplay
            amounts={challenge?.amounts || null}
            onUpdateSuccess={fetchChallenge} // Fondamentale: ricarica la griglia dopo l'Update
          />
        </section>
      ) : (
        <div className="login-section center">
          <p>{t("homepage.if_login")}</p>
          <div className="button-box">
            <Link to="/login" className="button">
              {t("common.login")}
            </Link>
            <Link to="/register" className="button">
              {t("common.signup")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
