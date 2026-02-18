import { createContext, useContext, useState, useEffect } from "react";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settingValues, setSettingValues] = useState({
    maxEnvelopeValue: 100,
    step: 1,
    numberOfEnvelopes: 100,
    currency: "€",
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings/get", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          if (data && Object.keys(data).length > 0) {
            setSettingValues(data);
          }
        }
      } catch (error) {
        console.log("Errore caricamento dati", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider
      value={{ settingValues, setSettingValues, isLoading }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
