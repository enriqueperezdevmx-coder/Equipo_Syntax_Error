async function cargarNavbar() {
  const res = await fetch("/src/componentes/navbar/navbar.html");
  const html = await res.text();
  document.getElementById("navbar").innerHTML = html;

  const ruta = window.location.pathname.replace(/\/$/, "") || "/";

  // Seleccionamos TODOS los elementos que pueden ser "activos"
  const elementosNav = document.querySelectorAll(".nav-link, .icono-accion");

  elementosNav.forEach((el) => {
    const href = (el.getAttribute("href") || "").replace(/\/$/, "");

    // Si la ruta coincide, aplicamos la clase active
    if (
      href &&
      href !== "###" &&
      href !== "javascript:void(0)" &&
      (ruta === href || ruta.endsWith(href))
    ) {
      el.classList.add("active");
    }
  });

  // ... (tu lógica de scroll)
}
cargarNavbar();
