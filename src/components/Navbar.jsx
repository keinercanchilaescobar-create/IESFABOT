import React from 'react';

export default function Navbar({ onMenuClick, onlineCount, onLogout, username }) {
  return (
    <nav className="navbar">
      <button className="menu-btn" onClick={onMenuClick}>☰</button>
      <h1 className="navbar-title">🤖 IESFABOT CHAT 🤖</h1>
      <div className="online-badge">
        <span className="dot" />
        {onlineCount} online
      </div>
    </nav>
  );
}