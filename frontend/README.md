# BanduMusic Frontend

Frontend local en Vite + React para consumir la API Spring Boot de BanduMusic.

## Requisitos

- Backend Spring Boot corriendo en `http://localhost:8080`.
- Node.js instalado.

## Uso local

```bash
npm install
npm run dev
```

La app se abre en `http://127.0.0.1:5173`.

## YouTube

La busqueda de YouTube funciona solo si el backend tiene configurada la variable de entorno `YOUTUBE_API_KEY`.
La reproduccion se hace mediante un iframe visible de YouTube. No se descarga ni se extrae audio.
