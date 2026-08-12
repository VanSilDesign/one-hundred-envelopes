import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Input from "../UI/Input";
import "./EditProfile.css";
import { ImagePicker } from "../UI/ImagePicker";

import apiAxios from "../../api/axiosConfig.js";
import { useNavigate } from "react-router-dom";
const BACKEND_URL = "http://localhost:3000"; // Porta del server Express
import defaultAvatar from "../../assets/default-avatar.png";

export default function EditProfile() {
  const { user, setUser, isLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  // Se l'utente ha già una foto salvata usa quella, altrimenti usiamo l'anteprima locale
  const [previewUrl, setPreviewUrl] = useState(
    user?.image ? `${BACKEND_URL}${user.image}` : defaultAvatar,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      if (user.image) {
        setPreviewUrl(`${BACKEND_URL}${user.image}`);
      } else {
        setPreviewUrl(defaultAvatar);
      }
    }
  }, [user]);

  const handleImageSelect = (file) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Inviamo lo username
      formData.append("username", username);

      // Inviamo il file solo se ne è stato selezionato uno nuovo
      if (selectedFile) {
        formData.append("avatar", selectedFile);
      }

      const response = await apiAxios.put("/api/user/save-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // 1. Aggiorna lo stato globale di AuthContext con i nuovi dati restituiti dal server
      const updatedUser = response.data.user || response.data;
      console.log(updatedUser);

      if (setUser) {
        setUser((prev) => ({
          ...prev,
          username: updatedUser.username,
          image: updatedUser.image || prev.image,
        }));
      }

      // 2. Aggiorna l'anteprima locale con l'URL completo del server della nuova immagine
      if (updatedUser.image) {
        setPreviewUrl(`${BACKEND_URL}${updatedUser.image}`);
      }

      alert("Immagine di profilo aggiornata con successo! 📸");
    } catch (error) {
      console.error("Errore nel salvataggio dell'immagine:", error);
      alert("Errore durante il caricamento dell'immagine.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return (
      <div>
        <p>Caricamento...</p>
      </div>
    );
  if (!user) return <div>Effettua il login per vedere questa pagina.</div>;

  return (
    <div className="form-container">
      <header className="form-header">
        <h2>Edit profile</h2>
      </header>
      <div className="profile-section">
        <form onSubmit={handleSubmit}>
          <div className="control-column">
            <div className="image-picker-box">
              <ImagePicker
                previewUrl={previewUrl}
                onImageSelect={handleImageSelect}
              />
            </div>
            <Input
              label="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <div className="profile-buttons">
              <button
                type="button"
                className="button button-flat"
                onClick={() => navigate("/user/profile")}
              >
                Annulla
              </button>
              <button type="submit" className="button" disabled={isSubmitting}>
                {isSubmitting ? "Salvataggio..." : "Salva Modifiche"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
