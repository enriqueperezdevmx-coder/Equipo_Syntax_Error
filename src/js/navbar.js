async function cargarNavbar() {
  const res = await fetch("/src/componentes/navbar/navbar.html");
  const html = await res.text();
  document.getElementById("navbar").innerHTML = html;
}

document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".navbar-mt .nav-link");
  const menuColapsable = document.querySelector(".navbar-collapse");

  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      // Cambiar la clase activa
      document
        .querySelector(".navbar-mt .nav-link.active")
        ?.classList.remove("active");
      this.classList.add("active");

      // Cierre automático del menú en móvil si está desplegado
      if (menuColapsable && menuColapsable.classList.contains("show")) {
        // Si usas Bootstrap 5 nativo por JS:
        const bootstrapMenu = bootstrap.Collapse.getInstance(menuColapsable);
        bootstrapMenu?.hide();
      }
    });
  });
});

cargarNavbar();
