import React from 'react';
import logo from '../assets/logo.png'; // 👈 IMPORTANTE

export default function Navbar({ onMenuClick, onlineCount, onLogout, username }) {
  return (
    <nav className="navbar">
      
      <button className="menu-btn" onClick={onMenuClick}>☰</button>

      <div className="navbar-center">
        <img src={logo} alt="logo" className="navbar-logo" />
        <h1 className="navbar-title">IESFABOT CHAT</h1>
      </div>

      <div className="online-badge">
        <span className="dot" />
        {onlineCount} online
      </div>

    </nav>
  );
}