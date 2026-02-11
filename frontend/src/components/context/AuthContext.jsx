import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function checkAuthStatus() {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:3000/auth/status", {
          credentials: "include", // FONDAMENTALE per inviare i cookie di sessione
        });

        const data = await response.json();

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
      await fetch("http://localhost:3000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      navigate("/login");
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
