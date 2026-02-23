import { useState, useCallback, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Header from "./components/Header.jsx";
import LoginPage from "./components/LoginPage.jsx";
import RegisterPage from "./components/RegisterPage";
import EnvelopesContainer from "./components/envelopes/EnvelopesContainer.jsx";
import ErrorPage from "./components/ErrorPage";
import { fetchAvailableNumbers } from "./http.js";
import Modal from "./components/Modal.jsx";
import PopUpAlert from "./components/PopUpAlert.jsx";
import Sidebar from "./components/sidebar/Sidebar.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import DashboardPage from "./components/DashboardPage.jsx";
import Settings from "./components/Settings.jsx";
import { useAuth } from "./components/context/AuthContext.jsx";

// Un componente Home veloce per il test
const Home = ({ user }) => (
  <div className="center">
    {!user && (
      <div>
        <p>Welcome to the 100 Envelopes app.</p>
        <p>
          Login to save your history, check your progress and set different
          score.
        </p>
        <Link to="/login" className="button">
          Login
        </Link>
      </div>
    )}
    {user && <p>Welcome back! Ready to choose another number?</p>}
  </div>
);

function App() {
  const [numbers, setNumbers] = useState([]);
  const [isFetching, setIsFetching] = useState(false); // Stato di caricamento globale
  const [error, setError] = useState();
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: null,
    number: null,
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { user, isLoading } = useAuth();

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
    if (user) {
      loadNumbers();
    } else {
      setNumbers([]); // Se log out, svuota la lista
    }
  }, [user, loadNumbers]);

  function handleStartRemoveNumber(number) {
    setModalConfig({
      isOpen: true,
      type: "single",
      number: number,
    });
  }
  function handleStartResetHistory() {
    setModalConfig({
      isOpen: true,
      type: "all",
      number: null,
    });
  }
  function handleStopRemoveNumber() {
    setModalConfig({
      isOpen: false,
      type: null,
      number: null,
    });
  }
  const handleDeleteNumber = useCallback(async () => {
    if (!modalConfig.number) {
      console.warn("Attenzione: modalConfig.number è null o undefined!");
      return;
    }
    try {
      const response = await fetch(
        `/api/numbers/soft-delete-number/${modalConfig.number}`,
        {
          method: "PATCH",  
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      if (response.ok) {
        // Aggiorniamo lo stato locale: teniamo tutti i numeri TRANNE quello appena cancellato
        setNumbers((prevNumbers) =>
          prevNumbers.filter(
            (n) => (typeof n === "object" ? n.value : n) !== modalConfig.number,
          ),
        );
      } else {
        alert("Errore nella risposta del server");
      }
    } catch (error) {
      console.error("Errore di rete (CORS o connessione):", error);
    }
    handleStopRemoveNumber(); // Chiudiamo e resettiamo
  }, [modalConfig.number, handleStopRemoveNumber]);

  const handleResetHistory = useCallback(async () => {
    try {
      const response = await fetch("/api/numbers/reset-all", {
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
    handleStopRemoveNumber();
  }, []);

  if (error) {
    return <ErrorPage title="Errore nel caricamento" message={error.message} />;
  }

  function handleError() {
    setError(null);
  }

  if (isLoading) return <div className="loader">Loading...</div>;

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
      <Modal open={modalConfig.isOpen} onClose={handleStopRemoveNumber}>
        {modalConfig.type === "single" && (
          <PopUpAlert
            type="DeletionConfirm"
            title="Sei sicuro?"
            text={`Vuoi davvero eliminare il numero ${modalConfig.number}?`}
            onCancel={handleStopRemoveNumber}
            onConfirm={handleDeleteNumber}
          />
        )}

        {modalConfig.type === "all" && (
          <PopUpAlert
            type="ResetConfirm"
            title="Conferma di reset"
            text="Vuoi archiviare tutta la cronologia attuale?"
            onCancel={handleStopRemoveNumber}
            onConfirm={handleResetHistory} // Questa ora verrà chiamata solo al click su "Conferma"
          />
        )}
      </Modal>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Home user={user} />
                <EnvelopesContainer onSaveSuccess={loadNumbers} />
              </>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/user/dashboard"
            element={
              <PrivateRoute user={user}>
                <DashboardPage
                  numbers={numbers}
                  isLoading={isFetching}
                  onDeleteNumber={handleStartRemoveNumber}
                  onResetHistory={handleStartResetHistory}
                  onSaveSuccess={loadNumbers} // Serve per ricaricare dopo una nuova busta
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={user ? <Settings user={user} /> : <Navigate to="/login" />}
          />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
