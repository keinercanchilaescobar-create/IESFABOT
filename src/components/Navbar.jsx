import React from "react";
import logo from "../assets/logo.png";

export default function Navbar({ onMenuClick, onlineCount }) {
  return (
    <nav className="navbar">
      
      {/* Botón menú */}
      <button
        className="menu-btn"
        onClick={onMenuClick}
        aria-label="Abrir menú"
      >
        ☰
      </button>

      {/* Centro: logo + título */}
      <div className="navbar-center">
        <img
          src={logo}
          alt="IESFABOT logo"
          className="navbar-logo"
        />
        <h1 className="navbar-title">IESFABOT CHAT</h1>
      </div>

      {/* Usuarios online */}
      <div className="online-badge">
        <span className="dot"></span>
        {onlineCount} online
      </div>

    </nav>
  );
}