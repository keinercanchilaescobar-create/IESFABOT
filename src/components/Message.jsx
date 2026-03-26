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
          style={{ color: '#00d4ff', textDecoration: 'underline', wordBreak: 'break-all' }}
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

// Descarga forzada via fetch+blob para evitar bloqueo CORS de Cloudinary
async function forceDownload(url, filename) {
  try {
    const res  = await fetch(url);
    const blob = await res.blob();
    const link = document.createElement('a');
    link.href     = URL.createObjectURL(blob);
    link.download = filename || 'archivo';
    link.click();
    URL.revokeObjectURL(link.href);
  } catch {
    // Si fetch falla (ej: PDF), abrir en pestaña nueva como fallback
    window.open(url, '_blank');
  }
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

        {/* ── Imagen ── */}
        {msg.file_url && isImage && (
          <div className="msg-image-wrapper">
            <img
              src={msg.file_url}
              alt={msg.file_name}
              className="msg-image"
              onClick={() => window.open(msg.file_url, '_blank')}
              title="Clic para ver en pantalla completa"
            />
            <button
              className="msg-download-btn"
              onClick={() => forceDownload(msg.file_url, msg.file_name)}
              title="Descargar imagen"
            >
              ⬇️ Descargar
            </button>
          </div>
        )}

        {/* ── Archivo genérico ── */}
        {msg.file_url && !isImage && (
          <button
            className="msg-file"
            onClick={() => forceDownload(msg.file_url, msg.file_name)}
          >
            📎 {msg.file_name}
          </button>
        )}

        <span className="msg-time">{time}</span>
      </div>
    </div>
  );
}