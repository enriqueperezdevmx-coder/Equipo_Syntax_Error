// 1. Importamos el HTML directamente en la compilación
// (Ajusta la cantidad de '../' dependiendo de dónde esté exactamente tu HTML ahora)
import navbarHTML from '../componentes/navbar/navbar.html?raw';
function cargarNavbar() {
  const container = document.getElementById('navbar');
  // Validamos que el contenedor exista en la página para no romper el script
  if (!container) return; 
  
  // Inyectamos el HTML al instante sin peticiones de red
  container.innerHTML = navbarHTML;

  const navbar = document.querySelector('.navbar-mt');
  const links  = document.querySelectorAll('.navbar-mt .nav-link');
  const ruta   = window.location.pathname.replace(/\/$/, '') || '/';

  // ── Línea activa según página actual ───────────────────────
  if (links.length > 0) {
    links.forEach(link => {
      const href = (link.getAttribute('href') || '').replace(/\/$/, '');
      if (href && href !== '###' && (ruta === href || ruta.endsWith(href))) {
        link.classList.add('active');
      }
    });
  }

  // ── Navbar opaca al hacer scroll ───────────────────────────
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }
}

cargarNavbar();