import { iniciarSesion } from '../../api/servicioUsuario.js';

// ---------------------------------------------------------------
// CONSTANTES GLOBALES
// ---------------------------------------------------------------

// Límite máximo de peso (kg) permitido por cada tipo de servicio
const limitesPesoPorServicio = {
  Express: 5,
  Exclusivo: 10,
  Extraordinario: 10,
};

document.addEventListener("DOMContentLoaded", () => {
  renderHistorial();
  document.getElementById("form-cotizar").addEventListener("submit", manejarEnvioCotizacion);
  document.getElementById("tipoEnvio").addEventListener("change", actualizarLimitePeso);

  // Valide mientras el usuario escribe, para dar feedback visual inmediato de qué campos están correctos o incorrectos
document.getElementById("largo").addEventListener("input", () =>
  marcarCampo("largo", validarDimension("largo", "feedbackLargo"))
);
document.getElementById("ancho").addEventListener("input", () =>
  marcarCampo("ancho", validarDimension("ancho", "feedbackAncho"))
);
document.getElementById("alto").addEventListener("input", () =>
  marcarCampo("alto", validarDimension("alto", "feedbackAlto"))
);
  document.getElementById("peso").addEventListener("input", () => marcarCampo("peso", validarPeso(document.getElementById("tipoEnvio").value, document.getElementById("peso").value)));

  // Autocompletado de Estado/Colonia al escribir el CP de origen y destino
  document.getElementById("cpOrigen").addEventListener("blur", () => {
    autocompletarPorCP("cpOrigen", "estadoOrigen", "coloniaOrigen");
  });
  document.getElementById("cpDestino").addEventListener("blur", () => {
    autocompletarPorCP("cpDestino", "estadoDestino", "coloniaDestino");
  });

  // Solo cuando el modal terminó de cerrarse del todo, redibujamos el historial
  document.getElementById("modalCotizar").addEventListener("hidden.bs.modal", () => {
    document.getElementById("contenedor-alertas").innerHTML = "";
    limpiarValidacionVisual();
    renderHistorial();
  });

  inicializarLoginNavbar(); //Enganche el login del navbar al flujo de pago
});

// Lee el array de cotizaciones guardadas en localStorage
function obtenerHistorial() {
  return JSON.parse(localStorage.getItem("historialPedidos")) || [];
}

// Guarda el array actualizado en localStorage
function guardarHistorial(historial) {
  localStorage.setItem("historialPedidos", JSON.stringify(historial));
}

// Dibuja el historial completo: mensaje vacío o lista de tarjetas
function renderHistorial() {
  const contenedor = document.getElementById("contenedor-historial");
  const historialPedidos = obtenerHistorial();

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
    const tarjetaPedidoHTML = `
      <div class="row align-items-center py-4 mb-3 border-bottom text-center text-md-start fila-pedido">
        <div class="col-12 col-md-2 mb-3 mb-md-0 d-flex justify-content-center">
          <img src="${pedido.imagen}" alt="${pedido.nombreServicio}" class="img-fluid imagen-servicio">
        </div>
        <div class="col-12 col-md-6 mb-3 mb-md-0 text-secondary info-pedido">
          <h3 class="h6 fw-bold text-dark mb-1 nombre-servicio">${pedido.nombreServicio}</h3>
          <p class="mb-1">Paquete: ${pedido.peso} | Dimensiones: ${pedido.dimensiones}</p>
          <p class="mb-1">Fecha: ${pedido.fecha}</p>
          <p class="mb-1">Estatus: <span class="fw-bold text-dark">${pedido.estatus}</span></p>
          <p class="mb-0">No. de Cotización: 
            <a href="#" class="text-dark fw-bold text-decoration-underline" onclick="copiarFolio(event, '${pedido.numCotizacion}')">
              ${pedido.numCotizacion} (Clic para copiar)
            </a>
          </p>
        </div>
        <div class="col-12 col-md-4 d-flex flex-column flex-sm-row justify-content-md-end align-items-center gap-3">
          <a href="#" class="text-dark fw-bold text-decoration-underline small enlace-volver-pedir" onclick="volverAPedir(event, ${index})">(Volver a pedir)</a>
          <button class="btn px-4 text-white rounded-3 fw-medium boton-ver" onclick="verCotizacion(${index})">Ver</button>
        </div>
      </div>
    `;
    columnaPrincipal.innerHTML += tarjetaPedidoHTML;
  });

  contenedor.appendChild(columnaPrincipal);
}

// ---------------------------------------------------------------
// AUTOCOMPLETADO DE CÓDIGO POSTAL (API Zippopotam)
// ---------------------------------------------------------------

/**
 * Consulta la API pública de Zippopotam para México y, si encuentra
 * el código postal, llena los inputs de Estado y Colonia (readonly).
 * Si el CP no tiene 5 dígitos o la API no encuentra nada, limpia
 * esos campos para no dejar datos viejos de un CP anterior.
 *
 * @param {string} idCP - id del input de código postal
 * @param {string} idEstado - id del input de estado a llenar
 * @param {string} idColonia - id del input de colonia a llenar
 */
async function autocompletarPorCP(idCP, idEstado, idColonia) {
  const inputCP = document.getElementById(idCP);
  const inputEstado = document.getElementById(idEstado);
  const inputColonia = document.getElementById(idColonia);

  const cp = inputCP.value.trim();
  const regexCP = /^\d{5}$/;

  // Si el CP no es válido todavía, no llamamos a la API y limpiamos
  if (!regexCP.test(cp)) {
    inputEstado.value = "";
    inputColonia.value = "";
    return;
  }

  // Feedback visual mientras carga
  inputEstado.value = "Buscando...";
  inputColonia.value = "Buscando...";

  try {
    const response = await fetch(`https://api.zippopotam.us/mx/${cp}`);

    if (!response.ok) {
      // CP válido en formato pero que no existe en la API
      inputEstado.value = "";
      inputColonia.value = "No encontrado";
      return;
    }

    const datos = await response.json();

    // La API regresa un array "places"; tomamos el primero para simplificar
    const primerLugar = datos.places[0];
    inputEstado.value = primerLugar.state;
    inputColonia.value = primerLugar["place name"];
  } catch (error) {
    // Problema de red o la API no respondió
    console.error("No se pudo consultar el código postal:", error);
    inputEstado.value = "";
    inputColonia.value = "Error al buscar";
  }
}

/**
 * Cuando el usuario elige un tipo de envío, actualiza el límite
 * máximo permitido en el campo de peso y su mensaje de ayuda.
 */
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

  // Este bloque debe estar DENTRO de la función, antes del cierre }
  const hayTipo = tipoEnvio !== "";
  document.querySelectorAll("#form-cotizar input, #form-cotizar textarea").forEach((campo) => {
    campo.disabled = !hayTipo;
  });
  document.querySelector("#form-cotizar button[type='submit']").disabled = !hayTipo;
} 


/**
 * Valida que el peso sea mayor a 0 y que no exceda el límite
 * permitido para el tipo de envío seleccionado.
 */
function validarPeso(tipoEnvio, peso) {
  if (peso === "" || Number(peso) <= 0) return false;

  const limite = limitesPesoPorServicio[tipoEnvio];
  if (limite && Number(peso) > limite) return false;

  return true;
}

// ---------------------------------------------------------------
// VALIDACIÓN POR CAMPO
// ---------------------------------------------------------------

/**
 * Marca un campo del formulario como válido o inválido visualmente.
 * Usa las clases nativas de Bootstrap (is-valid / is-invalid) para que
 * el navegador muestre/oculte automáticamente el .invalid-feedback
 * que ya está en el HTML, justo debajo de ese campo.
 */
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

/**
 * Quita todas las marcas visuales de validación del formulario.
 * Se llama cuando el modal se cierra, para que la próxima vez que
 * el usuario lo abra no vea los bordes rojos/verdes de la vez anterior.
 */
function limpiarValidacionVisual() {
  const campos = document.querySelectorAll("#form-cotizar .is-valid, #form-cotizar .is-invalid");
  campos.forEach((campo) => campo.classList.remove("is-valid", "is-invalid"));
  document.getElementById("form-cotizar").classList.remove("was-validated");
}

/**
 * Valida que el campo:
 * 1. No esté vacío.
 * 2. Sea un número mayor a 0.
 * 3. Sea menor o igual a 40.
 */
function validarDimension(id, idFeedback) {
  const input = document.getElementById(id);
  const feedback = document.getElementById(idFeedback);
  const valor = parseFloat(input.value);

  // 1. Si está vacío
  if (input.value.trim() === "") {
    feedback.textContent = "Este campo es requerido.";
    return false;
  }
  
  // 2. Si no es número o es menor o igual a 0
  if (isNaN(valor) || valor <= 0) {
    feedback.textContent = "Debe ser un número mayor a 0.";
    return false;
  }
  
  // 3. Si es mayor a 40
  if (valor > 40) {
    feedback.textContent = "La medida debe ser menor a 40 cm.";
    return false;
  }

  // Si todo está bien
  return true;
}

// Valida el formulario del modal, construye el JSON y lo guarda como cotización pendiente
function manejarEnvioCotizacion(evento) {
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

  // Activa los estilos completos de validación de Bootstrap (incluye el
  // ícono de alerta dentro del campo, no solo el borde rojo)
  evento.target.classList.add("was-validated");

  if (!formularioValido) {
    contenedorAlertas.innerHTML = `
      <div class="alert alert-danger" role="alert">
        Hay campos por corregir. Revisa los que están marcados en rojo.
      </div>
    `;
    return;
  }

  const iconosPorServicio = {
    Express: "/assets/repart1.jpg",
    Exclusivo: "/assets/repar3.jpg",
    Extraordinario: "/assets/repar4.jpg",
  };

  const numeroCotizacion = "COT-" + Math.floor(100000 + Math.random() * 900000);

  // Objeto JSON con toda la información del formulario, requerido por la tarea.
  // Nota: no incluye precio porque el cierre comercial se hace por WhatsApp o sucursal.
  const nuevaCotizacion = {
    nombreServicio: tipoEnvio,
    imagen: iconosPorServicio[tipoEnvio],
    peso: `${peso} kg`,
    dimensiones: `${largo}x${ancho}x${alto} cm`,
    fecha: new Date().toLocaleDateString("es-MX"),
    estatus: "Cotización generada — Pendiente de confirmación",
    numCotizacion: numeroCotizacion,
    origen: {
      cp: cpOrigen,
      estado: estadoOrigen,
      colonia: coloniaOrigen,
      calle: calleOrigen,
    },
    destino: {
      cp: cpDestino,
      estado: estadoDestino,
      colonia: coloniaDestino,
      calle: calleDestino,
    },
    nombreRemitente,
    nombreDestinatario,
    telefonoRemitente,
    telefonoDestinatario,
    correoRemitente,
    descripcionContenido,
  };

  const historial = obtenerHistorial();
  historial.push(nuevaCotizacion);
  guardarHistorial(historial);

  evento.target.reset();
  limpiarValidacionVisual();

  //Este cosito de codigo. Guarda la cotizacion para que pago.html la muestre en el resumen
  sessionStorage.setItem("cotizacion_pendiente", JSON.stringify(nuevaCotizacion));

  //Cierrro el modal antes de cambiar de página
  const modalCotizar = bootstrap.Modal.getInstance(
    document.getElementById("modalCotizar")
  );

  if (modalCotizar){
    modalCotizar.hide();
  }

  //Redigir directamente al método de pago
  window.location.href = "/src/pages/pago/pago.html";
}


function abrirLoginNavbar() {
  // Busca el botón del ícono de usuario en el navbar que abre el dropdown
  const btnDropdown = document.querySelector(".dropdown-toggle");
 
  if (!btnDropdown) {
    console.warn("[Pago] No se encontró el botón del dropdown de login en el navbar.");
    return;
  }
 
  btnDropdown.click(); // Bootstrap abre el dropdown
 
  // Enfoca el campo de correo para que el usuario empiece a escribir de inmediato
  setTimeout(() => {
    const emailInput = document.getElementById("loginEmailMob");
    if (emailInput) emailInput.focus();
  }, 250);
}
 
// ---------------------------------------------------------------
// CAMBIO 3: submit del login del navbar → redirige a pago.html
// ---------------------------------------------------------------
 
function inicializarLoginNavbar() {
  const formLogin = document.getElementById("form-login-movil");
  if (!formLogin) return; // Si el navbar no cargó aún, salir sin error
 
  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();
 
    const emailInput  = document.getElementById("loginEmailMob");
    const passInput   = document.getElementById("loginPasswordMob");
    const btnSubmit   = formLogin.querySelector("button[type='submit']");
 
    // — Sanitización: elimina caracteres pegrilosos muy pegrilosos —
    const correo     = String(emailInput.value).replace(/[<>"'`]/g, "").trim();
    const contrasena = String(passInput.value).replace(/[<>"'`]/g, "").trim();
 
    // — Validación —
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
 
    // — Estado de carga —
    const textoOriginal   = btnSubmit.textContent;
    btnSubmit.disabled    = true;
    btnSubmit.innerHTML   = `<span class="spinner-border spinner-border-sm me-1" role="status"></span>Verificando...`;
 
    try {
      //Ya tenemos el backend, aqui viene lo chido, este men... login real:
      await iniciarSesion({ correo, password: contrasena });
 
      //Login exitoso: guarda solo el email, NUNCA la contraseña
      //(iniciarSesion ya guardó el JWT en sessionStorage bajo "jwt_token")
      sessionStorage.setItem("usuario_email", correo);
 
      //Redirige a la página de pago
      //Ajusta la ruta si la estructura de carpetas es diferente
      window.location.href = "/src/pages/pago/pago.html";
 
    } catch (error) {
      btnSubmit.disabled     = false;
      btnSubmit.textContent  = textoOriginal;
 
      // Muestra el error dentro del mismo dropdown
      let errorDiv = formLogin.querySelector(".error-login-navbar");
      if (!errorDiv) {
        errorDiv           = document.createElement("div");
        errorDiv.className = "alert alert-danger py-1 small mt-2 error-login-navbar";
        formLogin.prepend(errorDiv);
      }
      // Mostramos el mensaje real que regresó el backend cuando lo tenemos
      errorDiv.textContent = error.message || "Correo o contraseña incorrectos.";
    }
  });
 
  // Limpia errores visuales mientras el usuario corrige
  document.getElementById("loginEmailMob")?.addEventListener("input", (e) => {
    e.target.classList.remove("is-invalid");
    formLogin.querySelector(".error-login-navbar")?.remove();
  });
  document.getElementById("loginPasswordMob")?.addEventListener("input", (e) => {
    e.target.classList.remove("is-invalid");
  });
}

/**VOLVER A PEDIR
 * Muestra los datos completos de una cotización guardada dentro
 * del modal #modalVerCotizacion (definido en el HTML).
 * @param {number} index - posición del pedido en el array del historial
 */
window.verCotizacion = function (index) {
  const historial = obtenerHistorial();
  const pedido = historial[index];

  if (!pedido) return;

  const cuerpoModal = document.getElementById("cuerpoModalVer");
  cuerpoModal.innerHTML = `
    <p><strong>Servicio:</strong> ${pedido.nombreServicio}</p>
    <p><strong>No. de Cotización:</strong> ${pedido.numCotizacion}</p>
    <p><strong>Fecha:</strong> ${pedido.fecha}</p>
    <p><strong>Estatus:</strong> ${pedido.estatus}</p>
    <p><strong>Paquete:</strong> ${pedido.peso} | Dimensiones: ${pedido.dimensiones}</p>
    <hr>
    <p><strong>Origen:</strong> ${pedido.origen.calle}, Col. ${pedido.origen.colonia}, ${pedido.origen.estado}, CP ${pedido.origen.cp}</p>
    <p><strong>Destino:</strong> ${pedido.destino.calle}, Col. ${pedido.destino.colonia}, ${pedido.destino.estado}, CP ${pedido.destino.cp}</p>
    <hr>
    <p><strong>Remitente:</strong> ${pedido.nombreRemitente} | Tel. ${pedido.telefonoRemitente}</p>
    <p><strong>Destinatario:</strong> ${pedido.nombreDestinatario} | Tel. ${pedido.telefonoDestinatario}</p>
    <p><strong>Correo:</strong> ${pedido.correoRemitente}</p>
    <hr>
    <p><strong>Descripción del contenido:</strong> ${pedido.descripcionContenido}</p>
  `;

  const modalVer = new bootstrap.Modal(document.getElementById("modalVerCotizacion"));
  modalVer.show();
};

/**
 * Pre-llena el formulario de cotizar con los datos de un pedido
 * anterior y abre el modal para que el usuario solo confirme/edite.
 * @param {Event} event - evento de click del enlace
 * @param {number} index - posición del pedido en el array del historial
 */
window.volverAPedir = function (event, index) {
  event.preventDefault();

  const historial = obtenerHistorial();
  const pedido = historial[index];

  if (!pedido) return;

  document.getElementById("tipoEnvio").value = pedido.nombreServicio;
  document.getElementById("cpOrigen").value = pedido.origen.cp;
  document.getElementById("estadoOrigen").value = pedido.origen.estado;
  document.getElementById("coloniaOrigen").value = pedido.origen.colonia;
  document.getElementById("calleOrigen").value = pedido.origen.calle;
  document.getElementById("cpDestino").value = pedido.destino.cp;
  document.getElementById("estadoDestino").value = pedido.destino.estado;
  document.getElementById("coloniaDestino").value = pedido.destino.colonia;
  document.getElementById("calleDestino").value = pedido.destino.calle;
  document.getElementById("nombreRemitente").value = pedido.nombreRemitente;
  document.getElementById("nombreDestinatario").value = pedido.nombreDestinatario;
  document.getElementById("telefonoRemitente").value = pedido.telefonoRemitente;
  document.getElementById("telefonoDestinatario").value = pedido.telefonoDestinatario;
  document.getElementById("correoRemitente").value = pedido.correoRemitente;

  // peso y dimensiones vienen como texto ("2.4 kg", "22x22x22 cm"),
  // hay que extraer solo los números para volver a poner cada input numérico
  document.getElementById("peso").value = parseFloat(pedido.peso);
  const [largo, ancho, alto] = pedido.dimensiones.replace(" cm", "").split("x");
  document.getElementById("largo").value = largo;
  document.getElementById("ancho").value = ancho;
  document.getElementById("alto").value = alto;

  // Sincroniza el límite de peso visible con el servicio que se está re-pidiendo
  actualizarLimitePeso();

  document.getElementById("descripcionContenido").value = pedido.descripcionContenido;

  const modalCotizar = new bootstrap.Modal(document.getElementById("modalCotizar"));
  modalCotizar.show();
};

window.copiarFolio = function (event, folio) {
  event.preventDefault();
  navigator.clipboard
    .writeText(folio)
    .then(() => {
      alert(`Folio de nuevo envío ${folio} copiado al portapapeles.`);
    })
    .catch((err) => {
      console.error("No se pudo copiar el texto automáticamente: ", err);
    });
};

// Atajo solo para desarrollo: presiona Ctrl + Shift + L para vaciar el historial de prueba
document.addEventListener("keydown", (evento) => {
  if (evento.ctrlKey && evento.shiftKey && evento.key === "L") {
    localStorage.removeItem("historialPedidos");
    alert("Historial de prueba borrado.");
    renderHistorial();
  }
});