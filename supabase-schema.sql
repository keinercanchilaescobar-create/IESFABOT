-- ============================================
-- IESFABOT CHAT — Schema para Supabase
-- Ejecutar en: Supabase > SQL Editor > Run
-- ============================================

-- Tabla de mensajes
create table if not exists messages (
  id           uuid default gen_random_uuid() primary key,
  username     text not null,
  text         text default '',
  file_url     text,
  file_name    text,
  file_type    text,
  created_at   timestamptz default now()
);

-- Tabla de usuarios online (presencia simple)
create table if not exists online_users (
  id         uuid default gen_random_uuid() primary key,
  username   text not null unique,
  last_seen  timestamptz default now()
);

-- Permisos públicos (sin login requerido)
alter table messages enable row level security;
alter table online_users enable row level security;

create policy "read_messages"  on messages for select using (true);
create policy "insert_messages" on messages for insert with check (true);
create policy "delete_old"      on messages for delete using (true);

create policy "read_online"   on online_users for select using (true);
create policy "insert_online" on online_users for insert with check (true);
create policy "update_online" on online_users for update using (true);
create policy "delete_online" on online_users for delete using (true);

-- Activar Realtime en la tabla messages
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table online_users;

-- Bucket de almacenamiento para archivos (ejecutar por separado si da error)
insert into storage.buckets (id, name, public)
values ('chat-files', 'chat-files', true)
on conflict do nothing;

create policy "upload_files" on storage.objects
  for insert with check (bucket_id = 'chat-files');

create policy "read_files" on storage.objects
  for select using (bucket_id = 'chat-files');
