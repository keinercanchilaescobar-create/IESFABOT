import React, { useRef, useState } from 'react';

const CLOUD_NAME    = 'dnutlh8dn';
const UPLOAD_PRESET = 'iesfabot_uploads';

export default function Input({ onSend }) {
  const [text,      setText]      = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim(), null);
    setText('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Límite 100 MB (máximo plan gratuito Cloudinary)
    if (file.size > 100 * 1024 * 1024) {
      alert('Archivo demasiado grande. Máximo 100 MB.');
      e.target.value = '';
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file',          file);
      formData.append('upload_preset', UPLOAD_PRESET);
      formData.append('public_id',     `${Date.now()}-${file.name}`);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
        { method: 'POST', body: formData }
      );

      if (!response.ok) throw new Error('Error al subir a Cloudinary');

      const data = await response.json();

      onSend('', {
        url:  data.secure_url,
        name: file.name,
        type: file.type,
      });
    } catch (err) {
      alert('Error subiendo archivo: ' + err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="input-area">
      <input
        type="file"
        ref={fileRef}
        onChange={handleFile}
        style={{ display: 'none' }}
      />
      <button
        className="attach-btn"
        onClick={() => fileRef.current.click()}
        disabled={uploading}
        title="Adjuntar archivo"
      >
        {uploading ? '⏳' : '📎'}
      </button>
      <textarea
        className="text-input"
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={handleKey}
        placeholder="Escribe un mensaje... (Enter para enviar)"
        rows={1}
      />
      <button
        className="send-btn"
        onClick={handleSend}
        disabled={!text.trim() || uploading}
      >
        ➤
      </button>
    </div>
  );
}