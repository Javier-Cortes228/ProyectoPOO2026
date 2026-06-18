# BanduMusic

<p align="center">
  <img src="frontend/public/assets/images/logo-bandumusic2.png" alt="BanduMusic" width="500">
</p>

**Proyecto de Programación Orientada a Objetos (POO) 2026**  
*Universidad de La Frontera, Temuco, Chile*

## Descripción

BanduMusic es una plataforma musical inspirada en Spotify. Permite crear una cuenta, explorar un catálogo local de canciones y podcasts, reproducir audio, marcar favoritos y organizar contenido en playlists personalizadas.

La arquitectura conserva el catálogo local como núcleo del proyecto para respetar los requisitos de POO y persistencia. La integración con Jamendo funciona como catálogo online complementario y no reemplaza los datos locales.

## Estructura

```text
ProyectoPOO2026/
├─ backend/                    # API Spring Boot, modelo de dominio, persistencia y audio local
│  ├─ pom.xml
│  └─ src/
├─ frontend/                   # Aplicación React + Vite + Tailwind
│  ├─ public/assets/images/    # Logos e imágenes públicas
│  └─ src/
└─ README.md
```

## Stack Tecnológico

- **Backend:** Java 21 + Spring Boot
- **Base de datos:** PostgreSQL + Spring Data JPA
- **Frontend:** React + Vite + Tailwind CSS
- **UI/animaciones:** Lucide React y Framer Motion
- **Seguridad:** BCrypt para contraseñas + JWT en cookie HttpOnly
- **Contenido local:** archivos `.mp3` servidos desde Spring Boot
- **API externa complementaria:** Jamendo API

## Funcionalidades

- Registro e inicio de sesión de usuarios.
- Verificación de correo y recuperación de contraseña mediante código temporal.
- Catálogo local de canciones y podcasts.
- Catálogo online Jamendo con paginación y carga incremental.
- Reproducción de audio local y audio online de Jamendo.
- Creación de playlists personalizadas.
- Favoritos persistidos como playlist especial del usuario.
- Playlists mixtas con contenido local y referencias externas de Jamendo.
- Historial simple de reproducciones recientes.
- Recomendaciones mixtas basadas en historial, artista y género.
- Buscador global para catálogo local y Jamendo.
- Reproductor personalizado con progreso, volumen, mute y controles de pista.

## Requisitos Académicos Cubiertos

- Herencia: `Cancion` y `Podcast` heredan de `ContenidoAudio`.
- Clase abstracta: `ContenidoAudio`.
- Interfaz propia: `Reproducible`.
- Relaciones entre clases: usuario-playlists, playlists-contenidos, catálogo-contenidos.
- Excepciones personalizadas: usuario duplicado, credenciales inválidas, contenido no encontrado, playlist llena e integración externa.
- Programación funcional: uso de `stream`, `filter`, `map` y `removeIf`.
- Pruebas unitarias con JUnit.
- Tecnologías extra: React/Vite, PostgreSQL e integración Jamendo API.
- Autenticación con JWT en cookie `HttpOnly` para proteger endpoints privados.

## Configuración

La configuración sensible se maneja con variables de entorno. El archivo versionable de referencia es `backend/src/main/resources/application-example.properties`; el archivo local `application.properties` queda ignorado por Git para evitar publicar contraseñas o claves.

```properties
DB_URL=jdbc:postgresql://localhost:5432/postgres
DB_USERNAME=postgres
DB_PASSWORD=postgres
APP_CORS_ALLOWED_ORIGINS=http://127.0.0.1:5173,http://localhost:5173
JWT_SECRET=usar_una_clave_larga_y_privada
JWT_EXPIRATION_SECONDS=86400
AUTH_COOKIE_SECURE=false
AUTH_COOKIE_SAME_SITE=Lax
JAMENDO_CLIENT_ID=
JAMENDO_SEARCH_MAX_RESULTS=30
```

Para usar Jamendo se debe crear una aplicación en el portal de desarrolladores de Jamendo y definir `JAMENDO_CLIENT_ID`. Los resultados online se consultan bajo demanda y no se guardan en PostgreSQL.

## Ejecución

Backend:

```bash
cd backend
mvn spring-boot:run
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

El frontend Vite queda disponible en `http://127.0.0.1:5173` y usa proxy hacia el backend en `http://127.0.0.1:8080`.

## Assets

Los logos e imágenes públicas del frontend están en:

```text
frontend/public/assets/images/
```

Los audios locales del backend están en:

```text
backend/src/main/resources/static/audio/
```

## Demo

Usuarios semilla:

- `admin@ufro.cl` / `1234`
- `test@ufro.cl` / `1234`

El catálogo local se carga automáticamente si la base de datos está vacía. El catálogo Jamendo requiere `JAMENDO_CLIENT_ID`.

## Pruebas y Build

Backend:

```bash
cd backend
mvn test
```

Frontend:

```bash
cd frontend
npm run build
```
