import { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig.js";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiAxios.get("/api/user/me");
        setUser(response.data);
        //console.log(response.data);
      } catch (error) {
        //console.log("Errore recupero utente", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading };
}
