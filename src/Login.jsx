import React, { useState } from 'react';
import { supabase } from '../supabase.js';

export default function Login({ onLogin }) {
  const [mode, setMode]       = useState('login'); // 'login' o 'register'
  const [email, setEmail]     = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    if (mode === 'register') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } }
      });
      if (error) { setError(error.message); setLoading(false); return; }
      setError('¡Registro exitoso! Ya puedes iniciar sesión.');
      setMode('login');
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
      onLogin(data.user.user_metadata?.username || email);
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">🤖 IESFABOT CHAT</h1>
        <div className="login-tabs">
          <button className={mode === 'login' ? 'tab active' : 'tab'} onClick={() => setMode('login')}>Iniciar sesión</button>
          <button className={mode === 'register' ? 'tab active' : 'tab'} onClick={() => setMode('register')}>Registrarse</button>
        </div>
        {mode === 'register' && (
          <input
            className="login-input"
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        )}
        <input
          className="login-input"
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="login-input"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />
        {error && <p className="login-error">{error}</p>}
        <button className="login-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Cargando...' : mode === 'login' ? 'Entrar' : 'Registrarse'}
        </button>
      </div>
    </div>
  );
}