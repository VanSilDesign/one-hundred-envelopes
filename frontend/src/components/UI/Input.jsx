import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Input({ label, id, type, error, ...props }) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  // Determiniamo il tipo di input: se è password e la visibilità è attiva, diventa 'text'
  const inputType = type === "password" && isPasswordVisible ? "text" : type;

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  return (
    <div className="control no-margin">
      <label htmlFor={id}>{label}</label>
      <div className="input-container">
        <input id={id} type={inputType} {...props} />

        {type === "password" && (
          <button
            type="button"
            className="password-toggle"
            onClick={togglePasswordVisibility}
            tabIndex="-1" // Evita che il tasto TAB si fermi sull'occhio
          >
            {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      <div className="control-error">{error && <p>{error}</p>}</div>
    </div>
  );
}
