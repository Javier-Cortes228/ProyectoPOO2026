# BanduMusic Backend

API Spring Boot de BanduMusic. Contiene dominio POO, controladores REST, persistencia JPA, seguridad JWT y archivos de audio locales.

## Estructura

```text
backend/
├─ pom.xml
├─ src/main/java/cl/ufro/bandumusic/
│  ├─ config/
│  ├─ controller/
│  ├─ dto/
│  ├─ exception/
│  ├─ model/
│  ├─ repository/
│  └─ service/
├─ src/main/resources/
│  ├─ application-example.properties
│  └─ static/audio/
└─ src/test/
```

## Ejecución

```bash
mvn spring-boot:run
```

## Pruebas

```bash
mvn test
```

Para desarrollo local, crea `src/main/resources/application.properties` a partir de `application-example.properties` o define las variables de entorno equivalentes.

Configuracion minima recomendada para PostgreSQL local:

```properties
DB_URL=jdbc:postgresql://localhost:5432/bandumusic
DB_USERNAME=postgres
DB_PASSWORD=tu_password_local
```

La base `bandumusic` debe existir antes de iniciar Spring Boot. Con `spring.jpa.hibernate.ddl-auto=update`, Hibernate crea o actualiza las tablas al arrancar.
