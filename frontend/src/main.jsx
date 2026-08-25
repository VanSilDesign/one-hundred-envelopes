import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./components/context/AuthContext.jsx";
import { SettingsProvider } from "./components/context/SettingsContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  
    <AuthProvider>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </AuthProvider>
 ,
);
