// src/js/sesion.js

document.addEventListener("navbarCargado", () => {
  actualizarEstadoSesion();
  engancharFormulariosLogin();
});

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

function manejarLogin(e, idCorreo, idPassword) {
  e.preventDefault();

  const correo = document.getElementById(idCorreo).value.trim().toLowerCase();
  const password = document.getElementById(idPassword).value;

  const usuariosGuardados = JSON.parse(
    localStorage.getItem("usuariosMensajeria") || "[]",
  );

  const usuario = usuariosGuardados.find(
    (u) => u.correo === correo && u.password === password,
  );

  if (!usuario) {
    alert("Correo o contraseña incorrectos.");
    return;
  }

  guardarSesion(usuario);
  window.location.href = "/src/pages/perfil/perfil.html";
}
