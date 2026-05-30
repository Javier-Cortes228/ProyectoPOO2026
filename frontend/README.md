# BanduMusic

**Proyecto de Programación Orientada a Objetos (POO) 2026**  
*Universidad de La Frontera, Temuco, Chile*

## Descripción

BanduMusic es una plataforma de música inspirada en Spotify. Permite crear una cuenta, explorar un catálogo local de canciones y podcasts, reproducir audio, marcar favoritos y organizar contenido en playlists personalizadas.

La arquitectura mantiene el catálogo local como núcleo del proyecto para respetar los requisitos de POO y persistencia. Las integraciones externas, como YouTube u otras APIs musicales, deben funcionar solo como complemento.

## Integrantes

- Javier Cortés
- Carlos Ramirez

## Stack Tecnológico

- **Backend:** Java 21 + Spring Boot
- **Base de datos:** PostgreSQL + Spring Data JPA
- **Frontend:** React + Vite
- **Seguridad básica:** BCrypt para contraseñas
- **Contenido local:** archivos `.mp3` servidos desde Spring Boot

## Funcionalidades

- Registro e inicio de sesión de usuarios.
- Catálogo local de canciones y podcasts.
- Reproducción de audio local.
- Creación de playlists personalizadas.
- Agregado y eliminación de contenido en playlists.
- Favoritos persistidos como playlist especial del usuario.
- Búsqueda externa preparada para YouTube, sin reemplazar el catálogo local.

## Requisitos Académicos Cubiertos

- Herencia: `Cancion` y `Podcast` heredan de `ContenidoAudio`.
- Clase abstracta: `ContenidoAudio`.
- Interfaz propia: `Reproducible`.
- Relaciones entre clases: usuario-playlists, playlists-contenidos, catálogo-contenidos.
- Excepciones personalizadas: usuario duplicado, credenciales inválidas, contenido no encontrado, playlist llena, integración externa.
- Programación funcional: uso de `stream`, `filter`, `map`, `removeIf`.
- Pruebas unitarias con JUnit.

## Configuración

La configuración sensible se maneja con variables de entorno. El archivo versionable de referencia es `src/main/resources/application-example.properties`; el archivo local `application.properties` queda ignorado por Git para evitar publicar contraseñas o claves.

```properties
DB_URL=jdbc:postgresql://localhost:5432/postgres
DB_USERNAME=postgres
DB_PASSWORD=postgres
APP_CORS_ALLOWED_ORIGINS=http://127.0.0.1:5173,http://localhost:5173
YOUTUBE_API_KEY=
YOUTUBE_SEARCH_MAX_RESULTS=10
```

Para usar YouTube más adelante, basta con definir `YOUTUBE_API_KEY`; la integración debe mantenerse como sección complementaria y no como fuente principal del catálogo.

## Ejecución

Backend:

```bash
mvn spring-boot:run
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

El frontend Vite queda disponible en `http://127.0.0.1:5173` y usa proxy hacia el backend en `http://localhost:8080`.

## Demo

Usuarios semilla:

- `admin@ufro.cl` / `1234`
- `test@ufro.cl` / `1234`

El catálogo local se carga automáticamente si la base de datos está vacía.