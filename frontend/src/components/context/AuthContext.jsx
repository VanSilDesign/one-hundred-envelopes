import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function checkAuthStatus() {
      setIsLoading(true);
      try {
        const response = await fetch("/api/auth/status", {
          credentials: "include", // FONDAMENTALE per inviare i cookie di sessione
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Il server ha risposto con un errore:", errorText);
          return;
        }

        const data = await response.json();
        // console.log("Stato autenticazione:", data);
        if (data.isAuthenticated) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Errore nel controllo autenticazione: ", error);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuthStatus();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
    } catch (error) {
      console.error("Errore durante il logout", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
