# BanduMusic Frontend

Frontend moderno de BanduMusic construido con React, Vite y Tailwind CSS.

## Vistas principales

- BanduMusic Hub: catalogo local servido por Spring Boot y archivos `.mp3`.
- Catalogo online: consulta Jamendo API a traves del backend.
- Buscador global: cruza resultados locales y Jamendo.
- Playlists y favoritos: soportan contenido local y referencias externas de Jamendo.
- Historial y recomendaciones: muestran reproducciones recientes y sugerencias mixtas.
- Autenticacion: login, registro, verificacion de correo y recuperacion de contraseña conectados al backend.
- Sesion: usa cookie `HttpOnly`; el frontend no guarda JWT en `localStorage`.
- Reproductor: controles personalizados de play/pause, anterior/siguiente, progreso, volumen y mute.

## Tailwind CSS

La identidad visual se configura en `tailwind.config.js`.

- Fuentes: `Inter` y `Orbitron`.
- Colores: `background`, `surface`, `hover`, `primary`, `secondary`, `textMain`, `textSub`.
- Utilidad `.glass`: definida en `src/index.css` para paneles con blur y bordes sutiles.

Los componentes nuevos deben reutilizar estos tokens para mantener coherencia con el rediseño.

## Ejecucion

```bash
npm install
npm run dev
```

URL local:

```text
http://127.0.0.1:5173
```

El proxy de Vite apunta a `http://127.0.0.1:8080` para `/api` y `/audio` por defecto, enviando cookies de autenticacion con `credentials: include`.

Si el backend corre en otro puerto, crea un archivo local `.env` dentro de `frontend/` o define la variable de entorno equivalente:

```properties
VITE_BACKEND_URL=http://127.0.0.1:8081
```
