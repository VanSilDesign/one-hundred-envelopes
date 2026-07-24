import { Outlet } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../components/context/AuthContext.jsx";

// Layout & UI
import Modal from "../components/modals/Modal.jsx";
import Header from "../components/Header.jsx";
import Sidebar from "../components/sidebar/Sidebar.jsx";
import BottomNavbar from "../components/navbar/BottomNavbar.jsx";

function RootLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [error, setError] = useState(null);
  //const { user } = useAuth();

  return (
    <>
      <Modal open={!!error} onClose={() => setError(null)}>
        {error && (
          <ErrorPage
            title="Errore"
            message={error.message}
            onConfirm={() => setError(null)}
          />
        )}
      </Modal>
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main>
        <Outlet />
      </main>
      <BottomNavbar />
    </>
  );
}

export default RootLayout;
