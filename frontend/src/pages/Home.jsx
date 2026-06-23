import { useEffect, useState, useCallback } from "react";
import EnvelopesContainer from "../components/envelopes/EnvelopesContainer";
import EnvelopesGridDisplay from "../components/envelopes/EnvelopesGridDisplay";
import { Link } from "react-router-dom";

export default function HomePage({ user }) {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);

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
        <p>Caricamento...</p>
      </div>
    );

  // Se l'utente non ha ancora creato una sfida (es. primo accesso)
  if (!challenge) {
    return (
      <div className="center">
        <p>Non hai ancora una sfida attiva.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {user && (
        <div className="center">
          <p>Bentornato! Pronto a risparmiare?</p>
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
          <h3 className="stat-title">La tua progressione</h3>
          <div className="stats-grid two-columns">
            <div className="stats-card stats-counter">
              <p className="stats-title">Buste aperte: </p>
              <p className="stats-value">
                <strong>
                  {challenge?.amounts?.filter((env) => env.isOpened).length ||
                    0}{" "}
                  / 100
                </strong>
              </p>
            </div>
            <div className="stats-card stats-total">
              <p className="stats-title">Totale risparmiato: </p>
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
          <p>Registrati per iniziare la tua sfida.</p>
          <Link to="/login" className="button">
            Login
          </Link>
        </div>
      )}
    </div>
  );
}
