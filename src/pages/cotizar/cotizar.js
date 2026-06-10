/**
 * origen y destino, bloquear envios que excedan las posbilidades del servicio
 * posibles soluciones usar api o hacer una array de datos con los cp de monterrey y cdmx
 * Remitente y destinatario
 * medidas del paquete permite medidas negativas
 * Datos de los participantes y Remitente y destinatario no son iguales pero son lo mismo pero es fiel al figma
 * compartido no es el mismo precio al figma
 * ponerle alertas de campos faltantes
 * alerta tu pedido a sido generado con éxito
 * ajustar paleta de limon a lima *
 */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-cotizacion");

  // 1. Quitar el borde rojo cuando el usuario empiece a escribir
  form.addEventListener("input", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
      e.target.classList.remove("is-invalid");
    }
  });

  // 2. Manejar el evento de envío (Submit)
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Evita que la página se recargue

    let isValid = true;
    const formData = {};

    // Obtener la pestaña (tipo de envío) que está activa actualmente
    const activeTabButton = document.querySelector(".nav-link.active");
    let tipoEnvio = "";

    if (activeTabButton) {
      tipoEnvio = activeTabButton.querySelector(".fw-bold").textContent.trim();
      formData["Tipo de Servicio"] = tipoEnvio;
    }

    // Obtener solo el panel de contenido que está visible
    const activePanel = document.querySelector(".tab-pane.active");
    if (!activePanel) return;

    // Buscar todos los inputs dentro de ese panel visible
    const inputs = activePanel.querySelectorAll("input");

    // 3. Validar que no estén vacíos
    inputs.forEach((input) => {
      if (input.value.trim() === "") {
        input.classList.add("is-invalid");
        isValid = false;
      } else {
        input.classList.remove("is-invalid");

        const label = input.previousElementSibling;
        const nombreCampo = label
          ? label.textContent.trim()
          : input.placeholder;

        formData[nombreCampo] = input.value.trim();
      }
    });

    // Si falta algún campo, detenemos el proceso
    if (!isValid) {
      alert("Por favor, completa todos los campos marcados en rojo.");
      return;
    }

    // ==========================================
    // 4. PROCESAR DATOS PARA EL HISTORIAL
    // ==========================================

    let historialExistente =
      JSON.parse(localStorage.getItem("historialPedidos")) || [];

    // Determinamos qué imagen usar según la pestaña seleccionada
    let rutaImagen = "assets/img/servicio-compartido.png"; // Por defecto
    if (tipoEnvio === "Express") {
      rutaImagen = "assets/img/servicio-express.png";
    } else if (tipoEnvio === "Exclusivo") {
      rutaImagen = "assets/img/servicio-exclusivo.png";
    } else if (tipoEnvio === "Extraordinario") {
      rutaImagen = "assets/img/servicio-extraordinario.png";
    }

    // Buscamos de forma inteligente el peso y dimensiones en el objeto formData
    const campoPeso = Object.keys(formData).find((key) =>
      key.toLowerCase().includes("peso"),
    );
    const campoAlto = Object.keys(formData).find((key) =>
      key.toLowerCase().includes("alto"),
    );
    const campoLargo = Object.keys(formData).find((key) =>
      key.toLowerCase().includes("largo"),
    );
    const campoAncho = Object.keys(formData).find((key) =>
      key.toLowerCase().includes("ancho"),
    );

    const valorPeso = campoPeso ? `${formData[campoPeso]} Kg` : "0 Kg";
    const valorDimensiones = `${campoLargo ? formData[campoLargo] : 0}×${campoAncho ? formData[campoAncho] : 0}×${campoAlto ? formData[campoAlto] : 0} Cm`;

    // Armamos el objeto estructurado
    const nuevoPedido = {
      id: Date.now(),
      nombreServicio: `Servicio ${tipoEnvio}`,
      imagen: rutaImagen,
      peso: valorPeso,
      dimensions: valorDimensiones, // Nota: el historial.js busca pedido.dimensiones, asegúrate de escribirlo idéntico
      dimensiones: valorDimensiones, // Lo dejamos duplicado por seguridad para mapear bien
      fecha: obtenerFechaActual(),
      estatus: "Paquete Entregado",
      numGuia: generarNumeroGuia(),
    };

    // Agregamos al inicio de la lista
    historialExistente.unshift(nuevoPedido);

    // Guardamos en LocalStorage
    localStorage.setItem(
      "historialPedidos",
      JSON.stringify(historialExistente),
    );

    alert("¡Tu pedido ha sido generado con éxito!");
    console.log("Pedido agregado al historial:", nuevoPedido);

    // Si quieres que al dar "Aceptar" en la alerta te mande directo al historial, descomenta la siguiente línea:
    // window.location.href = "historial.html";
  });

  // === FUNCIONES AUXILIARES (Fuera del listener del formulario) ===

  function obtenerFechaActual() {
    const meses = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    const fecha = new Date();
    return `${fecha.getDate()} - ${meses[fecha.getMonth()]} - ${fecha.getFullYear()}`;
  }

  function generarNumeroGuia() {
    const numeroAleatorio = Math.floor(100000000 + Math.random() * 900000000);
    return `MX${numeroAleatorio}`;
  }
});
