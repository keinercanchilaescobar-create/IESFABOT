import React from 'react';

// Detecta URLs en el texto y las convierte en enlaces clicables
function renderTextWithLinks(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, i) => {
    if (/^https?:\/\/[^\s]+$/.test(part)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#00ff88', textDecoration: 'underline', wordBreak: 'break-all' }}
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

export default function Message({ msg, own }) {
  const time = new Date(msg.created_at).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const isImage = msg.file_type?.startsWith('image/');

  return (
    <div className={`message-wrapper ${own ? 'own' : 'other'}`}>
      <div className="message-bubble">
        {!own && <div className="msg-username">{msg.username}</div>}

        {msg.text && (
          <p className="msg-text">
            {renderTextWithLinks(msg.text)}
          </p>
        )}

        {msg.file_url && isImage && (
          <img
            src={msg.file_url}
            alt={msg.file_name}
            className="msg-image"
            onClick={() => window.open(msg.file_url, '_blank')}
          />
        )}

        {msg.file_url && !isImage && (
          <a
            href={msg.file_url}
            target="_blank"
            rel="noreferrer"
            className="msg-file"
          >
            📎 {msg.file_name}
          </a>
        )}

        <span className="msg-time">{time}</span>
      </div>
    </div>
  );
}