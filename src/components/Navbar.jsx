import React from 'react';

export default function Navbar({
  onMenuClick,
  onlineCount,
  connected,
  username,
  onLogout
}) {
  return (
    <nav className="navbar">

      {/* botón menú */}
      <button className="menu-btn" onClick={onMenuClick}>
        ☰
      </button>

      {/* título */}
      <h1 className="navbar-title">🤖 IESFABOT CHAT 🤖</h1>

      {/* lado derecho */}
      <div className="navbar-right">

        {/* estado conexión */}
        <div className="connection-status">
          <span className={`status-dot ${connected ? "online" : "offline"}`} />
          <span className="status-text">
            {connected ? "En línea" : "Desconectado"}
          </span>
        </div>

        {/* usuarios online */}
        <div className="online-badge">
          <span className="dot" />
          {onlineCount} online
        </div>

      </div>
    </nav>
  );
}