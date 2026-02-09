import { useState, useCallback, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Header from "./components/Header.jsx";
import LoginPage from "./components/LoginPage.jsx";
import EnvelopesHistory from "./components/Envelopes/EnvelopeHistory.jsx";
import EnvelopesContainer from "./components/Envelopes/EnvelopesContainer.jsx";
import ErrorPage from "./components/ErrorPage";
import { fetchAvailableNumbers } from "./http.js";
import Modal from "./components/Modal.jsx";
import PopUpAlert from "./components/PopUpAlert.jsx";

// Un componente Home veloce per il test
const Home = () => (
  <div className="center">
    <h1>Benvenuta nell'app 100 Envelopes</h1>
    <Link to="/login" className="button">
      Vai al Login
    </Link>
  </div>
);

function App() {
  const [numbers, setNumbers] = useState([]);
  const [isFetching, setIsFetching] = useState(false); // Stato di caricamento globale
  const [error, setError] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [modalType, setModalType] = useState(null);

  const loadNumbers = useCallback(async () => {
    setIsFetching(true);
    try {
      const data = await fetchAvailableNumbers();

      // Se 'data' è un array di oggetti, estraiamo i valori
      const numbersArray = data.map((item) =>
        typeof item === "object" ? item.value : item,
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

  function handleStartRemoveNumber(number) {
    setSelectedNumber(number);
    setModalType("single"); // Impostiamo il tipo
    setModalIsOpen(true);
  }
  function handleStartResetHistory() {
    setModalType("all"); // Impostiamo il tipo
    setModalIsOpen(true);
  }

  function handleStopRemoveNumber() {
    setModalIsOpen(false);
    setSelectedNumber(null);
  }
  const handleDeleteNumber = useCallback(async () => {
    if (!selectedNumber) return; // Sicurezza
    console.log("FUNZIONE CHIAMATA! Il numero da eliminare è:", selectedNumber);

    if (!selectedNumber) {
      console.warn("Attenzione: selectedNumber è null o undefined!");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3000/numbers/soft-delete-number/${selectedNumber}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      console.log(response.ok);

      if (response.ok) {
        // Aggiorniamo lo stato locale: teniamo tutti i numeri TRANNE quello appena cancellato
        setNumbers((prevNumbers) =>
          prevNumbers.filter(
            (n) => (typeof n === "object" ? n.value : n) !== selectedNumber,
          ),
        );
        console.log("Il numero è ora invisibile nel frontend");
      } else {
        alert("Errore nella risposta del server");
      }
    } catch (error) {
      console.error("Errore di rete (CORS o connessione):", error);
    }
    handleStopRemoveNumber(); // Chiudiamo e resettiamo
  }, [selectedNumber, handleStopRemoveNumber]);

  const handleResetHistory = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3000/numbers/reset-all", {
        method: "PATCH", // Usiamo PATCH perché stiamo modificando i dati, non eliminandoli
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        setNumbers([]); // Puliamo l'interfaccia
        console.log("Tutti i numeri sono stati archiviati.");
      } else {
        console.error("Errore durante il reset del server");
      }
    } catch (error) {
      console.error("Errore di rete:", error);
    }
    setModalIsOpen(false);
  }, []);

  if (error) {
    return <ErrorPage title="Errore nel caricamento" message={error.message} />;
  }

  function handleError() {
    setError(null);
  }

  return (
    <Router>
      <Modal open={error} onClose={handleError}>
        {error && (
          <ErrorPage
            title="Errore"
            message={error.message}
            onConfirm={handleError}
          />
        )}
      </Modal>
      <Modal open={modalIsOpen} onClose={handleStopRemoveNumber}>
        {modalType === "single" && (
          <PopUpAlert
            type="DeletionConfirm"
            title="Sei sicuro?"
            text={`Vuoi davvero eliminare il numero ${selectedNumber}?`}
            onCancel={handleStopRemoveNumber}
            onConfirm={handleDeleteNumber}
          />
        )}

        {modalType === "all" && (
          <PopUpAlert
            type="ResetConfirm"
            title="Conferma di reset"
            text="Vuoi archiviare tutta la cronologia attuale?"
            onCancel={handleStopRemoveNumber}
            onConfirm={handleResetHistory} // Questa ora verrà chiamata solo al click su "Conferma"
          />
        )}
      </Modal>
      <Header />
      <main>
        <LoginPage />
        <EnvelopesContainer onSaveSuccess={loadNumbers} />
        {/* Passiamo lo stato di caricamento alla storia */}
        <EnvelopesHistory
          numbers={numbers}
          isLoading={isFetching}
          onDeleteNumber={handleStartRemoveNumber}
          onResetHistory={handleStartResetHistory}
        />
      </main>
    </Router>
  );
}

export default App;
