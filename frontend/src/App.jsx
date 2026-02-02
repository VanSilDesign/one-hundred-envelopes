import { useState, useCallback, useEffect } from "react";
import EnvelopesHistory from "./components/Envelopes/EnvelopeHistory.jsx";
import EnvelopesContainer from "./components/Envelopes/EnvelopesContainer.jsx";
import Header from "./components/Header.jsx";
import ErrorPage from "./components/ErrorPage";
import { fetchAvailableNumbers } from "./http.js";

//come inserire e richiamare lista

function App() {
  const [numbers, setNumbers] = useState([]);
  const [isFetching, setIsFetching] = useState(false); // Stato di caricamento globale
  const [error, setError] = useState();

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
      setError({
        message:
          error.message ||
          "Non è stato possibile caricare i dati, riprovare più tardi.",
      });
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    loadNumbers();
  }, [loadNumbers]);

  const deleteNumberHandler = async (numberToDelete) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/numbers/${numberToDelete}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        // Aggiorniamo lo stato locale: teniamo tutti i numeri TRANNE quello appena cancellato
        setNumbers((prevNumbers) =>
          prevNumbers.filter(
            (n) => (typeof n === "object" ? n.valore : n) !== numberToDelete,
          ),
        );
      } else {
        alert("Non è stato possibile eliminare il numero.");
      }
    } catch (error) {
      console.error("Errore nella cancellazione:", error);
    }
  };

  if (error) {
    return <ErrorPage title="Errore nel caricamento" message={error.message} />;
  }

  return (
    <>
      <Header />
      <main>
        <EnvelopesContainer onSaveSuccess={loadNumbers} />
        {/* Passiamo lo stato di caricamento alla storia */}
        <EnvelopesHistory
          numbers={numbers}
          isLoading={isFetching}
          onDeleteNumber={deleteNumberHandler}
        />
      </main>
    </>
  );
}

export default App;
