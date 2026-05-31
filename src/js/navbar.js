async function cargarNavbar() {
  const res = await fetch("/src/componentes/navbar/navbar.html");
  const html = await res.text();
  document.getElementById("navbar").innerHTML = html;
}

cargarNavbar();

document.addEventListener("DOMContentLoaded", () => {
  // 1. Obtener la URL exacta que está en la barra de direcciones
  const currentUrl = window.location.href;

  // 2. Seleccionar todos tus enlaces de navegación
  const navLinks = document.querySelectorAll(".navbar-mt .nav-link");

  navLinks.forEach((link) => {
    // 3. Validar si la URL del enlace coincide con la URL actual del navegador
    if (link.href === currentUrl) {
      // Remueve el 'active' que viene por defecto en el HTML (usualmente en Inicio)
      document
        .querySelector(".navbar-mt .nav-link.active")
        ?.classList.remove("active");

      // Añade la clase activa al enlace correcto
      link.classList.add("active");
    }
  });
});
