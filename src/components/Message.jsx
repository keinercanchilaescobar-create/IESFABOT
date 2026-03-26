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
 * Descarga un archivo usando fetch + blob para forzar la descarga
 * incluso cuando la URL es de un dominio externo (Cloudinary, S3, etc.)
 * El atributo `download` en un <a> solo funciona en el mismo origen,
 * por eso este enfoque es necesario.
 */
async function downloadFile(url, filename) {
  console.log('👉 downloadFile llamado con:', url, filename);
  try {
    const response = await fetch(url);
    console.log('📦 response status:', response.status, response.ok);
    if (!response.ok) throw new Error('Error al obtener el archivo');
    const blob = await response.blob();
    console.log('🧩 blob size:', blob.size, '| type:', blob.type);
    const blobUrl = URL.createObjectURL(blob);
    console.log('🔗 blobUrl generado:', blobUrl);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename || 'archivo';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(blobUrl);
    console.log('✅ Descarga iniciada correctamente');
  } catch (err) {
    console.error('❌ Error al descargar:', err);
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
              title={`Descargar ${msg.file_name}`}
              onClick={(e) => {
                e.stopPropagation();
                alert('click recibido');
                downloadFile(msg.file_url, msg.file_name);
              }}
            >
              ⬇️ Descargar
            </button>
          </div>
        )}

        {/* ── Archivo genérico (PDF, ZIP, etc.) ── */}
        {msg.file_url && !isImage && (
          <button
            className="msg-file"
            title={`Descargar ${msg.file_name}`}
            onClick={() => downloadFile(msg.file_url, msg.file_name)}
          >
            📎 {msg.file_name}
          </button>
        )}

        <span className="msg-time">{time}</span>
      </div>
    </div>
  );
}