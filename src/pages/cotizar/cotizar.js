/**
 * Lógica de cotización, validación y almacenamiento
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-cotizacion');

  // ── Preselección por URL (?servicio=compartido, etc.) ──
  const params = new URLSearchParams(window.location.search);
  const servicio = params.get('servicio');

  const mapaServicios = {
    express:        '[data-bs-target="#panel-express"]',
    compartido:     '[data-bs-target="#panel-compartido"]',
    exclusivo:      '[data-bs-target="#panel-exclusivo"]',
    extraordinario: '[data-bs-target="#panel-extra"]',
  };

  if (servicio && mapaServicios[servicio]) {
    setTimeout(() => {
      const btnServicio = document.querySelector(mapaServicios[servicio]);
      if (btnServicio) {
        const tab = new bootstrap.Tab(btnServicio);
        tab.show();
      }
    }, 100);
  }
  // ── Fin preselección ──

  // Limpiar validación al cambiar de pestaña
  const tabButtons = document.querySelectorAll('button[data-bs-toggle="pill"]');
  tabButtons.forEach(button => {
    button.addEventListener('shown.bs.tab', () => {
      form.classList.remove('was-validated');
    });
  });

  // ==========================================
  // AUTOCOMPLETADO DE CÓDIGO POSTAL (API Zippopotam)
  // ==========================================
  const cpInputs = document.querySelectorAll('.cp-input');

  cpInputs.forEach(input => {
    input.addEventListener('input', async (e) => {
      const cp = e.target.value;

      if (cp.length === 5 && /^[0-9]+$/.test(cp)) {
        const bloque = e.target.closest('.bloque-direccion');
        const inputEstado = bloque.querySelector('.estado-input');
        const selectColonia = bloque.querySelector('.colonia-select');

        inputEstado.value = "Buscando...";
        selectColonia.innerHTML = '<option value="">Cargando colonias...</option>';

        try {
          const response = await fetch(`https://api.zippopotam.us/mx/${cp}`);

          if (!response.ok) throw new Error('Código Postal no encontrado');

          const data = await response.json();

          let nombreEstado = data.places[0].state;
          if (nombreEstado.includes('Distrito Federal')) {
            nombreEstado = 'Ciudad de México';
          }

          inputEstado.value = nombreEstado;

          selectColonia.innerHTML = '<option value="">Selecciona tu colonia</option>';
          data.places.forEach(place => {
            const option = document.createElement('option');
            option.value = place['place name'];
            option.textContent = place['place name'];
            selectColonia.appendChild(option);
          });

        } catch (error) {
          inputEstado.value = "";
          selectColonia.innerHTML = '<option value="">C.P. inválido</option>';

          Swal.fire({
            icon: 'warning',
            title: 'Código Postal no encontrado',
            text: 'Por favor, verifica que los 5 dígitos sean correctos.',
            confirmButtonColor: '#0DA74A'
          });
        }
      }
    });
  });

  // ==========================================
  // LÓGICA DE ENVÍO Y VALIDACIÓN
  // ==========================================
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const activePanel = document.querySelector('.tab-pane.active');
    if (!activePanel) return;

    const elementosActivos = activePanel.querySelectorAll('input, select');
    let formValido = true;

    elementosActivos.forEach(elemento => {
      if (!elemento.checkValidity()) {
        formValido = false;
      }
    });

    form.classList.add('was-validated');

    if (!formValido) {
      e.stopPropagation();
      Swal.fire({
        icon: 'error',
        title: 'Faltan datos',
        text: 'Por favor, completa correctamente los campos marcados en rojo.',
        confirmButtonColor: '#0DA74A'
      });
      return;
    }

    const formData = {};
    const activeTabButton = document.querySelector('.nav-link.active');

    if (activeTabButton) {
      const tipoEnvio = activeTabButton.querySelector('.fw-bold').textContent.trim();
      formData['Tipo de Servicio'] = tipoEnvio;
    }

    elementosActivos.forEach(elemento => {
      const label = elemento.previousElementSibling;
      const nombreCampo = label ? label.textContent.trim() : (elemento.placeholder || 'Colonia');
      formData[nombreCampo] = elemento.value.trim();
    });

    localStorage.setItem('cotizacionEnvio', JSON.stringify(formData));
    console.log('Datos listos para enviar:', formData);

<<<<<<< HEAD
    Swal.fire({
      icon: 'success',
      title: '¡Cotización exitosa!',
      text: 'Tu pedido ha sido generado correctamente y tus datos están protegidos.',
      confirmButtonColor: '#0DA74A',
      confirmButtonText: 'Entendido'
    }).then((result) => {
      if (result.isConfirmed) {
        form.reset();
        form.classList.remove('was-validated');

        const selects = document.querySelectorAll('.colonia-select');
        selects.forEach(select => {
          select.innerHTML = '<option value="">Ingresa tu CP primero...</option>';
        });
      }
    });
=======
    //Guardamos la cotizacion "pendiente" para recuperarla despues de login
    const cotizacionPendiente = {
      tipoServicio: tipoEnvio,
      datos: formData,
      precio: precio,
      fecha: new Date().toISOString()
    };

    localStorage.setItem('cotizacionEnvio', JSON.stringify(cotizacionPendiente));
    // console.log('Datos listos para enviar:', formData);

   mostrarModalPrecio(cotizacionPendiente);
>>>>>>> d40f986 (quitamos buttons de servicios y cambio flujo de agregarcarr a cotizar)
  });
});

<<<<<<< HEAD
// ── FUNCIONES DE HISTORIAL ──────────────────────────────────────────────────
=======
// ── CÁLCULO DE PRECIO ───────────────────────────────────────────────────────

const BASE_POR_SERVICIO = {
  'Express': 120,
  'Compartido': 80,
  'Exclusivo': 340,
  'Extraordinario': 800,
};

const COSTO_POR_KG_FACTURABLE = {
  'Express': 8,
  'Compartido': 5,
  'Exclusivo': 15,
  'Extraordinario': 25,
};

function calcularPrecio(tipoEnvio, formData) {
  const base = BASE_POR_SERVICIO[tipoEnvio] ?? 100;
  const costoPorKg = COSTO_POR_KG_FACTURABLE[tipoEnvio] ?? 10;

  const claveKgPeso = Object.keys(formData).find(k => k.toLowerCase().includes('peso'));
  const peso = claveKgPeso ? parseFloat(formData[claveKgPeso]) || 0 : 0;

  const alto = parseFloat(formData['Alto (cm)']) || 0;
  const largo = parseFloat(formData['Largo (cm)']) || 0;
  const ancho = parseFloat(formData['Ancho (cm)']) || 0;

  const pesoVolumetrico = (alto * largo * ancho) / 5000;
  const pesoFacturable = Math.max(peso, pesoVolumetrico);

  const precio = base + pesoFacturable * costoPorKg;
  return Math.round(precio);
}

// ── MODAL DE PRECIO + AGREGAR AL CARRITO ────────────────────────────────────

function mostrarModalPrecio(cotizacion) {
  const { tipoServicio, precio } = cotizacion;
  Swal.fire({
    icon: 'info',
    title: 'Cotización lista',
    html: `
      <p class="mb-1">Tu envío <strong>${tipoServicio}</strong> tiene un costo estimado de:</p>
      <h2 class="fw-bold text-success my-3">$${precio} MXN</h2>
        `,
    showCancelButton: true,
    confirmButtonText: '<i class="bi bi-cart-plus-fill me-1"></i> Agregar al carrito',
    cancelButtonText: 'Seguir cotizando',
    confirmButtonColor: '#0DA74A',
    cancelButtonColor: '#6c757d',
    reverseButtons: true,
  }).then((result) => {
    if (!result.isConfirmed) return;
      agregarCotizacionAlCarrito(cotizacion);
      localStorage.removeItem('cotizacionEnvio');
      window.location.href = '/src/pages/carrito/carrito.html';
  });
}

function agregarCotizacionAlCarrito(cotizacion) {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const descripcion = generarDescripcion(cotizacion.datos);

  const existe = carrito.find(item => item.nombre === cotizacion.tipoServicio);
  if (existe) {
    if(existe.cantidad < 3) existe.cantidad++;
    existe.descripcion = descripcion;
  }
  else {
    carrito.push({
    nombre: cotizacion.tipoServicio,
    precio: cotizacion.precio,
    cantidad: 1,
    descripcion: descripcion
  });
}
  
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

//Genero una descripcion de la cotizacion guardada en Carrito
function generarDescripcion(datos) {
  const cpOrigen = datos['C.P. Origen'] || '';
  const cpDestino = datos['C.P. Destino'] || '';

  const clavePeso = Object.keys(datos).find(k => k.toLowerCase().includes('peso'));
  const peso = clavePeso ? datos[clavePeso] : '';
>>>>>>> d40f986 (quitamos buttons de servicios y cambio flujo de agregarcarr a cotizar)

  const claveContenido = Object.keys(datos).find(k => k.toLowerCase().includes('contenido'));
  const contenido = claveContenido ? datos[claveContenido] : '';

  const partes = [];
  if (cpOrigen && cpDestino) partes.push(`CP ${cpOrigen} → CP ${cpDestino}`);
  if (peso) partes.push(`${peso} kg`);
  if (contenido) partes.push(contenido);

<<<<<<< HEAD
function eliminarCotizacion(id) {
  const historial = obtenerHistorial().filter(c => c.id !== id);
  localStorage.setItem('historialCotizaciones', JSON.stringify(historial));
  renderizarHistorial();
  if (historial.length === 0) {
    const seccion = document.getElementById('seccion-historial');
    if (seccion) seccion.classList.add('d-none');
  }
}

function limpiarHistorial() {
  if (!confirm('¿Seguro que deseas borrar todo el historial de cotizaciones?')) return;
  localStorage.removeItem('historialCotizaciones');
  renderizarHistorial();
  const seccion = document.getElementById('seccion-historial');
  if (seccion) seccion.classList.add('d-none');
}

function renderizarHistorial() {
  const contenedor = document.getElementById('lista-historial');
  if (!contenedor) return;

  const historial = obtenerHistorial();

  if (historial.length === 0) {
    contenedor.innerHTML = `
      <p class="text-muted text-center py-3">
        <i class="bi bi-inbox me-2"></i>Aún no tienes cotizaciones guardadas.
      </p>`;
    return;
  }

  const iconos = {
    'Express':        'bi-lightning-charge-fill text-warning',
    'Compartido':     'bi-people-fill text-primary',
    'Exclusivo':      'bi-shield-check-fill text-success',
    'Extraordinario': 'bi-box-seam-fill text-danger',
  };

  contenedor.innerHTML = historial.map(cot => {
    const icono = iconos[cot.tipoServicio] || 'bi-box text-secondary';
    const campos = Object.entries(cot.datos)
      .filter(([k]) => k !== 'Tipo de Servicio')
      .slice(0, 4)
      .map(([k, v]) => `<span class="badge bg-light text-dark border me-1 mb-1">${k}: <strong>${v}</strong></span>`)
      .join('');

    return `
      <div class="card mb-3 border-0 shadow-sm historial-card" data-id="${cot.id}">
        <div class="card-body py-3 px-4">
          <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div class="d-flex align-items-center gap-3">
              <div class="historial-icono">
                <i class="bi ${icono} fs-4"></i>
              </div>
              <div>
                <h6 class="mb-0 fw-bold">${cot.tipoServicio}</h6>
                <small class="text-muted"><i class="bi bi-clock me-1"></i>${cot.fecha}</small>
              </div>
            </div>
            <button class="btn btn-sm btn-outline-danger" onclick="eliminarCotizacion(${cot.id})" title="Eliminar cotización">
              <i class="bi bi-trash3"></i>
            </button>
          </div>
          ${campos ? `<div class="mt-2">${campos}</div>` : ''}
        </div>
      </div>`;
  }).join('');
}

window.eliminarCotizacion = eliminarCotizacion;
window.limpiarHistorial   = limpiarHistorial;
=======
  return partes.join(' · ') || 'Sin detalles adicionales';
};
>>>>>>> d40f986 (quitamos buttons de servicios y cambio flujo de agregarcarr a cotizar)
