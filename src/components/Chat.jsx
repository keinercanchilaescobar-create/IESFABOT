import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../supabase.js';
import Message from './Message.jsx';
import Input   from './Input.jsx';

export default function Chat({ onUsersUpdate, username }) {
  const [messages,  setMessages]  = useState([]);
  const [connected, setConnected] = useState(false);

  const usernameRef     = useRef(username);
  const bottomRef       = useRef(null);
  const channelsRef     = useRef([]);
  const isAtBottom      = useRef(true);
  const messagesAreaRef = useRef(null);

  // 🔹 NUEVO: referencia para el interval
  const intervalRef = useRef(null);

  useEffect(() => {
    usernameRef.current = username;
  }, [username]);

  useEffect(() => {
    let mounted = true;

    async function init() {
      // Historial
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(60);

      if (error) console.error('Error cargando mensajes:', error);
      if (mounted) setMessages(data || []);

      // Canal mensajes
      const msgChannel = supabase
        .channel('chat-messages')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'messages' },
          (payload) => {
            if (!mounted) return;
            setMessages(prev => {
              if (prev.find(m => m.id === payload.new.id)) return prev;
              return [...prev, payload.new];
            });
          }
        )
        .subscribe((status) => {
          if (mounted) setConnected(status === 'SUBSCRIBED');
        });

      // 🔥 PRESENCE CORREGIDO
      const presenceChannel = supabase.channel('chat-presence', {
        config: {
          presence: {
            key: usernameRef.current,
          },
        },
      });

      presenceChannel
        .on('presence', { event: 'sync' }, () => {
          if (!mounted) return;

          const state = presenceChannel.presenceState();

          // 🔥 evitar duplicados
          const users = [...new Set(
            Object.values(state)
              .flat()
              .map(u => u.username)
              .filter(Boolean)
          )];

          onUsersUpdate(users, users.length);
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED' && mounted) {
            await presenceChannel.track({
              username: usernameRef.current,
              online_at: new Date().toISOString(),
              status: 'online',
            });

            // 🔥 keep-alive (solución al problema)
            intervalRef.current = setInterval(() => {
              presenceChannel.track({
                username: usernameRef.current,
                online_at: new Date().toISOString(),
              });
            }, 15000);
          }
        });

      channelsRef.current = [msgChannel, presenceChannel];
    }

    init();

    return () => {
      mounted = false;
      channelsRef.current.forEach(ch => ch.unsubscribe());

      // 🔥 limpiar interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [onUsersUpdate]);

  // Auto-scroll
  useEffect(() => {
    if (isAtBottom.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Detectar scroll
  useEffect(() => {
    const area = messagesAreaRef.current;
    if (!area) return;

    const handleScroll = () => {
      const threshold = 100;
      isAtBottom.current =
        area.scrollHeight - area.scrollTop - area.clientHeight < threshold;
    };

    area.addEventListener('scroll', handleScroll);
    return () => area.removeEventListener('scroll', handleScroll);
  }, []);

  const sendMessage = async (text, file) => {
    if (!text?.trim() && !file) return;

    const { error } = await supabase.from('messages').insert({
      username:  usernameRef.current,
      text:      text || '',
      file_url:  file?.url   || null,
      file_name: file?.name  || null,
      file_type: file?.type  || null,
    });

    if (error) console.error('Error enviando mensaje:', error);
  };

  return (
    <div className="chat-container">
      <div className="status-bar">
        <span className={`status-dot ${connected ? 'connected' : 'disconnected'}`} />
        <span className="status-text">
          {connected ? 'Conectado' : 'Conectando...'}
        </span>

        <span className="username-chip">
          <span className="username-avatar">
            {username?.[0]?.toUpperCase() || '?'}
          </span>
          {username}
        </span>
      </div>

      <div className="messages-area" ref={messagesAreaRef}>
        {messages.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <p>No hay mensajes aún.<br />¡Sé el primero en escribir!</p>
          </div>
        )}

        {messages.map(msg => (
          <Message
            key={msg.id}
            msg={msg}
            own={msg.username === usernameRef.current}
          />
        ))}

        <div ref={bottomRef} />
      </div>

      <Input onSend={sendMessage} />
    </div>
  );
}