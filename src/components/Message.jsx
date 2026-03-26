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

/**
 * Convierte una URL de Cloudinary en URL de descarga forzada
 * usando el parámetro fl_attachment que Cloudinary soporta nativamente.
 *
 * Original:  .../upload/abc123.jpg
 * Descarga:  .../upload/fl_attachment:nombre/abc123.jpg
 */
function toDownloadUrl(url, filename) {
  if (!url) return url;
  try {
    const encoded = (filename || 'archivo').replace(/[^a-zA-Z0-9._-]/g, '_');
    return url.replace('/upload/', `/upload/fl_attachment:${encoded}/`);
  } catch {
    return url;
  }
}

export default function Message({ msg, own }) {
  const time = new Date(msg.created_at).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const isImage    = msg.file_type?.startsWith('image/');
  const downloadUrl = toDownloadUrl(msg.file_url, msg.file_name);

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
            <a
              href={downloadUrl}
              className="msg-download-btn"
              title={`Descargar ${msg.file_name}`}
            >
              ⬇️ Descargar
            </a>
          </div>
        )}

        {/* ── Archivo genérico (PDF, ZIP, etc.) ── */}
        {msg.file_url && !isImage && (
          <a
            href={downloadUrl}
            className="msg-file"
            title={`Descargar ${msg.file_name}`}
          >
            📎 {msg.file_name}
          </a>
        )}

        <span className="msg-time">{time}</span>
      </div>
    </div>
  );
}