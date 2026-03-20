import React from 'react';

export default function Navbar({ onMenuClick, onlineCount }) {
  return (
    <nav className="navbar">
      <button className="hamburger" onClick={onMenuClick} aria-label="Menú">☰</button>
      <h1 className="navbar-title">🤖 IESFABOT CHAT 🤖</h1>
      <div className="online-badge">
        <span className="dot" />
        {onlineCount} online
      </div>
    </nav>
  );
}
