import { useState, useCallback, useEffect } from "react";
import EnvelopesHistory from "./components/Envelopes/EnvelopeHistory.jsx";
import EnvelopesContainer from "./components/Envelopes/EnvelopesContainer.jsx";
import Header from "./components/Header.jsx";
import { fetchAvailableNumbers } from "./http.js";

//come inserire e richiamare lista

function App() {
  const [numbers, setNumbers] = useState([]);
  const [isFetching, setIsFetching] = useState(false); // Stato di caricamento globale

  const loadNumbers = useCallback(async () => {
    setIsFetching(true);
    try {
      const data = await fetchAvailableNumbers();

      // Se 'data' è un array di oggetti, estraiamo i valori
      const numbersArray = data.map((item) =>
        typeof item === "object" ? item.valore : item,
      );

      const sortedNumbers = [...numbersArray].sort((a, b) => a - b);
      setNumbers(sortedNumbers);
    } catch (error) {
      console.error("Errore nel caricamento:", error);
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    loadNumbers();
  }, [loadNumbers]);

  return (
    <>
      <Header />
      <main>
        <EnvelopesContainer onSaveSuccess={loadNumbers} />
        {/* Passiamo lo stato di caricamento alla storia */}
        <EnvelopesHistory numbers={numbers} isLoading={isFetching} />
      </main>
    </>
  );
}

export default App;
