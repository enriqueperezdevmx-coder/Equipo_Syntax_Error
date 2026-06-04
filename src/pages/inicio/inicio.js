// Importa todo lo global: Bootstrap, variables.css, navbar y footer
import '/src/main.js';

// Lógica exclusiva de la página de inicio
document.addEventListener('DOMContentLoaded', () => {

  // Seleccionamos todos los enlaces con el efecto de ola
  const rippleLinks = document.querySelectorAll('.effect-ripple');

  rippleLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      // Detenemos el salto inmediato del navegador
      e.preventDefault();

      // Guardamos la dirección a la que quiere ir el usuario
      const targetUrl = this.getAttribute('href');

      // Calculamos la posición del clic relativa al botón
      // Usar 'this' en lugar de 'e.target' blinda el código si el usuario
      // hace clic directo sobre el texto del enlace
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Creamos y posicionamos la onda
      const ripple = document.createElement('span');
      ripple.classList.add('ripple-wave');
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      this.appendChild(ripple);

      // Esperamos a que la animación se despliegue antes de navegar
      setTimeout(() => {
        ripple.remove();

        if (targetUrl && targetUrl !== '#') {
          window.location.href = targetUrl;
        }
      }, 300);
    });
  });

});