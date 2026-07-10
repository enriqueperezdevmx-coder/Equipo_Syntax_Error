const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/servicioUsuario-BDO4U0RE.js","assets/modulepreload-polyfill-CwuZNuQA.js"])))=>i.map(i=>d[i]);
import{t as e}from"./modulepreload-polyfill-CwuZNuQA.js";/* empty css               */import{n as t,t as n}from"./preload-helper-Ccj32IGe.js";var r=e((()=>{async function e(){let e=await(await fetch(`/src/componentes/navbar/navbar.html`)).text();document.getElementById(`navbar`).innerHTML=e;let t=window.location.pathname.replace(/\/$/,``)||`/`;document.querySelectorAll(`.nav-link, .icono-accion`).forEach(e=>{let n=(e.getAttribute(`href`)||``).replace(/\/$/,``);n&&n!==`###`&&n!==`javascript:void(0)`&&(t===n||t.endsWith(n))&&e.classList.add(`active`)}),document.dispatchEvent(new CustomEvent(`navbarCargado`))}e()})),i=e((()=>{t();function e(){window.sesionInicializada||(window.sesionInicializada=!0,o(),s())}document.addEventListener(`navbarCargado`,e),(document.getElementById(`form-login-escritorio`)||document.getElementById(`form-login-movil`))&&e();function r(){let e=localStorage.getItem(`sesionActiva`);return e?JSON.parse(e):null}function i(e){localStorage.setItem(`sesionActiva`,JSON.stringify({nombre:e.nombre,apellido:e.apellido,correo:e.correo,telefono:e.telefono}))}function a(){localStorage.removeItem(`sesionActiva`),sessionStorage.removeItem(`jwt_token`),window.location.href=`/index.html`}function o(){let e=r();if(!e)return;let t=document.querySelector(`.iconos-desktop .dropdown`);if(t){let n=t.querySelector(`button.dropdown-toggle`),r=t.querySelector(`.dropdown-menu`);n.innerHTML=`<i class="bi bi-person-circle me-1"></i> ${e.nombre}`,r.innerHTML=`
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
    `,document.getElementById(`btn-cerrar-sesion-desk`)?.addEventListener(`click`,a)}let n=document.getElementById(`icono-login-movil`);if(n){let t=n.parentElement.querySelector(`.dropdown-menu`);t.innerHTML=`
      <p class="fw-bold mb-3">${e.nombre} ${e.apellido}</p>
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
    `,document.getElementById(`btn-cerrar-sesion-mob`)?.addEventListener(`click`,a)}}function s(){let e=document.getElementById(`form-login-escritorio`),t=document.getElementById(`form-login-movil`);e?.addEventListener(`submit`,e=>c(e,`loginEmailDesk`,`loginPasswordDesk`)),t?.addEventListener(`submit`,e=>c(e,`loginEmailMob`,`loginPasswordMob`))}async function c(e,t,r){e.preventDefault();let a=document.getElementById(t).value.trim().toLowerCase(),o=document.getElementById(r).value,{iniciarSesion:s}=await n(async()=>{let{iniciarSesion:e}=await import(`./servicioUsuario-BDO4U0RE.js`).then(e=>(e.n(),e.i));return{iniciarSesion:e}},__vite__mapDeps([0,1]));try{let e=(await s({correo:a,password:o})).user;i({nombre:e.name,apellido:e.lastName,correo:e.email,telefono:e.phone}),window.location.href=`/index.html`}catch(e){alert(e.message||`Correo o contraseña incorrectos.`)}}})),a=e((()=>{async function e(){let e=await(await fetch(`/src/componentes/navbar/footer.html`)).text();document.getElementById(`footer`).innerHTML=e}e()})),o=e((()=>{}));r(),i(),a(),o();