import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../supabase.js';
import Message from './Message.jsx';
import Input   from './Input.jsx';

export default function Chat({ onUsersUpdate, onConnected, username }) {
  const [messages,  setMessages]  = useState([]);
  const [connected, setConnected] = useState(false);

  const usernameRef      = useRef(username);
  const bottomRef        = useRef(null);
  const channelsRef      = useRef([]);
  const isAtBottom       = useRef(true);
  const messagesAreaRef  = useRef(null);
  const onUsersUpdateRef = useRef(onUsersUpdate);
  const onConnectedRef   = useRef(onConnected); // ✅ nueva ref

  useEffect(() => {
    usernameRef.current = username;
  }, [username]);

  useEffect(() => {
    onUsersUpdateRef.current = onUsersUpdate;
  }, [onUsersUpdate]);

  useEffect(() => {
    onConnectedRef.current = onConnected; // ✅ actualiza la ref
  }, [onConnected]);

  useEffect(() => {
    let mounted = true;

    async function init() {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(60);

      if (error) console.error('Error cargando mensajes:', error);
      if (mounted) setMessages(data || []);

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
          if (!mounted) return;
          const isConnected = status === 'SUBSCRIBED';
          setConnected(isConnected);
          onConnectedRef.current?.(isConnected); // ✅ notifica a App.jsx
        });

      const presenceChannel = supabase.channel('chat-presence');

      const updateUsers = () => {
        if (!mounted) return;
        const state = presenceChannel.presenceState();
        const users = [];
        Object.values(state).forEach(presences => {
          presences.forEach(p => {
            if (p.username && !users.includes(p.username)) {
              users.push(p.username);
            }
          });
        });
        onUsersUpdateRef.current(users, users.length);
      };

      presenceChannel
        .on('presence', { event: 'sync' },  updateUsers)
        .on('presence', { event: 'join' },  updateUsers)
        .on('presence', { event: 'leave' }, updateUsers)
        .subscribe(async (status) => {
          if (!mounted) return;

          if (status === 'SUBSCRIBED') {
            await presenceChannel.track({
              username: usernameRef.current,
              online_at: new Date().toISOString(),
            });
          }

          if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            setTimeout(async () => {
              if (!mounted) return;
              try {
                await presenceChannel.track({
                  username: usernameRef.current,
                  online_at: new Date().toISOString(),
                });
              } catch (err) {
                console.error('Error re-track:', err);
              }
            }, 2000);
          }
        });

      channelsRef.current = [msgChannel, presenceChannel];
    }

    init();

    return () => {
      mounted = false;
      channelsRef.current.forEach(ch => ch.unsubscribe());
    };
  }, []);

  useEffect(() => {
    if (isAtBottom.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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

  const clearHistory = () => {
    setMessages([]);
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

        <button className="clear-btn" onClick={clearHistory}>
          🗑️ Limpiar mi chat
        </button>
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