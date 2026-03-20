import React, { useEffect, useRef, useState } from 'react';
import { supabase, signInAnonymously } from '../supabase.js';
import { supabase } from '../supabase.js';
import Message from './Message.jsx';
import Input from './Input.jsx';

function getUsername() {
  const key = 'iesfabot_username';
  let name = sessionStorage.getItem(key);
  if (!name) {
    name = `User_${Math.floor(Math.random() * 9999)}`;
    sessionStorage.setItem(key, name);
  }
  return name;
}

export default function Chat({ onUsersUpdate }) {
  const [messages,  setMessages]  = useState([]);
  const [connected, setConnected] = useState(false);
  const [username,  setUsername]  = useState(getUsername);
  const usernameRef  = useRef(getUsername());
  const bottomRef    = useRef(null);
  const channelsRef  = useRef([]);

  useEffect(() => {
    let mounted = true;

    async function init() {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(60);

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
          if (mounted) setConnected(status === 'SUBSCRIBED');
        });

      const presenceChannel = supabase.channel('chat-presence');
      presenceChannel
        .on('presence', { event: 'sync' }, () => {
          if (!mounted) return;
          const state = presenceChannel.presenceState();
          const users = Object.values(state).flat().map(u => u.username).filter(Boolean);
          onUsersUpdate(users, users.length);
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED' && mounted) {
            await presenceChannel.track({
              username: usernameRef.current,
              online_at: new Date().toISOString(),
            });
          }
        });

      channelsRef.current = [msgChannel, presenceChannel];
    }

    init();

    return () => {
      mounted = false;
      channelsRef.current.forEach(ch => ch.unsubscribe());
    };
  }, [onUsersUpdate]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text, file) => {
    await supabase.from('messages').insert({
      username:  usernameRef.current,
      text:      text || '',
      file_url:  file?.url   || null,
      file_name: file?.name  || null,
      file_type: file?.type  || null,
    });
  };

  const rename = () => {
    const n = prompt('Nuevo nombre de usuario:', usernameRef.current);
    if (!n?.trim()) return;
    usernameRef.current = n.trim();
    setUsername(n.trim());
    sessionStorage.setItem('iesfabot_username', n.trim());
  };

  return (
    <div className="chat-container">
      <div className="status-bar">
        <span className={`status-dot ${connected ? 'connected' : 'disconnected'}`} />
        {connected ? 'Conectado a Supabase' : 'Conectando...'}
        <span className="username-display">&nbsp;| 👤 {username}</span>
        <button className="rename-btn" onClick={rename} title="Cambiar nombre">✏️</button>
      </div>
      <div className="messages-area">
        {messages.map(msg => (
          <Message key={msg.id} msg={msg} own={msg.username === usernameRef.current} />
        ))}
        <div ref={bottomRef} />
      </div>
      <Input onSend={sendMessage} />
    </div>
  );
}
