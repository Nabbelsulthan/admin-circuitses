
import { useNavigate, Navigate } from "react-router-dom";
import { useState } from "react";
import "./Login.css";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import logo from "../assets/logo1.png";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");


  const isLoggedIn =
    localStorage.getItem("isLoggedIn");

  if (isLoggedIn) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }
  const handleLogin = (e) => {
    e.preventDefault();


    if (
      email === "admin@circuitses.com" &&
      password === "admin123"
    ) {
      localStorage.setItem("isLoggedIn", "true");

      navigate("/dashboard", {
        replace: true,
      });
    } else {
      setError("Invalid email or password");
    }

  };

  return (
    <div className="login-page">
      <div className="login-left">

        <img
          src={logo}
          alt="CircuitsES Logo"
          className="company-logo"
        />

        <h1>CES Admin</h1>
        <h3>Administration Portal</h3>

        <p>
          Secure internal platform for managing projects,
          customers, documentation, FAT reports and
          dispatch operations.
        </p>

        <div className="feature-grid">
          <div className="feature-card">✓ Project Tracking</div>
          <div className="feature-card">✓ Customer Management</div>
          <div className="feature-card">✓ Document Control</div>
          <div className="feature-card">✓ Dispatch Monitoring</div>
        </div>
      </div>

      <div className="login-right">
        <form className="login-card" onSubmit={handleLogin}>
          <span className="badge">SECURE ACCESS</span>

          <h2>Admin Login</h2>

          <p className="subtitle">
            Sign in to access the admin dashboard.
          </p>

          <label>Email Address</label>

          <div className="input-wrapper">
            <EmailOutlinedIcon className="field-icon" />

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
            />
          </div>

          <label>Password</label>

          <div className="input-wrapper">
            <LockOutlinedIcon className="field-icon" />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? (
                <VisibilityOffOutlinedIcon />
              ) : (
                <VisibilityOutlinedIcon />
              )}
            </button>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-btn"
          >
            Login to CES Admin
          </button>

          <div className="footer-text">
            Circuits Energy System Pvt Ltd.
          </div>
        </form>
      </div>
    </div>
  );
}