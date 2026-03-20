import React, { useRef, useState } from 'react';
import { supabase } from '../supabase.js';

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

    // Límite 10 MB
    if (file.size > 10 * 1024 * 1024) {
      alert('Archivo demasiado grande. Máximo 10 MB.');
      e.target.value = '';
      return;
    }

    setUploading(true);
    try {
      const path = `${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage
        .from('chat-files')
        .upload(path, file, { contentType: file.type, upsert: false });

      if (upErr) throw upErr;

      const { data } = supabase.storage
        .from('chat-files')
        .getPublicUrl(path);

      onSend('', {
        url:  data.publicUrl,
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
