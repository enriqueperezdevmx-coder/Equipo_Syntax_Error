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

  // sesion.js se carga como script clásico (no type="module") en todas las
  // páginas, así que usamos import() dinámico para poder usar el cliente
  // real del backend sin tener que tocar el <script> en 14 HTMLs.
  const { iniciarSesion } = await import("/src/api/servicioUsuario.js");

  try {
    // Pega contra POST /api/auth/login. Si es correcto, ya guarda el JWT
    // en sessionStorage (lo hace iniciarSesion internamente).
    const datos = await iniciarSesion({ correo, password });

    // Guardamos una copia ligera de los datos del usuario para pintar el
    // navbar/perfil sin tener que llamar al backend en cada página.
    guardarSesion({
      nombre: datos.name,
      apellido: datos.lastName,
      correo: datos.email,
      telefono: datos.phone,
    });

    window.location.href = "/src/pages/perfil/perfil.html";
  } catch (error) {
    alert(error.message || "Correo o contraseña incorrectos.");
  }
}