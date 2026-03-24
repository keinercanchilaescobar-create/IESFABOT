import React, { useState, useEffect } from 'react';
import { supabase } from './supabase.js';
import Navbar  from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import Chat    from './components/Chat.jsx';
import Login   from './components/Login.jsx';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers]             = useState([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [username, setUsername]       = useState(null);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    // Verificar sesión existente al cargar
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUsername(session.user.user_metadata?.username || session.user.email);
      }
      setLoading(false);
    });

    // Escuchar cambios de sesión en tiempo real
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUsername(session.user.user_metadata?.username || session.user.email);
      } else {
        setUsername(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin  = (name) => setUsername(name);
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUsername(null);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-logo">🤖</div>
          <div className="loading-text">IESFABOT</div>
          <div className="loading-dots">
            <span /><span /><span />
          </div>
        </div>
      </div>s
    );
  }

  if (!username) return <Login onLogin={handleLogin} />;

  return (
    <div className="app-container">
      <Navbar
        onMenuClick={() => setSidebarOpen(o => !o)}
        onlineCount={onlineCount}
        onLogout={handleLogout}
        username={username}
      />
      <div className="main-layout">
        <Sidebar
          open={sidebarOpen}
          users={users}
          onClose={() => setSidebarOpen(false)}
        />
        <Chat
          username={username}
          onUsersUpdate={(u, c) => { setUsers(u); setOnlineCount(c); }}
        />
      </div>
    </div>
  );
}