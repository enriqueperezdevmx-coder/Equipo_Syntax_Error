document.addEventListener("navbarCargado", () => {
  inicializarPerfil();
});

// Por si el navbar ya estaba cargado antes de que este script se registre
if (document.getElementById("form-perfil")) {
  inicializarPerfil();
}

function inicializarPerfil() {
  const sesion = JSON.parse(localStorage.getItem("sesionActiva") || "null");

  const vistaSinSesion = document.getElementById("sin-sesion");
  const vistaConSesion = document.getElementById("contenido-perfil");

  if (!sesion) {
    vistaSinSesion.classList.remove("d-none");
    vistaConSesion.classList.add("d-none");
    return;
  }

  vistaSinSesion.classList.add("d-none");
  vistaConSesion.classList.remove("d-none");

  pintarDatosUsuario(sesion);
  engancharFormularioPerfil(sesion.correo);
  engancharFormularioPassword(sesion.correo);
  engancharCerrarSesion();
  inicializarDirecciones(sesion.correo);
  inicializarMetodosPago(sesion.correo);
}

// --- Pintar los datos actuales del usuario en la tarjeta y el formulario ---

function pintarDatosUsuario(sesion) {
  document.getElementById("resumen-nombre").textContent =
    `${sesion.nombre} ${sesion.apellido}`;
  document.getElementById("resumen-correo").textContent = sesion.correo;

  const iniciales =
    (sesion.nombre?.[0] || "").toUpperCase() +
    (sesion.apellido?.[0] || "").toUpperCase();
  document.getElementById("avatar-iniciales").textContent = iniciales || "--";

  document.getElementById("perfil-nombres").value = sesion.nombre || "";
  document.getElementById("perfil-apellidos").value = sesion.apellido || "";
  document.getElementById("perfil-correo").value = sesion.correo || "";
  document.getElementById("perfil-celular").value = sesion.telefono || "";
}

// --- Guardar cambios de nombre / apellido / celular ---

function engancharFormularioPerfil(correoSesion) {
  const form = document.getElementById("form-perfil");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombres = document.getElementById("perfil-nombres").value.trim();
    const apellidos = document.getElementById("perfil-apellidos").value.trim();
    const celular = document.getElementById("perfil-celular").value.trim();

    const errores = [];
    if (!nombres) errores.push("El nombre no puede estar vacío.");
    if (!apellidos) errores.push("Los apellidos no pueden estar vacíos.");
    if (celular.length !== 10 || !/^\d{10}$/.test(celular)) {
      errores.push("El celular debe tener exactamente 10 dígitos.");
    }

    if (errores.length > 0) {
      mostrarAlerta(errores.join(" "), "danger");
      return;
    }

    // Actualizamos al usuario dentro de la "base de datos" en localStorage
    const usuarios = JSON.parse(
      localStorage.getItem("usuariosMensajeria") || "[]",
    );
    const idx = usuarios.findIndex((u) => u.correo === correoSesion);
    if (idx === -1) {
      mostrarAlerta(
        "No se encontró tu usuario. Vuelve a iniciar sesión.",
        "danger",
      );
      return;
    }

    usuarios[idx].nombre = nombres;
    usuarios[idx].apellido = apellidos;
    usuarios[idx].telefono = celular;
    localStorage.setItem("usuariosMensajeria", JSON.stringify(usuarios));

    // Actualizamos también la sesión activa y el botón del navbar
    const sesionActualizada = { ...usuarios[idx] };
    delete sesionActualizada.password;
    localStorage.setItem("sesionActiva", JSON.stringify(sesionActualizada));

    pintarDatosUsuario(sesionActualizada);
    document.dispatchEvent(new CustomEvent("navbarCargado")); // refresca el botón "Entrar"

    mostrarAlerta("✅ Tus datos se actualizaron correctamente.", "success");
  });
}

// --- Cambiar contraseña ---

function engancharFormularioPassword(correoSesion) {
  const form = document.getElementById("form-password");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const actual = document.getElementById("password-actual").value;
    const nueva = document.getElementById("password-nueva").value;
    const confirmar = document.getElementById("password-confirmar").value;

    const usuarios = JSON.parse(
      localStorage.getItem("usuariosMensajeria") || "[]",
    );
    const idx = usuarios.findIndex((u) => u.correo === correoSesion);

    if (idx === -1) {
      mostrarAlerta(
        "No se encontró tu usuario. Vuelve a iniciar sesión.",
        "danger",
      );
      return;
    }

    if (usuarios[idx].password !== actual) {
      mostrarAlerta("La contraseña actual no es correcta.", "danger");
      return;
    }

    if (nueva !== confirmar) {
      mostrarAlerta(
        "La nueva contraseña y su confirmación no coinciden.",
        "danger",
      );
      return;
    }

    if (nueva.length < 12) {
      mostrarAlerta(
        "La nueva contraseña debe tener mínimo 12 caracteres.",
        "danger",
      );
      return;
    }

    usuarios[idx].password = nueva;
    localStorage.setItem("usuariosMensajeria", JSON.stringify(usuarios));

    form.reset();
    mostrarAlerta("✅ Tu contraseña se actualizó correctamente.", "success");
  });
}

// --- Cerrar sesión desde la tarjeta de perfil ---

function engancharCerrarSesion() {
  document
    .getElementById("btn-cerrar-sesion-perfil")
    .addEventListener("click", () => {
      localStorage.removeItem("sesionActiva");
      window.location.href = "/index.html";
    });
}

// ═══════════════════════════════════════════
// Direcciones guardadas
// Se guardan por usuario con la llave "direcciones:<correo>"
// ═══════════════════════════════════════════

function obtenerDirecciones(correo) {
  return JSON.parse(localStorage.getItem(`direcciones:${correo}`) || "[]");
}

function guardarDirecciones(correo, lista) {
  localStorage.setItem(`direcciones:${correo}`, JSON.stringify(lista));
}

function inicializarDirecciones(correo) {
  const form = document.getElementById("form-direccion");
  const btnMostrar = document.getElementById("btn-mostrar-form-direccion");
  const btnCancelar = document.getElementById("btn-cancelar-direccion");

  renderizarDirecciones(correo);

  btnMostrar.addEventListener("click", () => {
    document.getElementById("direccion-id").value = "";
    form.reset();
    form.classList.remove("d-none");
    form.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  btnCancelar.addEventListener("click", () => {
    form.reset();
    form.classList.add("d-none");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const etiqueta = document.getElementById("direccion-etiqueta").value.trim();
    const calle = document.getElementById("direccion-calle").value.trim();
    const cp = document.getElementById("direccion-cp").value.trim();
    const colonia = document.getElementById("direccion-colonia").value.trim();
    const ciudad = document.getElementById("direccion-ciudad").value.trim();
    const estado = document.getElementById("direccion-estado").value.trim();

    const errores = [];
    if (!etiqueta)
      errores.push(
        'La etiqueta es obligatoria (ej. "Tienda de ropa deportiva").',
      );
    if (!calle) errores.push("La calle y número son obligatorios.");
    if (cp.length !== 5 || !/^\d{5}$/.test(cp))
      errores.push("El código postal debe tener 5 dígitos.");
    if (!colonia) errores.push("La colonia es obligatoria.");
    if (!ciudad) errores.push("La ciudad es obligatoria.");
    if (!estado) errores.push("El estado es obligatorio.");

    if (errores.length > 0) {
      mostrarAlerta(errores.join(" "), "danger");
      return;
    }

    const nuevaDireccion = {
      id: document.getElementById("direccion-id").value || crypto.randomUUID(),
      etiqueta,
      destinatario: document
        .getElementById("direccion-destinatario")
        .value.trim(),
      calle,
      cp,
      colonia,
      ciudad,
      estado,
      referencias: document
        .getElementById("direccion-referencias")
        .value.trim(),
    };

    let lista = obtenerDirecciones(correo);
    const idxExistente = lista.findIndex((d) => d.id === nuevaDireccion.id);

    if (idxExistente !== -1) {
      lista[idxExistente] = nuevaDireccion;
    } else {
      lista.push(nuevaDireccion);
    }

    guardarDirecciones(correo, lista);
    renderizarDirecciones(correo);

    form.reset();
    form.classList.add("d-none");
    mostrarAlerta("✅ Dirección guardada correctamente.", "success");
  });
}

function renderizarDirecciones(correo) {
  const contenedor = document.getElementById("lista-direcciones");
  const avisoVacio = document.getElementById("sin-direcciones");
  const lista = obtenerDirecciones(correo);

  contenedor.innerHTML = "";

  if (lista.length === 0) {
    avisoVacio.classList.remove("d-none");
    return;
  }
  avisoVacio.classList.add("d-none");

  lista.forEach((dir) => {
    const col = document.createElement("div");
    col.className = "col-md-6";
    col.innerHTML = `
      <div class="item-guardado">
        <div class="acciones-item">
          <button type="button" class="btn-editar-item" data-id="${dir.id}" aria-label="Editar dirección">
            <i class="bi bi-pencil"></i>
          </button>
          <button type="button" class="btn-eliminar-item" data-id="${dir.id}" aria-label="Eliminar dirección">
            <i class="bi bi-trash"></i>
          </button>
        </div>
        <p class="etiqueta-item"><i class="bi bi-geo-alt-fill me-1"></i>${escaparTexto(dir.etiqueta)}</p>
        <p class="detalle-item">${escaparTexto(dir.calle)}, ${escaparTexto(dir.colonia)}</p>
        <p class="detalle-item">${escaparTexto(dir.ciudad)}, ${escaparTexto(dir.estado)}, CP ${escaparTexto(dir.cp)}</p>
        ${dir.referencias ? `<p class="detalle-item fst-italic mt-1">${escaparTexto(dir.referencias)}</p>` : ""}
      </div>
    `;
    contenedor.appendChild(col);
  });

  contenedor.querySelectorAll(".btn-editar-item").forEach((btn) => {
    btn.addEventListener("click", () =>
      editarDireccion(correo, btn.dataset.id),
    );
  });
  contenedor.querySelectorAll(".btn-eliminar-item").forEach((btn) => {
    btn.addEventListener("click", () =>
      eliminarDireccion(correo, btn.dataset.id),
    );
  });
}

function editarDireccion(correo, id) {
  const dir = obtenerDirecciones(correo).find((d) => d.id === id);
  if (!dir) return;

  document.getElementById("direccion-id").value = dir.id;
  document.getElementById("direccion-etiqueta").value = dir.etiqueta;
  document.getElementById("direccion-destinatario").value =
    dir.destinatario || "";
  document.getElementById("direccion-calle").value = dir.calle;
  document.getElementById("direccion-cp").value = dir.cp;
  document.getElementById("direccion-colonia").value = dir.colonia;
  document.getElementById("direccion-ciudad").value = dir.ciudad;
  document.getElementById("direccion-estado").value = dir.estado;
  document.getElementById("direccion-referencias").value =
    dir.referencias || "";

  const form = document.getElementById("form-direccion");
  form.classList.remove("d-none");
  form.scrollIntoView({ behavior: "smooth", block: "center" });
}

function eliminarDireccion(correo, id) {
  if (!confirm("¿Eliminar esta dirección guardada?")) return;
  const lista = obtenerDirecciones(correo).filter((d) => d.id !== id);
  guardarDirecciones(correo, lista);
  renderizarDirecciones(correo);
  mostrarAlerta("Dirección eliminada.", "success");
}

// ═══════════════════════════════════════════
// Métodos de pago guardados
// Solo se guardan alias, tipo, marca, últimos 4 dígitos y vencimiento.
// NUNCA se guarda el número completo ni el CVV.
// ═══════════════════════════════════════════

function obtenerMetodosPago(correo) {
  return JSON.parse(localStorage.getItem(`metodosPago:${correo}`) || "[]");
}

function guardarMetodosPago(correo, lista) {
  localStorage.setItem(`metodosPago:${correo}`, JSON.stringify(lista));
}

function inicializarMetodosPago(correo) {
  const form = document.getElementById("form-metodo-pago");
  const btnMostrar = document.getElementById("btn-mostrar-form-pago");
  const btnCancelar = document.getElementById("btn-cancelar-pago");

  renderizarMetodosPago(correo);

  btnMostrar.addEventListener("click", () => {
    form.reset();
    form.classList.remove("d-none");
    form.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  btnCancelar.addEventListener("click", () => {
    form.reset();
    form.classList.add("d-none");
  });

  document
    .getElementById("pago-ultimos4")
    .addEventListener("input", function () {
      this.value = this.value.replace(/\D/g, "");
    });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const alias = document.getElementById("pago-alias").value.trim();
    const tipo = document.getElementById("pago-tipo").value;
    const marca = document.getElementById("pago-marca").value;
    const ultimos4 = document.getElementById("pago-ultimos4").value.trim();
    const vencimiento = document
      .getElementById("pago-vencimiento")
      .value.trim();

    const errores = [];
    if (!alias)
      errores.push('El alias es obligatorio (ej. "Tarjeta principal").');
    if (ultimos4.length !== 4)
      errores.push("Ingresa exactamente los últimos 4 dígitos.");
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(vencimiento)) {
      errores.push("El vencimiento debe tener el formato MM/AA.");
    }

    if (errores.length > 0) {
      mostrarAlerta(errores.join(" "), "danger");
      return;
    }

    const nuevoMetodo = {
      id: crypto.randomUUID(),
      alias,
      tipo,
      marca,
      ultimos4,
      vencimiento,
    };

    const lista = obtenerMetodosPago(correo);
    lista.push(nuevoMetodo);
    guardarMetodosPago(correo, lista);
    renderizarMetodosPago(correo);

    form.reset();
    form.classList.add("d-none");
    mostrarAlerta("✅ Método de pago guardado correctamente.", "success");
  });
}

function iconoMarcaTarjeta(marca) {
  if (marca === "Visa") return "bi-credit-card-2-front";
  if (marca === "Mastercard") return "bi-credit-card";
  return "bi-credit-card-fill";
}

function renderizarMetodosPago(correo) {
  const contenedor = document.getElementById("lista-metodos-pago");
  const avisoVacio = document.getElementById("sin-metodos-pago");
  const lista = obtenerMetodosPago(correo);

  contenedor.innerHTML = "";

  if (lista.length === 0) {
    avisoVacio.classList.remove("d-none");
    return;
  }
  avisoVacio.classList.add("d-none");

  lista.forEach((metodo) => {
    const col = document.createElement("div");
    col.className = "col-md-6";
    col.innerHTML = `
      <div class="item-guardado">
        <div class="acciones-item">
          <button type="button" class="btn-eliminar-item" data-id="${metodo.id}" aria-label="Eliminar método de pago">
            <i class="bi bi-trash"></i>
          </button>
        </div>
        <p class="etiqueta-item">
          <i class="bi ${iconoMarcaTarjeta(metodo.marca)} icono-marca-tarjeta me-2"></i>${escaparTexto(metodo.alias)}
        </p>
        <p class="detalle-item">${escaparTexto(metodo.marca)} ${escaparTexto(metodo.tipo)} •••• ${escaparTexto(metodo.ultimos4)}</p>
        <p class="detalle-item">Vence ${escaparTexto(metodo.vencimiento)}</p>
      </div>
    `;
    contenedor.appendChild(col);
  });

  contenedor.querySelectorAll(".btn-eliminar-item").forEach((btn) => {
    btn.addEventListener("click", () =>
      eliminarMetodoPago(correo, btn.dataset.id),
    );
  });
}

function eliminarMetodoPago(correo, id) {
  if (!confirm("¿Eliminar este método de pago?")) return;
  const lista = obtenerMetodosPago(correo).filter((m) => m.id !== id);
  guardarMetodosPago(correo, lista);
  renderizarMetodosPago(correo);
  mostrarAlerta("Método de pago eliminado.", "success");
}

// --- Escudo básico anti-inyección, mismo patrón que registro.js ---

function escaparTexto(texto) {
  const elemento = document.createElement("div");
  elemento.textContent = texto || "";
  return elemento.innerHTML;
}

// --- Alertas visuales, mismo estilo que registro.js ---

function mostrarAlerta(mensaje, tipo) {
  const contenedor = document.getElementById("alertas-contenedor");
  contenedor.innerHTML = `
    <div class="alert alert-${tipo} alert-dismissible fade show shadow-sm" role="alert">
      ${mensaje}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;
  contenedor.scrollIntoView({ behavior: "smooth", block: "start" });
}
