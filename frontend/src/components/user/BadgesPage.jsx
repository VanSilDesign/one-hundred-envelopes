import { useState, useEffect } from "react";
import apiAxios from "../../api/axiosConfig.js";
import "./BadgesPage.css";

export default function BadgesPage() {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const response = await apiAxios.get("/api/user/my-badges");
        console.log(response.data);
        
        setBadges(response.data);
        
      } catch (err) {
        console.error("Errore fetch badges", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, []);

  if (loading) return <div><p>Sto lucidando le medaglie...</p></div>;

  return (
    <div className="badges-container">
      <h2>I TUOI BADGE</h2>
      <div className="badges-grid">
        {badges.map((badge) => (
          <div
            key={badge._id}
            className={`badge-card ${badge.isUnlocked ? "unlocked" : "locked"}`}
          >
            <div className="badge-icon-wrapper">
              <img src={badge.path} alt={badge.name} className="badge-icon" />
            </div>
            <p className="badge-name">{badge.name}</p>
            {badge.unlockedAt && (
              <span className="unlocked-date">
                {new Date(badge.unlockedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
