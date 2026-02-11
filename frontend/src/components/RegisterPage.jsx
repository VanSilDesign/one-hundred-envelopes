import { useState } from "react";
import useInput from "../hooks/useInput.jsx";
import {
  isEmail,
  isNotEmpty,
  hasMinLength,
  isEqualsToOtherValue,
} from "../util/validation";
import Input from "./UI/Input";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const {
    value: emailValue,
    handleInputChange: handleEmailChange,
    handleInputBlur: handleEmailBlur,
    hasError: emailHasError,
  } = useInput("", (value) => isEmail(value) && isNotEmpty(value));

  const {
    value: passwordValue,
    handleInputChange: handlePasswordChange,
    handleInputBlur: handlePasswordBlur,
    hasError: passwordHasError,
  } = useInput("", (value) => hasMinLength(value, 8) && isNotEmpty(value));

  const {
    value: confirmPasswordValue,
    handleInputChange: handleconfirmPasswordChange,
    handleInputBlur: handleconfirmPasswordBlur,
    hasError: confirmPasswordHasError,
  } = useInput(
    "",
    (value) =>
      hasMinLength(value, 8) && isNotEmpty(value) && value === passwordValue,
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:3000/auth/register-admin",
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            username: emailValue,
            password: passwordValue,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        navigate("/login");
      } else {
        setError(data.message || "Registrazione fallita");
      }
    } catch (error) {
      setError("Errore di connesione: ", error);
    }
  };

  return (
    <div className="form-modal">
      <form onSubmit={handleSubmit}>
        <h2>Register your account</h2>

        <div className="control-row">
          <Input
            label="Email"
            id="email"
            type="email"
            name="email"
            onBlur={handleEmailBlur}
            onChange={handleEmailChange}
            value={emailValue}
            error={emailHasError && "Please enter a valid email!"}
          />
          <Input
            label="Password"
            id="password"
            type="password"
            name="password"
            onBlur={handlePasswordBlur}
            onChange={handlePasswordChange}
            value={passwordValue}
            error={passwordHasError && "Please enter a valid password!"}
          />
          <Input
            label="Confirm Password"
            id="confirm-password"
            type="password"
            name="confirm-password"
            onBlur={handleconfirmPasswordBlur}
            onChange={handleconfirmPasswordChange}
            value={confirmPasswordValue}
            error={confirmPasswordHasError && "Please enter a valid password!"}
          />
        </div>

        <p className="form-actions">
          <button className="button button-flat">Reset</button>
          <button className="button">Signup</button>
        </p>
      </form>
      <p>
        Already have an account? <Link to="/login">Signin</Link>
      </p>
    </div>
  );
}
