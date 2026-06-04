// Seleccionamos todos los enlaces con el efecto de ola
const rippleLinks = document.querySelectorAll(".effect-ripple");

rippleLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    // 1. Detenemos temporalmente el salto inmediato del navegador
    e.preventDefault();

    // Guardamos la dirección a la que quiere ir el usuario
    const targetUrl = this.getAttribute("href");

    // 2. Calculamos la posición del clic usando 'this' en lugar de 'e.target'
    //    Esto blinda tu código si el usuario da clic directo en las letras
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 3. Creamos y posicionamos la onda de agua
    const ripple = document.createElement("span");
    ripple.classList.add("ripple-wave");
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    this.appendChild(ripple);

    // 4. Esperamos 300ms a que la animación se despliegue y redirigimos
    setTimeout(() => {
      ripple.remove();

      // Si el enlace tiene una página real, navegamos a ella
      if (targetUrl && targetUrl !== "#") {
        window.location.href = targetUrl;
      }
    }, 300);
  });
});
