document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  // Obtenemos todos los elementos del formulario
  const inputs = {
    nombre: document.getElementById("nombre"),
    apellido: document.getElementById("apellido"),
    email: document.getElementById("email"),
    telefono: document.getElementById("telefono"),
    asunto: document.getElementById("asunto"),
    mensaje: document.getElementById("mensaje"),
  };

  // ── VALIDACIÓN DEL CAMPO TELÉFONO ────────────────────────────────────────
  // 1. Bloquear teclas no numéricas en tiempo real (keydown)
  //    Permite: dígitos 0-9, Backspace, Delete, Tab, Enter, flechas, Home, End
  inputs.telefono.addEventListener("keydown", (e) => {
    const teclaPermitida =
      /^[0-9]$/.test(e.key) ||           // dígitos
      ["Backspace", "Delete", "Tab", "Enter", "ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key) ||
      (e.ctrlKey && ["a", "c", "v", "x"].includes(e.key.toLowerCase())); // Ctrl+A/C/V/X

    if (!teclaPermitida) {
      e.preventDefault(); // Cancela la tecla antes de que escriba
    }
  });

  // 2. Sanitizar al pegar (paste): eliminar cualquier carácter no numérico
  inputs.telefono.addEventListener("paste", (e) => {
    e.preventDefault();
    const textoPegado = (e.clipboardData || window.clipboardData).getData("text");
    const soloNumeros = textoPegado.replace(/[^0-9]/g, "");
    // Insertar solo los dígitos respetando el maxlength
    const max = parseInt(inputs.telefono.getAttribute("maxlength") || "10");
    const valorActual = inputs.telefono.value;
    const disponibles = max - valorActual.length;
    inputs.telefono.value = valorActual + soloNumeros.slice(0, disponibles);
  });

  // 3. Limpiar cualquier carácter extraño en el evento input (defensa extra)
  inputs.telefono.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
  });
  // ─────────────────────────────────────────────────────────────────────────

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let formularioValido = true;

    // Validar cada campo
    for (const clave in inputs) {
      const campo = inputs[clave];
      if (campo.value.trim() === "") {
        campo.classList.add("error");
        formularioValido = false;
      } else {
        campo.classList.remove("error");
      }
    }

    // Validar estructura básica del correo electrónico
    if (inputs.email.value && !validateEmail(inputs.email.value)) {
      inputs.email.classList.add("error");
      formularioValido = false;
    }

    // Validar el número de teléfono (exactamente 10 dígitos)
    if (inputs.telefono.value && !validatePhone(inputs.telefono.value)) {
      inputs.telefono.classList.add("error");
      formularioValido = false;
    }

    if (!formularioValido) {
      alert("Por favor, completa todos los campos marcados en rojo.");
      return;
    }

    const datosFormulario = {
      nombre: inputs.nombre.value.trim(),
      apellido: inputs.apellido.value.trim(),
      email: inputs.email.value.trim(),
      telefono: inputs.telefono.value.trim(),
      asunto: inputs.asunto.value,
      mensaje: inputs.mensaje.value.trim(),
      fechaRegistro: new Date().toLocaleString(),
    };

    localStorage.setItem("contactoEnvioExpress", JSON.stringify(datosFormulario));

    alert(`¡Mensaje enviado correctamente!`);
    form.submit();
  });

  // Quitar el borde rojo en tiempo real mientras el usuario escribe
  for (const clave in inputs) {
    inputs[clave].addEventListener("input", function () {
      if (this.value.trim() !== "") {
        this.classList.remove("error");
      }
    });
  }

  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  function validatePhone(phone) {
    const regex = /^\d{10}$/;
    return regex.test(phone);
  }
});