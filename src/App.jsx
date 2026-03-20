import React, { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import Chat from './components/Chat.jsx';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers]             = useState([]);
  const [onlineCount, setOnlineCount] = useState(0);

  return (
    <div className="app-container">
      <Navbar
        onMenuClick={() => setSidebarOpen(o => !o)}
        onlineCount={onlineCount}
      />
      <div className="main-layout">
        <Sidebar
          open={sidebarOpen}
          users={users}
          onClose={() => setSidebarOpen(false)}
        />
        <Chat onUsersUpdate={(u, c) => { setUsers(u); setOnlineCount(c); }} />
      </div>
    </div>
  );
}
