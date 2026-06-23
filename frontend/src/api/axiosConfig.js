import axios from 'axios';

const apiAxios = axios.create({
  // Se sei in sviluppo usa localhost, altrimenti usa l'URL di produzione
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true, // Fondamentale per i cookie di sessione/Passport
});

apiAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

export default apiAxios;