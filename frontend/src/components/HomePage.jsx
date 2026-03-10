import { useEffect, useState, useCallback } from "react";
import EnvelopesContainer from "./envelopes/EnvelopesContainer";
import EnvelopesGridDisplay from "./envelopes/EnvelopesGridDisplay";

export default function HomePage({ user }) {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);

  // Funzione per caricare la sfida dal database
  const fetchChallenge = useCallback(async () => {
    try {
      const response = await fetch("/api/challenge-settings/get-current", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setChallenge(data);
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

  if (loading) return <div className="loader">Caricamento...</div>;

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
      {/* 1. SEZIONE SUPERIORE: Il cerchio "Choose/Save" */}
      <section className="top-section">
        <EnvelopesContainer
          user={user}
          amounts={challenge.amounts}
          currency={challenge.currency}
          onSaveSuccess={fetchChallenge} // Fondamentale: ricarica la griglia dopo il Save
        />
      </section>

      {/* 2. SEZIONE INFERIORE: La Griglia (History Container del mock-up) */}
      <section className="grid-section">
        <div className="section-header">
          <h3>La tua progressione</h3>
          <span>
            {challenge.amounts.filter((a) => a.isOpened).length} /{" "}
            {challenge.amounts.length}
          </span>
        </div>

        <EnvelopesGridDisplay
          amounts={challenge.amounts}
          currency={challenge.currency}
        />
      </section>
    </div>
  );
}
