"use strict";

/* ============================================================
   UTILIDADES DE SEGURIDAD
   ============================================================ */

/** Elimina caracteres pegrilosos para XSS */
const limpiar = (s) => String(s).replace(/[<>"'`\\]/g, "").trim().slice(0, 300);

/** Solo dígitos */
const soloNum = (s) => s.replace(/\D/g, "");

/** Validar email */
const emailOk = (e) => /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(e);

/**
 * Algoritmo de Luhn — verifica que el número de tarjeta sea matemáticamente válido.
 * Evita que se envíen números inventados al backend, Me dolio mi cabecita con esto...
 */
const luhn = (num) => {
  const d = soloNum(num);
  if (d.length < 13) return false;
  let sum = 0, par = false;
  for (let i = d.length - 1; i >= 0; i--) {
    let n = +d[i];
    if (par) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
    par = !par;
  }
  return sum % 10 === 0;
};

/** Detecta la marca de la tarjeta por los primeros dígitos */
const detectarBrand = (num) => {
  const d = soloNum(num);
  if (/^4/.test(d))           return { nombre: "Visa",       color: "#1a1f71" };
  if (/^5[1-5]|^2[2-7]/.test(d)) return { nombre: "Mastercard", color: "#eb001b" };
  if (/^3[47]/.test(d))       return { nombre: "Amex",       color: "#007bc1" };
  if (/^6011|^65/.test(d))    return { nombre: "Discover",   color: "#ff6600" };
  return null;
};

/** Genera CLABE de 18 dígitos simulada */
const generarClabe = () => Array.from({length: 18}, () => Math.floor(Math.random()*10)).join("");

/** Formatea CLABE en grupos de 6 */
const fmtClabe = (c) => c.match(/.{1,6}/g)?.join(" ") || c;

/** Genera referencia Oxxo de 18 dígitos con espacios cada 4 */
const generarRefOxxo = () => {
  const nums = Array.from({length: 18}, () => Math.floor(Math.random()*10)).join("");
  return nums.match(/.{1,4}/g)?.join(" ") || nums;
};

/* ============================================================
   CARGAR DATOS DEL ENVÍO DESDE sessionStorage
   ============================================================ */
(function cargarResumen() {
  const raw = sessionStorage.getItem("cotizacion_pendiente");
  if (!raw) return;
  try {
    const c = JSON.parse(raw);
    document.getElementById("resumenFolio").textContent    = c.numCotizacion || "—";
    document.getElementById("resumenServicio").textContent = c.nombreServicio || "—";
    document.getElementById("resumenEnvio").style.display  = "block";
  } catch { /* silencioso shhhh*/ }
})();

/* ============================================================
   SELECTOR DE MÉTODO
   ============================================================ */
const botonesMetodo = document.querySelectorAll(".metodo-btn");
const paneles       = document.querySelectorAll(".panel-pago");

botonesMetodo.forEach(btn => {
  btn.addEventListener("click", () => {
    const metodo = btn.dataset.metodo;
    botonesMetodo.forEach(b => {
      b.classList.toggle("activo", b.dataset.metodo === metodo);
      b.setAttribute("aria-pressed", b.dataset.metodo === metodo);
    });
    paneles.forEach(p => {
      p.classList.toggle("activo", p.id === `panel-${metodo}`);
    });
  });
});

/* ============================================================
   PANEL TARJETA
   ============================================================ */
const elNumTarjeta    = document.getElementById("num-tarjeta");
const elNombreTarjeta = document.getElementById("nombre-tarjeta");
const elFechaVenc     = document.getElementById("fecha-venc");
const elCvv           = document.getElementById("cvv");
const elToggleCvv     = document.getElementById("toggle-cvv");
const elIconoCvv      = document.getElementById("icono-cvv");
const elIconoTarjeta  = document.getElementById("icono-tarjeta");
const elBrandTag      = document.getElementById("brand-tag");
const elAlertaTarjeta = document.getElementById("alerta-tarjeta");
const formTarjeta     = document.getElementById("form-tarjeta");

/* Máscara protectora número de tarjeta — formato XXXX XXXX XXXX XXXX */
elNumTarjeta.addEventListener("input", e => {
  let val = soloNum(e.target.value).slice(0, 16);
  e.target.value = val.match(/.{1,4}/g)?.join(" ") || val;
  const brand = detectarBrand(val);
  if (brand) {
    elBrandTag.textContent     = brand.nombre;
    elBrandTag.style.color     = brand.color;
    elIconoTarjeta.style.color = brand.color;
  } else {
    elBrandTag.textContent     = "";
    elBrandTag.style.color     = "";
    elIconoTarjeta.style.color = "";
  }
});

/* Máscara fecha MM / AA */
elFechaVenc.addEventListener("input", e => {
  let val = soloNum(e.target.value).slice(0, 4);
  if (val.length >= 3) val = val.slice(0, 2) + " / " + val.slice(2);
  e.target.value = val;
});

/* Solo letras en nombre */
elNombreTarjeta.addEventListener("input", e => {
  e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, "");
});

/* Solo dígitos en CVV */
elCvv.addEventListener("input", e => {
  e.target.value = soloNum(e.target.value).slice(0, 4);
});

/* Toggle ver/ocultar CVV */
elToggleCvv.addEventListener("click", () => {
  const mostrar = elCvv.type === "password";
  elCvv.type = mostrar ? "text" : "password";
  elIconoCvv.className = mostrar ? "bi bi-eye-slash" : "bi bi-eye";
  elToggleCvv.setAttribute("aria-label", mostrar ? "Ocultar CVV" : "Mostrar CVV");
});

/* Mostrar error de tarjeta */
const mostrarErrTarjeta = (msg) => {
  elAlertaTarjeta.textContent = msg;
  elAlertaTarjeta.classList.remove("d-none");
};
const ocultarErrTarjeta = () => elAlertaTarjeta.classList.add("d-none");
[elNumTarjeta, elNombreTarjeta, elFechaVenc, elCvv].forEach(el =>
  el.addEventListener("input", ocultarErrTarjeta)
);

/* Submit tarjeta — validaciones de seguridad */
formTarjeta.addEventListener("submit", async e => {
  e.preventDefault();
  ocultarErrTarjeta();

  const num    = limpiar(elNumTarjeta.value);
  const nombre = limpiar(elNombreTarjeta.value);
  const fecha  = limpiar(elFechaVenc.value);
  const cvv    = soloNum(elCvv.value);
  const digitos = soloNum(num);

  // 1. Número de tarjeta — longitud y Luhn
  if (digitos.length < 13 || !luhn(num)) {
    return mostrarErrTarjeta("El número de tarjeta no es válido. Verifica que esté bien escrito.");
  }

  // 2. Nombre
  if (nombre.replace(/\s/g, "").length < 2) {
    return mostrarErrTarjeta("Ingresa el nombre tal como aparece en tu tarjeta.");
  }

  // 3. Fecha — que no esté vencida
  const partes = fecha.replace(/\s/g, "").split("/");
  const mes    = parseInt(partes[0]);
  const anio   = parseInt("20" + (partes[1] || ""));
  const hoy    = new Date();
  const exp    = new Date(anio, mes - 1);
  if (!mes || mes < 1 || mes > 12 || !anio || exp < new Date(hoy.getFullYear(), hoy.getMonth())) {
    return mostrarErrTarjeta("La fecha de vencimiento no es válida o la tarjeta ya expiró.");
  }

  // 4. CVV
  if (cvv.length < 3) {
    return mostrarErrTarjeta("El CVV debe tener al menos 3 dígitos.");
  }
/**
  Todo válido — aquí va nuestra llamada al backend de pagos */
  // const res = await fetch("/api/pagos/tarjeta", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ token: tokenizarTarjeta(num, nombre, fecha, cvv) }),
  // });

  // NUNCA pero nunca de los nuncas guardes datos de tarjeta en localStorage ni sessionStorage
  console.log("[Pago] Datos de tarjeta listos para tokenizar — NO se almacenan localmente.");

  mostrarModalExito("Tu pago con tarjeta fue procesado correctamente.");
});

/* ============================================================
   PANELITO SPEI
   ============================================================ */
document.getElementById("btn-generar-spei").addEventListener("click", () => {
  const alertaSpei = document.getElementById("alerta-spei");
  alertaSpei.classList.add("d-none");

  const correo = limpiar(document.getElementById("spei-correo").value);
  if (!correo || !emailOk(correo)) {
    alertaSpei.textContent = "Ingresa un correo electrónico válido para recibir las instrucciones.";
    alertaSpei.classList.remove("d-none");
    return;
  }

  const clabe = generarClabe();
  document.getElementById("clabe-num").textContent = fmtClabe(clabe);
  document.getElementById("spei-resultado").classList.remove("d-none");

  const btn = document.getElementById("btn-generar-spei");
  btn.innerHTML = '<i class="bi bi-check-lg me-1"></i> CLABE generada';
  btn.disabled = true;

  // Timer 24 horas
  let restante = 24 * 60 * 60;
  const timer = document.getElementById("spei-timer");
  const id = setInterval(() => {
    restante--;
    if (restante <= 0) { clearInterval(id); timer.textContent = "Expirada"; return; }
    const h = String(Math.floor(restante / 3600)).padStart(2, "0");
    const m = String(Math.floor((restante % 3600) / 60)).padStart(2, "0");
    const s = String(restante % 60).padStart(2, "0");
    timer.textContent = `${h}:${m}:${s}`;
  }, 1000);
});

/* Copiar CLABE */
document.getElementById("btn-copiar-clabe").addEventListener("click", async () => {
  const texto = document.getElementById("clabe-num").textContent.replace(/\s/g, "");
  try {
    await navigator.clipboard.writeText(texto);
    const btn = document.getElementById("btn-copiar-clabe");
    btn.innerHTML = '<i class="bi bi-check-lg text-success"></i>';
    setTimeout(() => btn.innerHTML = '<i class="bi bi-copy"></i>', 2000);
  } catch { /* fallback: noop */ }
});

/* ============================================================
   PANELITO MERCADO PAGO
   ============================================================ */
document.getElementById("btn-mp").addEventListener("click", () => {
  // En producción: redirigete a la URL generada por tu backend (init_point de MP)
  // window.location.href = data.init_point;
  mostrarModalExito("Serás redirigido a Mercado Pago para completar tu pago de forma segura.");
});

/* ============================================================
   PANELITO OXXO
   ============================================================ */
document.getElementById("btn-generar-oxxo").addEventListener("click", () => {
  const alertaOxxo = document.getElementById("alerta-oxxo");
  alertaOxxo.classList.add("d-none");

  const nombre = limpiar(document.getElementById("oxxo-nombre").value);
  const correo = limpiar(document.getElementById("oxxo-correo").value);

  if (nombre.replace(/\s/g, "").length < 2) {
    alertaOxxo.textContent = "Ingresa tu nombre completo.";
    alertaOxxo.classList.remove("d-none");
    return;
  }
  if (!correo || !emailOk(correo)) {
    alertaOxxo.textContent = "Ingresa un correo electrónico válido.";
    alertaOxxo.classList.remove("d-none");
    return;
  }

  const ref = generarRefOxxo();
  document.getElementById("oxxo-ref").textContent = ref;

  const vence = new Date();
  vence.setDate(vence.getDate() + 3);
  document.getElementById("oxxo-vence").textContent =
    `Vence el ${vence.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}`;

  document.getElementById("oxxo-voucher").classList.remove("d-none");

  const btn = document.getElementById("btn-generar-oxxo");
  btn.innerHTML = '<i class="bi bi-check-lg me-1"></i> Referencia generada';
  btn.disabled = true;
});

document.getElementById("btn-descargar-oxxo")?.addEventListener("click", () => {
  // En producción: generamos un PDF real del voucher
  alert("Aquí se descargará el PDF del voucher cuando el backend esté listo.");
});

/* ============================================================
   MODALITO DE ÉXITO
   ============================================================ */
function mostrarModalExito(msg) {
  document.getElementById("modal-msg").textContent = msg;
  new bootstrap.Modal(document.getElementById("modal-exito")).show();
}

/* ============================================================
   GUARD: verificar sesión
   Si no hay sesión activa, regresa al historial.
   Si quieres probar pago.html directamente Comenta este bloquecito.
   ============================================================ */
(function verificarSesion() {
  const usuario = sessionStorage.getItem("usuario_email");
  if (!usuario) {
    // En producción descomentamos la siguiente línea:
    // window.location.href = "/src/pages/historial/historial.html";
    console.warn("[Pago] No hay sesión activa. En producción se redirige al historial.");
  }
})();
