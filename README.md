# BanduMusic

<p align="center">
  <img src="frontend/public/logo-bandumusic2.png" alt="App" width="500">
</p>

**Proyecto de Programación Orientada a Objetos (POO) 2026**  
*Universidad de La Frontera, Temuco, Chile*

## Descripción

BanduMusic es una plataforma de música inspirada en Spotify. Permite crear una cuenta, explorar un catálogo local de canciones y podcasts, reproducir audio, marcar favoritos y organizar contenido en playlists personalizadas.

La arquitectura mantiene el catálogo local como núcleo del proyecto para respetar los requisitos de POO y persistencia. La integración externa con Jamendo funciona como catálogo online complementario y no reemplaza los datos locales.

## Integrantes

- Javier Cortés
- Carlos Ramirez

## Stack Tecnológico

- **Backend:** Java 21 + Spring Boot
- **Base de datos:** PostgreSQL + Spring Data JPA
- **Frontend:** React + Vite + Tailwind CSS
- **UI/Animaciones:** Tailwind CSS, Lucide React y Framer Motion
- **Seguridad:** BCrypt para contraseñas + JWT en cookie HttpOnly
- **Contenido local:** archivos `.mp3` servidos desde Spring Boot
- **API externa complementaria:** Jamendo API

## Funcionalidades

- Registro e inicio de sesión de usuarios.
- Verificación de correo y recuperación de contraseña mediante código temporal.
- Catálogo local de canciones y podcasts.
- Catálogo online Jamendo separado del catálogo local, con paginación y carga incremental.
- Reproducción de audio local y audio online de Jamendo.
- Creación de playlists personalizadas.
- Agregado y eliminación de contenido local en playlists.
- Favoritos persistidos como playlist especial del usuario.
- Playlists mixtas con contenido local y referencias externas de Jamendo.
- Historial simple de canciones recientemente reproducidas.
- Recomendaciones mixtas con catalogo local y Jamendo segun artista o genero detectado.
- Buscador global para catalogo local y Jamendo.
- Reproductor personalizado con progreso, volumen, mute y controles de pista.

## Requisitos Académicos Cubiertos

- Herencia: `Cancion` y `Podcast` heredan de `ContenidoAudio`.
- Clase abstracta: `ContenidoAudio`.
- Interfaz propia: `Reproducible`.
- Relaciones entre clases: usuario-playlists, playlists-contenidos, catálogo-contenidos.
- Excepciones personalizadas: usuario duplicado, credenciales inválidas, contenido no encontrado, playlist llena, integración externa.
- Programación funcional: uso de `stream`, `filter`, `map`, `removeIf`.
- Pruebas unitarias con JUnit.
- Tecnologías extra: interfaz gráfica React/Vite, PostgreSQL e integración Jamendo API.
- Autenticación con JWT en cookie `HttpOnly` para proteger endpoints privados.

## Configuración

La configuración sensible se maneja con variables de entorno. El archivo versionable de referencia es `src/main/resources/application-example.properties`; el archivo local `application.properties` queda ignorado por Git para evitar publicar contraseñas o claves.

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

El catálogo online usa paginación con `limit` y `offset`. Jamendo permite pedir hasta 200 resultados por llamada, pero la interfaz carga 30 por página para mantener la aplicación rápida.

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

## Tailwind CSS

El frontend usa Tailwind CSS como sistema principal de estilos. La configuracion esta en `frontend/tailwind.config.js` y define fuentes, colores, radios y sombras del rediseño actual. La utilidad `.glass` se declara en `frontend/src/index.css` y se reutiliza en paneles, sidebar, topbar y reproductor.

Los componentes nuevos deben usar los tokens `background`, `surface`, `primary`, `secondary`, `textMain` y `textSub` para mantener consistencia visual.

🎨 Paleta de colores BanduMusic.
- Color Principal: #3a89ff
- Color Secundario: #22D3EE

## Demo

Usuarios semilla:

- `admin@ufro.cl` / `1234`
- `test@ufro.cl` / `1234`

El catálogo local se carga automáticamente si la base de datos está vacía. El catálogo Jamendo requiere `JAMENDO_CLIENT_ID`.

## Actualizacion de autenticacion y Jamendo

- El registro crea la cuenta y genera un codigo temporal de 6 digitos. La cuenta no puede iniciar sesion hasta verificar el codigo.
- La recuperacion de contraseña genera un codigo temporal independiente, valida intentos y actualiza la contraseña con BCrypt.
- El login guarda el JWT en una cookie segura `HttpOnly`; el frontend no almacena tokens en `localStorage`.
- El cierre de sesion llama al backend para limpiar la cookie de autenticacion.
- `MAIL_ENABLED=false` deja el codigo de verificacion en los logs del backend para desarrollo local. Para envio real se debe configurar SMTP y usar `MAIL_ENABLED=true`.
- Las canciones de Jamendo agregadas a playlists o favoritos se guardan como referencias externas, no como archivos descargados.
- Una misma playlist puede mezclar contenido local (`CANCION`/`PODCAST`) y contenido online (`JAMENDO`).
- El historial registra metadatos basicos de cada reproduccion, tanto local como Jamendo, sin descargar archivos externos.
- Las recomendaciones usan el historial reciente para sugerir contenido local y resultados de Jamendo relacionados por artista o genero. Si Jamendo no esta configurado o no responde, el sistema mantiene recomendaciones locales.

Variables nuevas:

```properties
FRONTEND_BASE_URL=http://127.0.0.1:5173
AUTH_COOKIE_SECURE=false
AUTH_COOKIE_SAME_SITE=Lax
EMAIL_VERIFICATION_EXPIRATION_MINUTES=10
EMAIL_VERIFICATION_MAX_ATTEMPTS=5
PASSWORD_RESET_EXPIRATION_MINUTES=10
PASSWORD_RESET_MAX_ATTEMPTS=5
EMAIL_VALIDATION_DNS_ENABLED=true
EMAIL_VALIDATION_BLOCKED_DOMAINS=example.com,example.org,example.net,test.com,nose.com,mailinator.com,tempmail.com,10minutemail.com
MAIL_ENABLED=false
MAIL_FROM=cuenta-real@proveedor.com
MAIL_HOST=
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_SMTP_AUTH=true
MAIL_SMTP_STARTTLS=true
MAIL_SMTP_CONNECTION_TIMEOUT=5000
MAIL_SMTP_TIMEOUT=5000
MAIL_SMTP_WRITE_TIMEOUT=5000
```

## Correo en produccion

Para envio real de codigos se recomienda usar una cuenta dedicada de envio, no una cuenta personal. Opciones razonables para este proyecto:

- Gmail con verificacion en dos pasos y App Password: simple para demo universitaria.
- Brevo, SendGrid, Mailgun o Amazon SES: mejor para produccion porque entregan credenciales SMTP, reputacion y limites claros.

Ejemplo con Gmail:

```properties
MAIL_ENABLED=true
MAIL_FROM=bandumusic.tuapp@gmail.com
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=bandumusic.tuapp@gmail.com
MAIL_PASSWORD=app_password_de_16_caracteres
MAIL_SMTP_AUTH=true
MAIL_SMTP_STARTTLS=true
```

Las credenciales deben configurarse como variables de entorno del sistema operativo, IntelliJ o servicio de despliegue. No deben subirse a Git ni quedar escritas en `application-example.properties`.

## Pruebas

El proyecto incluye un perfil `test` independiente de PostgreSQL en `src/test/resources/application-test.properties`. Este perfil usa H2 en memoria, desactiva el envio real de correos y desactiva la validacion DNS para que `mvn test` sea reproducible en cualquier equipo.

Ejecutar pruebas backend:

```bash
mvn test
```

Cobertura actual de pruebas:

- Logica POO principal: usuarios, playlists, catalogo, excepciones y BCrypt.
- Playlist mixta con referencia Jamendo.
- Validaciones de nombre de usuario y contraseña.
- Contexto Spring Boot con perfil `test`.
- Integracion de historial y recomendaciones usando H2.

Ejecutar build frontend:

```bash
cd frontend
npm run build
```
