import { useEffect } from "react";
import { useState } from "react";
import ChallengeIcon from "../UI/ChallengeIcon";
import "./SavingsProgressBar.css";

const SavingsProgressBar = ({
  current,
  total,
  percentage,
  challengeColor = "#cd8660",
  challengeIcon = "envelope",
}) => {
  const [displayPercentage, setDisplayPercentage] = useState(0);
  const [isShining, setIsShining] = useState(true);

  useEffect(() => {
    let start = 0;
    const end = Math.floor(percentage * 10);
    // const end = Math.floor(percentage);
    if (start === end) return;

    let totalDuration = 1000;
    let incrementTime = totalDuration / end;

    let timer = setInterval(() => {
      start += 1;
      setDisplayPercentage((start / 10).toFixed(1));
      if (start === end) clearInterval(timer);
    }, incrementTime);

    const shineTimer = setTimeout(() => {
      setIsShining(false);
    }, 1000);

    return () => {
      clearInterval(timer);
      clearTimeout(shineTimer);
    };
  }, [percentage]);

  return (
    <div className="thermometer-section">
      <div className="thermometer-header">
        <h3>Progress Soda</h3>
        <span>
          {current === total ? "Sfida Completata! 🎉" : "Stato della ricarica"}
        </span>
      </div>

      <div className="progress-container">
        {/* La barra di sfondo */}
        <div className="progress-bar-bg">
          {/* La parte colorata che cresce */}
          <div
            className="progress-bar-fill"
            style={{
              width: `${displayPercentage}%`,
              // TRUCCO: Usiamo il colore dinamico per il gradiente del liquido!
              background: `linear-gradient(90deg, ${challengeColor}CC 0%, ${challengeColor} 100%)`,
              // Nota: 'CC' aggiunge un po' di trasparenza (alfa) all'inizio del gradiente
               borderRadius: displayPercentage > 99.5 ? "20px 20px 20px 20px" : "20px 60px 6px 20px"
            }}
          >
            {/* Le bollicine: ora sono SEMPRE presenti dentro il liquido */}
            <div className="bubbles-container">
              {[...Array(18)].map((_, i) => (
                <div key={i} className="bubble"></div>
              ))}
            </div>

            {/* Il riflesso: presente solo se isShining è true */}
            {isShining && <div className="liquid-shine"></div>}
          </div>
          {/* L'icona personalizzata, default la busta */}
          <div className="goal-icon-container">
            <span
              className="progress-text"
              style={{
                color: displayPercentage > 2 ? "#ffffff" : challengeColor, // Esempio: diventa bianco dopo metà barra
              }}
            >
              {displayPercentage}%
            </span>
            <ChallengeIcon
              iconName={challengeIcon} // Questa arriva dal DB (es: "umbrella", "car", "piggy-bank")
              color={displayPercentage > 99.5 ? "#ffffff" : challengeColor} // Il colore dinamico della sfida
              size={28}
              className="goal-icon"
            />
          </div>
        </div>
      </div>

      <div className="progress-labels">
        <span className="current-saved">
          {current.toLocaleString("it-IT")} € / {total.toLocaleString("it-IT")}{" "}
          € risparmiati
        </span>
      </div>
    </div>
  );
};

export default SavingsProgressBar;
