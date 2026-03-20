import React from 'react';

export default function Sidebar({ open, users, onClose }) {
  return (
    <>
      {open && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-header">
          <span>👥 USUARIOS ONLINE</span>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <ul className="user-list">
          {users.map((u, i) => (
            <li key={i} className="user-item">
              <span className="user-dot" />
              {u}
            </li>
          ))}
          {users.length === 0 && (
            <li className="no-users">Sin usuarios conectados</li>
          )}
        </ul>
      </aside>
    </>
  );
}
