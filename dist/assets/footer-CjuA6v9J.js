var e=(e,t)=>()=>(e&&(t=e(e=0)),t),t=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t),e=null),t.exports);(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var n,r=e((()=>{n=`<nav class="navbar navbar-expand-lg navbar-mt">
  <div class="container-fluid">

    <a class="navbar-brand" href="/index.html">
      <img src="/assets/mensajeria.png" alt="Logo">
    </a>

    <div class="d-flex align-items-center gap-3 ms-auto me-3 d-lg-none">
      <a href="/src/pages/cotizar/cotizar.html" class="icono-accion fs-5 text-dark">
        <i class="bi bi-clipboard"></i>
      </a>

      <div class="dropdown">
        <a href="javascript:void(0)" id="icono-login-movil" class="icono-accion fs-5 text-dark" role="button" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
          <i class="bi bi-person-circle"></i>
        </a>
        
        <div class="dropdown-menu dropdown-menu-end p-4 shadow" style="min-width: 260px;">
          <form id="form-login-movil">
            <div class="mb-3">
              <label for="loginEmailMob" class="form-label">Correo electrónico</label>
              <input type="email" class="form-control" id="loginEmailMob" placeholder="correo@ejemplo.com" required>
            </div>
            <div class="mb-3">
              <label for="loginPasswordMob" class="form-label">Contraseña</label>
              <input type="password" class="form-control" id="loginPasswordMob" placeholder="Contraseña" required>
            </div>
            <button type="submit" class="btn btn-success w-100">Iniciar sesión</button>
          </form>
          
          <div class="dropdown-divider my-3"></div>
          
          <div class="text-center">
            <span class="text-muted small">¿No tienes cuenta?</span><br>
            <a href="/src/pages/registro/registro.html" class="btn btn-sm btn-primary mt-2 w-100">Regístrate aquí</a>
          </div>
        </div>
      </div>
    </div>

    <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">

      <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
        <li class="nav-item"><a class="nav-link" href="/index.html">Inicio</a></li>
        <li class="nav-item"><a class="nav-link" href="/src/pages/servicios/servicios.html">Servicios</a></li>
        <li class="nav-item"><a class="nav-link" href="/src/pages/cotizar/cotizar.html">Cotizar envío</a></li>
        <li class="nav-item"><a class="nav-link" href="/src/pages/rastreo/rastreo.html">Rastreo</a></li>
        <li class="nav-item"><a class="nav-link" href="/src/pages/aboutUs.html">Nosotros</a></li>
        <li class="nav-item"><a class="nav-link" href="/src/pages/contacto/contacto.html">Contacto</a></li>
      </ul>

<div class="d-none d-lg-flex align-items-center gap-3 iconos-desktop">

    <!-- Carrito -->
    <a href="/src/pages/carrito/carrito.html"
       class="icono-accion fs-5 text-dark"
       title="Carrito">
        <i class="bi bi-cart3"></i>
    </a>

    <!-- Historial -->
    <a href="/src/pages/historial/historial.html"
       class="icono-accion fs-5 text-dark"
       title="Historial">
        <i class="bi bi-clipboard"></i>
    </a>

    <div class="dropdown">
          <button class="btn btn-outline-success dropdown-toggle rounded-pill px-3" type="button" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
            <i class="bi bi-person-circle me-1"></i> Entrar
          </button>
          
          <div class="dropdown-menu dropdown-menu-end p-4 shadow" style="min-width: 280px;">
            <form id="form-login-escritorio">
              <div class="mb-3">
                <label for="loginEmailDesk" class="form-label">Correo electrónico</label>
                <input type="email" class="form-control" id="loginEmailDesk" placeholder="correo@ejemplo.com" required>
              </div>
              <div class="mb-3">
                <label for="loginPasswordDesk" class="form-label">Contraseña</label>
                <input type="password" class="form-control" id="loginPasswordDesk" placeholder="Contraseña" required>
              </div>
              <button type="submit" class="btn btn-success w-100">Iniciar sesión</button>
            </form>
            
            <div class="dropdown-divider my-3"></div>
            
            <div class="text-center">
              <span class="text-muted small">¿No tienes cuenta?</span><br>
              <a href="/src/pages/registro/registro.html" class="btn btn-sm btn-primary mt-2 w-100">Regístrate aquí</a>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  </div>
</nav>`})),i=t((()=>{r();function e(){let e=document.getElementById(`navbar`);if(!e)return;e.innerHTML=n;let t=document.querySelector(`.navbar-mt`),r=document.querySelectorAll(`.navbar-mt .nav-link`),i=window.location.pathname.replace(/\/$/,``)||`/`;r.length>0&&r.forEach(e=>{let t=(e.getAttribute(`href`)||``).replace(/\/$/,``);t&&t!==`###`&&(i===t||i.endsWith(t))&&e.classList.add(`active`)}),t&&window.addEventListener(`scroll`,()=>{t.classList.toggle(`scrolled`,window.scrollY>20)},{passive:!0})}e()})),a,o=e((()=>{a=`<footer>
  <div class="container">
    <div class="row">
      <!-- Logo -->
      <div class="col-md-3 text-center">
        <img
          src="/assets/logofooter.png"
          alt="Mensajería Total"
          class="footer-logo"
        />
      </div>

      <!-- Nosotros: solo el enlace principal, sin sub-secciones -->
      <div class="col-md-2">
        <p>Nosotros</p>
        <ul>
          <li><a href="/src/pages/aboutUs.html">Nosotros</a></li>
          <li><a href="/src/pages/servicios/servicios.html#faq-section">Preguntas frecuentes</a></li>
        </ul>
      </div>

      <!-- Cotización -->
      <div class="col-md-3">
        <p>Cotización</p>
        <p>Horario de Atención:</p>
        <p>Lunes a Viernes</p>
        <p>9:00 - 18:00</p>
      </div>

      <!-- Contacto -->
      <div class="col-md-3">
        <p>Contacto</p>
        <ul>
          <li>
            <i class="bi bi-envelope"></i>
            <a href="mailto:mtmensajeriat@gmail.com">mtmensajeriat@gmail.com</a>
          </li>
          <li>
            <i class="bi bi-whatsapp"></i>
            <a href="tel:5610724669">5610724669</a>
          </li>
          <li>
            <i class="bi bi-geo-alt"></i>
            <span>CDMX y Área Metropolitana</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Copyright -->
    <div class="mt-4 pt-3 text-center text-muted small">
      2026 &copy; MENSAJERÍA TOTAL S.A. DE C.V.
    </div>
  </div>
</footer>`})),s=t((()=>{o();function e(){let e=document.getElementById(`footer`);e&&(e.innerHTML=a)}e()}));export{e as i,i as n,t as r,s as t};