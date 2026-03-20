# 🤖 IESFABOT CHAT — con Supabase (100% gratis)

Chat en tiempo real con React + Supabase. Sin Firebase, sin Cloudflare Workers backend, 100% gratuito.

---

## 🚀 SETUP EN 3 PASOS

### PASO 1 — Crear proyecto Supabase (2 min)

1. Ve a **https://supabase.com** → New project (gratis, sin tarjeta)
2. Anota tu **Project URL** y **anon key** (Settings > API)
3. Ve a **SQL Editor** y ejecuta TODO el contenido de `supabase-schema.sql`

### PASO 2 — Configurar credenciales

```bash
# En la carpeta del proyecto:
cp .env.example .env
```

Abre `.env` y rellena con tus datos:
```
VITE_SUPABASE_URL=https://TUPROYECTO.supabase.co
VITE_SUPABASE_ANON=eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

### PASO 3 — Instalar y arrancar

```bash
npm install
npm run dev
```

✅ Abre http://localhost:5173 — **¡Chat funcionando!**

---

## 🌐 DEPLOY GRATIS (Cloudflare Pages)

```bash
# Login en Cloudflare (abre el navegador)
npx wrangler login

# Build + deploy automático
npm run deploy
```

URL: `https://iesfabot-chat.pages.dev`

> ⚠️ Añade tus variables de entorno en Cloudflare Pages > Settings > Environment Variables

---

## ✅ FUNCIONES

| Función | Estado |
|---|---|
| Mensajes tiempo real | ✅ Supabase Realtime |
| Historial persistente | ✅ PostgreSQL |
| Upload imágenes/archivos | ✅ Supabase Storage (1 GB gratis) |
| Usuarios online | ✅ Presence channels |
| Cambiar nombre de usuario | ✅ |
| Responsive mobile | ✅ |
| 100% gratuito | ✅ |

---

## 📋 LÍMITES GRATUITOS DE SUPABASE

- Base de datos: 500 MB
- Almacenamiento: 1 GB
- Bandwidth: 5 GB/mes
- Realtime: ilimitado
- Usuarios activos: 50.000/mes

Más que suficiente para un chat escolar.
