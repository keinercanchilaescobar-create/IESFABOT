import React from 'react';

export default function Navbar({ onlineCount, onLogout, username }) {
  return (
    <nav className="navbar">
      <h1 className="navbar-title">🤖 IESFABOT CHAT 🤖</h1>
      <div className="online-badge">
        <span className="dot" />
        {onlineCount} online
      </div>
    </nav>
  );
}