// src/js/sesion.js

// --- Inicialización segura ---
function inicializarModuloSesion() {
  // Evitamos enganchar los eventos más de una vez si se llama doble
  if (window.sesionInicializada) return; 
  window.sesionInicializada = true;

  actualizarEstadoSesion();
  engancharFormulariosLogin();
}

// CASO A: Escuchamos el evento por si el navbar se carga DESPUÉS de este script
document.addEventListener("navbarCargado", inicializarModuloSesion);

// CASO B: Por si acaso el navbar ya se cargó ANTES de que este script se ejecutara
if (document.getElementById("form-login-escritorio") || document.getElementById("form-login-movil")) {
  inicializarModuloSesion();
}

// --- Manejo de la sesión en localStorage ---

function obtenerSesion() {
  const data = localStorage.getItem("sesionActiva");
  return data ? JSON.parse(data) : null;
}

function guardarSesion(usuario) {
  localStorage.setItem(
    "sesionActiva",
    JSON.stringify({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      telefono: usuario.telefono,
    }),
  );
}

function cerrarSesion() {
  localStorage.removeItem("sesionActiva");
  sessionStorage.removeItem("jwt_token"); // token guardado por iniciarSesion()
  window.location.href = "/index.html";
}

// --- Actualizar visualmente el botón "Entrar" ---

function actualizarEstadoSesion() {
  const sesion = obtenerSesion();
  if (!sesion) return; // no hay sesión, el botón se queda como "Entrar"

  // Versión escritorio
  const dropdownDesktop = document.querySelector(".iconos-desktop .dropdown");
  if (dropdownDesktop) {
    const boton = dropdownDesktop.querySelector("button.dropdown-toggle");
    const menu = dropdownDesktop.querySelector(".dropdown-menu");

    boton.innerHTML = `<i class="bi bi-person-circle me-1"></i> ${sesion.nombre}`;

    menu.innerHTML = `
      <a href="/src/pages/perfil/perfil.html" class="dropdown-item">
        <i class="bi bi-person me-2"></i>Mi perfil
      </a>
      <a href="/src/pages/historial/historial.html" class="dropdown-item">
        <i class="bi bi-clock-history me-2"></i>Mis pedidos
      </a>
      <div class="dropdown-divider"></div>
      <button type="button" id="btn-cerrar-sesion-desk" class="dropdown-item text-danger">
        <i class="bi bi-box-arrow-right me-2"></i>Cerrar sesión
      </button>
    `;

    document
      .getElementById("btn-cerrar-sesion-desk")
      ?.addEventListener("click", cerrarSesion);
  }

  // Versión móvil
  const iconoMovil = document.getElementById("icono-login-movil");
  if (iconoMovil) {
    const menuMovil = iconoMovil.parentElement.querySelector(".dropdown-menu");
    menuMovil.innerHTML = `
      <p class="fw-bold mb-3">${sesion.nombre} ${sesion.apellido}</p>
      <a href="/src/pages/perfil/perfil.html" class="dropdown-item">
        <i class="bi bi-person me-2"></i>Mi perfil
      </a>
      <a href="/src/pages/historial/historial.html" class="dropdown-item">
        <i class="bi bi-clock-history me-2"></i>Mis pedidos
      </a>
      <div class="dropdown-divider"></div>
      <button type="button" id="btn-cerrar-sesion-mob" class="dropdown-item text-danger">
        <i class="bi bi-box-arrow-right me-2"></i>Cerrar sesión
      </button>
    `;

    document
      .getElementById("btn-cerrar-sesion-mob")
      ?.addEventListener("click", cerrarSesion);
  }
}

// --- Enganchar los formularios de login ---

function engancharFormulariosLogin() {
  const formDesk = document.getElementById("form-login-escritorio");
  const formMob = document.getElementById("form-login-movil");

  formDesk?.addEventListener("submit", (e) =>
    manejarLogin(e, "loginEmailDesk", "loginPasswordDesk"),
  );
  formMob?.addEventListener("submit", (e) =>
    manejarLogin(e, "loginEmailMob", "loginPasswordMob"),
  );
}

async function manejarLogin(e, idCorreo, idPassword) {
  e.preventDefault();

  const correo = document.getElementById(idCorreo).value.trim().toLowerCase();
  const password = document.getElementById(idPassword).value;

  const { iniciarSesion } = await import("../api/servicioUsuario.js");
  try {
    // AQUÍ ESTÁ LA MAGIA: Le decimos que mande "email" con el valor de "correo"
  const datos = await iniciarSesion({ correo, password });
    // 1. Accedemos al objeto 'user' de tu LoginResponse
    const usuarioBackend = datos.user;

    // 2. Mapeamos las variables en inglés de tu UserResponse a lo que tu localStorage espera
    guardarSesion({
      nombre: usuarioBackend.name,
      apellido: usuarioBackend.lastName,
      correo: usuarioBackend.email,
      telefono: usuarioBackend.phone, // ¡Tu UserResponse en Java usa "phone", así que esto está perfecto!
    });

    // 3. Redirección triunfal a inicio 🚀
    window.location.href = "/index.html";
    
  } catch (error) {
    alert(error.message || "Correo o contraseña incorrectos.");
  }
}