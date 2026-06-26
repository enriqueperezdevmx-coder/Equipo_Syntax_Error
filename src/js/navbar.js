async function cargarNavbar() {
  const res = await fetch('/src/componentes/navbar/navbar.html');
  const html = await res.text();
  document.getElementById('navbar').innerHTML = html;

  const navbar = document.querySelector('.navbar-mt');
  const links  = document.querySelectorAll('.navbar-mt .nav-link');
  const ruta   = window.location.pathname.replace(/\/$/, '') || '/';

  // ── Línea activa según página actual ───────────────────────
  links.forEach(link => {
    const href = (link.getAttribute('href') || '').replace(/\/$/, '');
    if (href && href !== '###' && (ruta === href || ruta.endsWith(href))) {
      link.classList.add('active');
    }
  });

  // ── Navbar opaca al hacer scroll ───────────────────────────
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

cargarNavbar();