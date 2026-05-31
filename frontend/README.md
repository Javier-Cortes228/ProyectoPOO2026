# BanduMusic Frontend

Frontend moderno de BanduMusic construido con React + Vite.

## Vistas Principales

- Catálogo local: consume el backend Spring Boot y reproduce archivos `.mp3` locales.
- Catálogo online: consulta Jamendo API a través del backend y reproduce audio externo sin persistirlo.
- Playlists y favoritos: trabajan solo con contenido local persistido.
- Autenticación: usa JWT Bearer emitido por el backend y lo envía en cada llamada protegida.
- Jamendo: usa paginación con botón "Cargar más" y precarga de audio para reducir la espera antes de reproducir.

## Ejecución

```bash
npm install
npm run dev
```

URL local:

```text
http://127.0.0.1:5173
```

El proxy de Vite apunta a `http://localhost:8080` para `/api` y `/audio`.
