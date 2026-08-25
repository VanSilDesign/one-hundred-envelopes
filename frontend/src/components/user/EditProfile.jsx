import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import apiAxios from "../../api/axiosConfig.js";

import { ImagePicker } from "../UI/ImagePicker";
import Input from "../UI/Input";
import "./EditProfile.css";

const BACKEND_URL = "http://localhost:3000"; // Porta del server Express
import defaultAvatar from "../../assets/default-avatar.png";

export default function EditProfile() {
  const { user, setUser, isLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const { t } = useTranslation();
  
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
        <p>{t("common.loading")}</p>
      </div>
    );
  if (!user) return <div>{t("settings.no_login")}</div>;

  return (
    <div className="form-container">
      <header className="form-header">
        <h2>{t("settings.edit_profile")}</h2>
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
                className="button button-back"
                onClick={() => navigate("/user/profile")}
              >
                {t("common.cancel")}
              </button>
              <button type="submit" className="button" disabled={isSubmitting}>
                {isSubmitting ? `${t("common.save_in_progress")}` : `${t("common.save")}`}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
