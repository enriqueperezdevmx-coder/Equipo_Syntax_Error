import { iniciarSesion } from '../../api/servicioUsuario.js';

// ---------------------------------------------------------------
// CONSTANTES GLOBALES
// ---------------------------------------------------------------

const limitesPesoPorServicio = {
  Express: 5,
  Exclusivo: 10,
  Extraordinario: 10,
};

// Mapeo de tu <select> al enum ServiceType.java
// ⚠️ AJUSTA estos valores si tu enum ServiceType.java usa otros nombres
const mapaServiceType = {
  Express: "EXPRESS",
  Exclusivo: "EXCLUSIVE",
  Extraordinario: "EXTRAORDINARY",
};

const iconosPorServicio = {
  EXPRESS: "/src/assets/repart1.svg",
  EXCLUSIVE: "/src/assets/repar3.svg",
  EXTRAORDINARY: "/src/assets/repar4.svg",
};

// ⚠️ AJUSTA los textos si tu enum ShipmentStatus usa otros valores
const textoEstatus = {
  CREATED: "Cotización generada — Pendiente de confirmación",
  PICKED_UP: "Recolectado",
  IN_TRANSIT: "En camino",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

document.addEventListener("DOMContentLoaded", () => {
  renderHistorial();
  document.getElementById("form-cotizar").addEventListener("submit", manejarEnvioCotizacion);
  document.getElementById("tipoEnvio").addEventListener("change", actualizarLimitePeso);

  document.getElementById("largo").addEventListener("input", () =>
    marcarCampo("largo", validarDimension("largo", "feedbackLargo"))
  );
  document.getElementById("ancho").addEventListener("input", () =>
    marcarCampo("ancho", validarDimension("ancho", "feedbackAncho"))
  );
  document.getElementById("alto").addEventListener("input", () =>
    marcarCampo("alto", validarDimension("alto", "feedbackAlto"))
  );
  document.getElementById("peso").addEventListener("input", () =>
    marcarCampo("peso", validarPeso(document.getElementById("tipoEnvio").value, document.getElementById("peso").value))
  );

  document.getElementById("cpOrigen").addEventListener("blur", () => {
    autocompletarPorCP("cpOrigen", "estadoOrigen", "coloniaOrigen");
  });
  document.getElementById("cpDestino").addEventListener("blur", () => {
    autocompletarPorCP("cpDestino", "estadoDestino", "coloniaDestino");
  });

  document.getElementById("modalCotizar").addEventListener("hidden.bs.modal", () => {
    document.getElementById("contenedor-alertas").innerHTML = "";
    limpiarValidacionVisual();
    renderHistorial();
  });

  inicializarLoginNavbar();
});

// ---------------------------------------------------------------
// SESIÓN (lee lo que guarda sesion.js en localStorage)
// ---------------------------------------------------------------

function obtenerSesionActual() {
  const data = localStorage.getItem("sesionActiva");
  return data ? JSON.parse(data) : null;
}

// ---------------------------------------------------------------
// RENDER DEL HISTORIAL (ahora viene del backend, no de localStorage)
// ---------------------------------------------------------------

async function renderHistorial() {
  const contenedor = document.getElementById("contenedor-historial");
  const sesion = obtenerSesionActual();

  if (!sesion || !sesion.id) {
    contenedor.innerHTML = `
      <div class="col-12 text-center py-5">
        <p class="fs-5 mensaje-vacio">Inicia sesión para ver tu historial.</p>
      </div>
    `;
    return;
  }

  let historialPedidos = [];
  try {
    const token = sessionStorage.getItem("jwt_token");
    const response = await fetch(`/api/shipments/user/${sesion.id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (response.ok) {
      historialPedidos = await response.json();
    }
  } catch (error) {
    console.error("No se pudo cargar el historial:", error);
  }

  if (historialPedidos.length === 0) {
    contenedor.innerHTML = `
      <div class="col-12 text-center py-5">
        <p class="fs-5 mensaje-vacio">Aún no tienes servicios solicitados.</p>
      </div>
    `;
    return;
  }

  contenedor.innerHTML = "";
  const columnaPrincipal = document.createElement("div");
  columnaPrincipal.className = "col-12 px-4 px-md-5";

  historialPedidos.forEach((pedido, index) => {
    const fecha = new Date(pedido.createdAt).toLocaleDateString("es-MX");
    const tarjetaPedidoHTML = `
      <div class="row align-items-center py-4 mb-3 border-bottom text-center text-md-start fila-pedido">
        <div class="col-12 col-md-2 mb-3 mb-md-0 d-flex justify-content-center">
          <img src="${iconosPorServicio[pedido.serviceType] || ""}" alt="${pedido.serviceType}" class="img-fluid imagen-servicio">
        </div>
        <div class="col-12 col-md-6 mb-3 mb-md-0 text-secondary info-pedido">
          <h3 class="h6 fw-bold text-dark mb-1 nombre-servicio">${pedido.serviceType}</h3>
          <p class="mb-1">Paquete: ${pedido.weight} kg | Dimensiones: ${pedido.length}x${pedido.width}x${pedido.height} cm</p>
          <p class="mb-1">Fecha: ${fecha}</p>
          <p class="mb-1">Estatus: <span class="fw-bold text-dark">${textoEstatus[pedido.status] || pedido.status}</span></p>
          <p class="mb-0">No. de Guía:
            <a href="#" class="text-dark fw-bold text-decoration-underline" onclick="copiarFolio(event, '${pedido.trackingNumber}')">
              ${pedido.trackingNumber} (Clic para copiar)
            </a>
          </p>
        </div>
        <div class="col-12 col-md-4 d-flex flex-column flex-sm-row justify-content-md-end align-items-center gap-3">
          <button class="btn px-4 text-white rounded-3 fw-medium boton-ver" onclick="verCotizacion(${index})">Ver</button>
        </div>
      </div>
    `;
    columnaPrincipal.innerHTML += tarjetaPedidoHTML;
  });

  contenedor.appendChild(columnaPrincipal);
  window._historialActual = historialPedidos;
}

// ---------------------------------------------------------------
// AUTOCOMPLETADO DE CÓDIGO POSTAL (API Zippopotam)
// ---------------------------------------------------------------

async function autocompletarPorCP(idCP, idEstado, idColonia) {
  const inputCP = document.getElementById(idCP);
  const inputEstado = document.getElementById(idEstado);
  const inputColonia = document.getElementById(idColonia);

  const cp = inputCP.value.trim();
  const regexCP = /^\d{5}$/;

  if (!regexCP.test(cp)) {
    inputEstado.value = "";
    inputColonia.value = "";
    return;
  }

  inputEstado.value = "Buscando...";
  inputColonia.value = "Buscando...";

  try {
    const response = await fetch(`https://api.zippopotam.us/mx/${cp}`);

    if (!response.ok) {
      inputEstado.value = "";
      inputColonia.value = "No encontrado";
      return;
    }

    const datos = await response.json();
    const primerLugar = datos.places[0];
    inputEstado.value = primerLugar.state;
    inputColonia.value = primerLugar["place name"];
  } catch (error) {
    console.error("No se pudo consultar el código postal:", error);
    inputEstado.value = "";
    inputColonia.value = "Error al buscar";
  }
}

function actualizarLimitePeso() {
  const tipoEnvio = document.getElementById("tipoEnvio").value;
  const inputPeso = document.getElementById("peso");
  const feedbackPeso = document.getElementById("feedbackPeso");

  const limite = limitesPesoPorServicio[tipoEnvio];

  if (limite) {
    inputPeso.max = limite;
    feedbackPeso.textContent = `El peso máximo para ${tipoEnvio} es de ${limite} kg.`;
  } else {
    inputPeso.removeAttribute("max");
    feedbackPeso.textContent = "Ingresa un peso válido mayor a 0.";
  }

  if (inputPeso.value && limite && Number(inputPeso.value) > limite) {
    marcarCampo("peso", false);
  }

  const hayTipo = tipoEnvio !== "";
  document.querySelectorAll("#form-cotizar input, #form-cotizar textarea").forEach((campo) => {
    campo.disabled = !hayTipo;
  });
  document.querySelector("#form-cotizar button[type='submit']").disabled = !hayTipo;
}

function validarPeso(tipoEnvio, peso) {
  if (peso === "" || Number(peso) <= 0) return false;
  const limite = limitesPesoPorServicio[tipoEnvio];
  if (limite && Number(peso) > limite) return false;
  return true;
}

// ---------------------------------------------------------------
// VALIDACIÓN POR CAMPO
// ---------------------------------------------------------------

function marcarCampo(idCampo, esValido) {
  const campo = document.getElementById(idCampo);
  if (esValido) {
    campo.classList.remove("is-invalid");
    campo.classList.add("is-valid");
  } else {
    campo.classList.remove("is-valid");
    campo.classList.add("is-invalid");
  }
  return esValido;
}

function limpiarValidacionVisual() {
  const campos = document.querySelectorAll("#form-cotizar .is-valid, #form-cotizar .is-invalid");
  campos.forEach((campo) => campo.classList.remove("is-valid", "is-invalid"));
  document.getElementById("form-cotizar").classList.remove("was-validated");
}

function validarDimension(id, idFeedback) {
  const input = document.getElementById(id);
  const feedback = document.getElementById(idFeedback);
  const valor = parseFloat(input.value);

  if (input.value.trim() === "") {
    feedback.textContent = "Este campo es requerido.";
    return false;
  }
  if (isNaN(valor) || valor <= 0) {
    feedback.textContent = "Debe ser un número mayor a 0.";
    return false;
  }
  if (valor > 40) {
    feedback.textContent = "La medida debe ser menor a 40 cm.";
    return false;
  }
  return true;
}

// ---------------------------------------------------------------
// ENVÍO DEL FORMULARIO → CONECTA AL BACKEND (aquí está lo que pediste)
// ---------------------------------------------------------------

async function manejarEnvioCotizacion(evento) {
  evento.preventDefault();

  const tipoEnvio = document.getElementById("tipoEnvio").value;
  const cpOrigen = document.getElementById("cpOrigen").value.trim();
  const calleOrigen = document.getElementById("calleOrigen").value.trim();
  const estadoOrigen = document.getElementById("estadoOrigen").value.trim();
  const coloniaOrigen = document.getElementById("coloniaOrigen").value.trim();
  const cpDestino = document.getElementById("cpDestino").value.trim();
  const calleDestino = document.getElementById("calleDestino").value.trim();
  const estadoDestino = document.getElementById("estadoDestino").value.trim();
  const coloniaDestino = document.getElementById("coloniaDestino").value.trim();
  const nombreRemitente = document.getElementById("nombreRemitente").value.trim();
  const nombreDestinatario = document.getElementById("nombreDestinatario").value.trim();
  const telefonoRemitente = document.getElementById("telefonoRemitente").value.trim();
  const telefonoDestinatario = document.getElementById("telefonoDestinatario").value.trim();
  const correoRemitente = document.getElementById("correoRemitente").value.trim();
  const peso = document.getElementById("peso").value;
  const largo = document.getElementById("largo").value;
  const ancho = document.getElementById("ancho").value;
  const alto = document.getElementById("alto").value;
  const descripcionContenido = document.getElementById("descripcionContenido").value.trim();

  const regexCP = /^\d{5}$/;
  const regexTelefono = /^\d{10}$/;
  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const formularioValido =
    marcarCampo("tipoEnvio", tipoEnvio !== "") &&
    marcarCampo("cpOrigen", regexCP.test(cpOrigen)) &&
    marcarCampo("calleOrigen", calleOrigen.length >= 5) &&
    marcarCampo("cpDestino", regexCP.test(cpDestino)) &&
    marcarCampo("calleDestino", calleDestino.length >= 5) &&
    marcarCampo("nombreRemitente", nombreRemitente.length >= 3) &&
    marcarCampo("nombreDestinatario", nombreDestinatario.length >= 3) &&
    marcarCampo("telefonoRemitente", regexTelefono.test(telefonoRemitente)) &&
    marcarCampo("telefonoDestinatario", regexTelefono.test(telefonoDestinatario)) &&
    marcarCampo("correoRemitente", regexCorreo.test(correoRemitente)) &&
    marcarCampo("peso", validarPeso(tipoEnvio, peso)) &&
    marcarCampo("largo", validarDimension("largo", "feedbackLargo")) &&
    marcarCampo("ancho", validarDimension("ancho", "feedbackAncho")) &&
    marcarCampo("alto", validarDimension("alto", "feedbackAlto")) &&
    marcarCampo("descripcionContenido", descripcionContenido.length >= 10);

  const contenedorAlertas = document.getElementById("contenedor-alertas");
  evento.target.classList.add("was-validated");

  if (!formularioValido) {
    contenedorAlertas.innerHTML = `
      <div class="alert alert-danger" role="alert">
        Hay campos por corregir. Revisa los que están marcados en rojo.
      </div>
    `;
    return;
  }

  const sesion = obtenerSesionActual();
  if (!sesion || !sesion.id) {
    contenedorAlertas.innerHTML = `
      <div class="alert alert-warning" role="alert">
        Debes iniciar sesión para generar un envío.
      </div>
    `;
    return;
  }

  const payload = {
    senderId: sesion.id,
    originAddress: `${calleOrigen}, ${coloniaOrigen}, ${estadoOrigen}, CP ${cpOrigen}`,
    destinationAddress: `${calleDestino}, ${coloniaDestino}, ${estadoDestino}, CP ${cpDestino}`,
    senderName: nombreRemitente,
    senderPhone: telefonoRemitente,
    recipientName: nombreDestinatario,
    recipientPhone: telefonoDestinatario,
    receiverName: nombreDestinatario,
    receiverPhone: telefonoDestinatario,
    packageDescription: descripcionContenido,
    weight: parseFloat(peso),
    length: parseFloat(largo),
    width: parseFloat(ancho),
    height: parseFloat(alto),
    serviceType: mapaServiceType[tipoEnvio],
  };

  const btnSubmit = evento.target.querySelector('button[type="submit"]');
  const textoOriginalBtn = btnSubmit.textContent;
  btnSubmit.disabled = true;
  btnSubmit.textContent = "Generando...";

  try {
    const token = sessionStorage.getItem("jwt_token");

    const response = await fetch(`/api/shipments/${sesion.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      throw new Error(errorBody?.message || `Error del servidor (${response.status})`);
    }

    const envioCreado = await response.json();

    evento.target.reset();
    limpiarValidacionVisual();

    const modalCotizar = bootstrap.Modal.getInstance(document.getElementById("modalCotizar"));
    if (modalCotizar) modalCotizar.hide();

    contenedorAlertas.innerHTML = `
      <div class="alert alert-success" role="alert">
        ¡Envío generado! Guía: ${envioCreado.trackingNumber}
      </div>
    `;

    renderHistorial();

  } catch (error) {
    console.error("Error al crear el envío:", error);
    contenedorAlertas.innerHTML = `
      <div class="alert alert-danger" role="alert">
        No se pudo generar el envío: ${error.message}
      </div>
    `;
  } finally {
    btnSubmit.disabled = false;
    btnSubmit.textContent = textoOriginalBtn;
  }
}

// ---------------------------------------------------------------
// LOGIN DEL NAVBAR (móvil)
// ---------------------------------------------------------------

function inicializarLoginNavbar() {
  const formLogin = document.getElementById("form-login-movil");
  if (!formLogin) return;

  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailInput = document.getElementById("loginEmailMob");
    const passInput = document.getElementById("loginPasswordMob");
    const btnSubmit = formLogin.querySelector("button[type='submit']");

    const correo = String(emailInput.value).replace(/[<>"'`]/g, "").trim();
    const contrasena = String(passInput.value).replace(/[<>"'`]/g, "").trim();

    const regexEmail = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

    if (!regexEmail.test(correo)) {
      emailInput.classList.add("is-invalid");
      emailInput.focus();
      return;
    }
    emailInput.classList.remove("is-invalid");

    if (contrasena.length < 6) {
      passInput.classList.add("is-invalid");
      passInput.focus();
      return;
    }
    passInput.classList.remove("is-invalid");

    const textoOriginal = btnSubmit.textContent;
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status"></span>Verificando...`;

    try {
      const datos = await iniciarSesion({ correo, password: contrasena });

      // ⚠️ Esta parte depende de cómo venga la respuesta real del backend.
      // Por ahora asume que viene anidada en "user". Si tu backend regresa
      // los datos planos (datos.id, datos.name...) en vez de (datos.user.id...),
      // cambia la línea de abajo por: const usuarioBackend = datos;
      const usuarioBackend = datos.user || datos;

      localStorage.setItem(
        "sesionActiva",
        JSON.stringify({
          id: usuarioBackend.id,
          nombre: usuarioBackend.name,
          apellido: usuarioBackend.lastName,
          correo: usuarioBackend.email,
          telefono: usuarioBackend.phone,
        })
      );

      window.location.href = "/index.html";

    } catch (error) {
      btnSubmit.disabled = false;
      btnSubmit.textContent = textoOriginal;

      let errorDiv = formLogin.querySelector(".error-login-navbar");
      if (!errorDiv) {
        errorDiv = document.createElement("div");
        errorDiv.className = "alert alert-danger py-1 small mt-2 error-login-navbar";
        formLogin.prepend(errorDiv);
      }
      errorDiv.textContent = error.message || "Correo o contraseña incorrectos.";
    }
  });

  document.getElementById("loginEmailMob")?.addEventListener("input", (e) => {
    e.target.classList.remove("is-invalid");
    formLogin.querySelector(".error-login-navbar")?.remove();
  });
  document.getElementById("loginPasswordMob")?.addEventListener("input", (e) => {
    e.target.classList.remove("is-invalid");
  });
}

// ---------------------------------------------------------------
// VER DETALLE DE UN PEDIDO
// ---------------------------------------------------------------

window.verCotizacion = function (index) {
  const pedido = window._historialActual[index];
  if (!pedido) return;

  const cuerpoModal = document.getElementById("cuerpoModalVer");
  cuerpoModal.innerHTML = `
    <p><strong>Servicio:</strong> ${pedido.serviceType}</p>
    <p><strong>No. de Guía:</strong> ${pedido.trackingNumber}</p>
    <p><strong>Fecha:</strong> ${new Date(pedido.createdAt).toLocaleDateString("es-MX")}</p>
    <p><strong>Estatus:</strong> ${textoEstatus[pedido.status] || pedido.status}</p>
    <p><strong>Paquete:</strong> ${pedido.weight} kg | Dimensiones: ${pedido.length}x${pedido.width}x${pedido.height} cm</p>
    <hr>
    <p><strong>Origen:</strong> ${pedido.originAddress}</p>
    <p><strong>Destino:</strong> ${pedido.destinationAddress}</p>
    <hr>
    <p><strong>Remitente:</strong> ${pedido.senderName} | Tel. ${pedido.senderPhone}</p>
    <p><strong>Destinatario:</strong> ${pedido.recipientName} | Tel. ${pedido.recipientPhone}</p>
    <hr>
    <p><strong>Descripción del contenido:</strong> ${pedido.packageDescription}</p>
  `;

  const modalVer = new bootstrap.Modal(document.getElementById("modalVerCotizacion"));
  modalVer.show();
};

window.copiarFolio = function (event, folio) {
  event.preventDefault();
  navigator.clipboard
    .writeText(folio)
    .then(() => {
      alert(`Guía ${folio} copiada al portapapeles.`);
    })
    .catch((err) => {
      console.error("No se pudo copiar el texto automáticamente: ", err);
    });
};