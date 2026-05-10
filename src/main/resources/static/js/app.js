async function registrarUsuario() {
    const nombre = document.getElementById('reg-nombre').value;
    const correo = document.getElementById('reg-correo').value;
    const contrasena = document.getElementById('reg-contrasena').value;
    const mensajeEl = document.getElementById('reg-mensaje');

    if (!nombre || !correo || !contrasena) {
        mensajeEl.textContent = "Por favor, completa todos los campos.";
        mensajeEl.style.color = "red";
        return;
    }

    const usuario = {
        nombreUsuario: nombre,
        correo: correo,
        contrasena: contrasena
    };

    try {
        const respuesta = await fetch('/api/usuarios/registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        });

        if (respuesta.ok) {
            mensajeEl.textContent = "¡Cuenta creada con éxito! Ya puedes iniciar sesión.";
            mensajeEl.style.color = "green";
        } else {
            const error = await respuesta.json();
            mensajeEl.textContent = "Error: " + (error.message || "No se pudo registrar.");
            mensajeEl.style.color = "red";
        }
    } catch (error) {
        mensajeEl.textContent = "Error de conexión con el servidor.";
        mensajeEl.style.color = "red";
    }
}

async function iniciarSesion() {
    const correo = document.getElementById('login-correo').value;
    const contrasena = document.getElementById('login-contrasena').value;
    const mensajeEl = document.getElementById('login-mensaje');

    if (!correo || !contrasena) {
        mensajeEl.textContent = "Ingresa tu correo y contraseña.";
        mensajeEl.style.color = "red";
        return;
    }

    const credenciales = {
        correo: correo,
        contrasena: contrasena
    };

    try {
        const respuesta = await fetch('/api/usuarios/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credenciales)
        });

        if (respuesta.ok) {
            const usuarioLogueado = await respuesta.json();
            mensajeEl.textContent = "¡Bienvenido, " + usuarioLogueado.nombreUsuario + "!";
            mensajeEl.style.color = "green";
        } else {
            mensajeEl.textContent = "Credenciales incorrectas.";
            mensajeEl.style.color = "red";
        }
    } catch (error) {
        mensajeEl.textContent = "Error de conexión con el servidor.";
        mensajeEl.style.color = "red";
    }
}