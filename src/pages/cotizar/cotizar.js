/**
 * cotizar.js — Equipo Syntax Error
 * Maneja el formulario de cotización y el HISTORIAL DE COTIZACIONES.
 *
 * Historial: se guarda en localStorage con la clave "historialCotizaciones"
 * como un array de objetos. Cada cotización tiene: id, fecha, tipoServicio
 * y los campos del formulario activo.
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-cotizacion');

  // ── 1. Quitar clase is-invalid al escribir ──────────────────────────────
  form.addEventListener('input', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      e.target.classList.remove('is-invalid');
    }
  });

  // ── 2. Submit: validar, guardar y mostrar historial ─────────────────────
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    const formData = {};

    // Tipo de servicio activo
    const activeTabButton = document.querySelector('.nav-link.active');
    if (activeTabButton) {
      const tipoEnvio = activeTabButton.querySelector('.fw-bold').textContent.trim();
      formData['Tipo de Servicio'] = tipoEnvio;
    }

    // Panel activo
    const activePanel = document.querySelector('.tab-pane.active');
    if (!activePanel) return;

    // Validar inputs del panel activo
    const inputs = activePanel.querySelectorAll('input');
    inputs.forEach(input => {
      if (input.value.trim() === '') {
        input.classList.add('is-invalid');
        isValid = false;
      } else {
        input.classList.remove('is-invalid');
        const label = input.previousElementSibling;
        const nombreCampo = label ? label.textContent.trim() : input.placeholder;
        formData[nombreCampo] = input.value.trim();
      }
    });

    if (!isValid) {
      alert('Por favor, completa todos los campos marcados en rojo.');
      return;
    }

    // ── GUARDAR EN HISTORIAL ────────────────────────────────────────────
    const cotizacion = {
      id: Date.now(),                              // ID único basado en timestamp
      fecha: new Date().toLocaleString('es-MX'),  // Fecha legible
      tipoServicio: formData['Tipo de Servicio'] || 'Sin tipo',
      datos: { ...formData },
    };

    const historial = obtenerHistorial();
    historial.unshift(cotizacion);               // Más reciente primero
    localStorage.setItem('historialCotizaciones', JSON.stringify(historial));

    // También mantener compatibilidad con la clave anterior
    localStorage.setItem('cotizacionEnvio', JSON.stringify(formData));

    alert('¡Cotización guardada exitosamente!');
    console.log('Cotización guardada:', cotizacion);

    renderizarHistorial();
    mostrarSeccionHistorial();
  });

  // ── 3. Inicializar historial al cargar ──────────────────────────────────
  renderizarHistorial();
  if (obtenerHistorial().length > 0) {
    mostrarSeccionHistorial();
  }
});

// ── FUNCIONES DE HISTORIAL ─────────────────────────────────────────────────

/**
 * Lee el historial guardado en localStorage.
 * @returns {Array} Array de cotizaciones
 */
function obtenerHistorial() {
  try {
    return JSON.parse(localStorage.getItem('historialCotizaciones')) || [];
  } catch {
    return [];
  }
}

/**
 * Muestra u oculta la sección de historial.
 */
function mostrarSeccionHistorial() {
  const seccion = document.getElementById('seccion-historial');
  if (seccion) seccion.classList.remove('d-none');
}

/**
 * Elimina una cotización del historial por su id.
 * @param {number} id
 */
function eliminarCotizacion(id) {
  const historial = obtenerHistorial().filter(c => c.id !== id);
  localStorage.setItem('historialCotizaciones', JSON.stringify(historial));
  renderizarHistorial();
  // Si quedó vacío, ocultar sección
  if (historial.length === 0) {
    const seccion = document.getElementById('seccion-historial');
    if (seccion) seccion.classList.add('d-none');
  }
}

/**
 * Limpia todo el historial.
 */
function limpiarHistorial() {
  if (!confirm('¿Seguro que deseas borrar todo el historial de cotizaciones?')) return;
  localStorage.removeItem('historialCotizaciones');
  renderizarHistorial();
  const seccion = document.getElementById('seccion-historial');
  if (seccion) seccion.classList.add('d-none');
}

/**
 * Renderiza las tarjetas del historial en el contenedor #lista-historial.
 */
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
    // Campos relevantes a mostrar (excluir "Tipo de Servicio" ya que está en el header)
    const campos = Object.entries(cot.datos)
      .filter(([k]) => k !== 'Tipo de Servicio')
      .slice(0, 4) // Máximo 4 campos en el resumen
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

// Exponer funciones al scope global para los onclick inline
window.eliminarCotizacion = eliminarCotizacion;
window.limpiarHistorial   = limpiarHistorial;