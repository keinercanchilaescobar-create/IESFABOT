import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [user, setUser] = useState('');

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">IESFABOT</h2>

        <input
          className="login-input"
          type="text"
          placeholder="Tu nombre..."
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />

        <button
          className="login-btn"
          onClick={() => onLogin(user)}
        >
          Entrar
        </button>
      </div>
    </div>
  );
}