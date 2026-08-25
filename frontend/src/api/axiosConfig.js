import axios from "axios";

const apiAxios = axios.create({
  // Se sei in sviluppo usa localhost, altrimenti usa l'URL di produzione
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true, // Fondamentale per i cookie di sessione/Passport
});

// apiAxios.js
apiAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      throw new Response(
        JSON.stringify({
          message: error.response.data?.message || "Errore API",
        }),
        { status: error.response.status },
      );
      console.error(
        "API Error:",
        error.response?.data?.message || error.message,
      );
    }
    throw new Response(JSON.stringify({ message: "Network Error" }), {
      status: 500,
    });
  },
);

export default apiAxios;
