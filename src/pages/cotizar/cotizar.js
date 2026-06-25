/**
 * Lógica de cotización, validación y almacenamiento
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-cotizacion');

<<<<<<< .merge_file_El4E3D
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
    const btnServicio = document.querySelector(mapaServicios[servicio]);
    if (btnServicio) {
      const tab = new bootstrap.Tab(btnServicio);
      tab.show();
    }
  }
  // ── Fin preselección ──

  // 1. Quitar el borde rojo cuando el usuario empiece a escribir
  form.addEventListener('input', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      e.target.classList.remove('is-invalid');
    }
=======
  // EXTRA: Limpiar los bordes rojos/verdes si el usuario cambia de pestaña
  const tabButtons = document.querySelectorAll('button[data-bs-toggle="pill"]');
  tabButtons.forEach(button => {
      button.addEventListener('shown.bs.tab', () => {
          form.classList.remove('was-validated'); 
      });
>>>>>>> .merge_file_LnTAVg
  });

  // ==========================================
  // AUTOCOMPLETADO DE CÓDIGO POSTAL (API Zippopotam)
  // ==========================================
  const cpInputs = document.querySelectorAll('.cp-input');

  cpInputs.forEach(input => {
      input.addEventListener('input', async (e) => {
          const cp = e.target.value;
          
          // Solo disparamos el fetch si el usuario tecleó exactamente 5 números
          if (cp.length === 5 && /^[0-9]+$/.test(cp)) {
              
              // Buscamos el contenedor padre (.bloque-direccion) para no afectar el Destino si editamos el Origen
              const bloque = e.target.closest('.bloque-direccion');
              const inputEstado = bloque.querySelector('.estado-input');
              const selectColonia = bloque.querySelector('.colonia-select');

              // Indicadores visuales de carga
              inputEstado.value = "Buscando...";
              selectColonia.innerHTML = '<option value="">Cargando colonias...</option>';

              try {
                  // Petición a la API pública
                  const response = await fetch(`https://api.zippopotam.us/mx/${cp}`);
                  
                  if (!response.ok) throw new Error('Código Postal no encontrado en la base de datos');
                  
                  const data = await response.json();
                  
                  // --- INICIO DEL PARCHE PARA EL DISTRITO FEDERAL ---
                  let nombreEstado = data.places[0].state;

                  // Si la API dice "Distrito Federal", lo cambiamos a la fuerza
                  if (nombreEstado.includes('Distrito Federal')) {
                      nombreEstado = 'Ciudad de México';
                  }

                  // Llenamos el input bloqueado del Estado con el dato ya corregido
                  inputEstado.value = nombreEstado;
                  // --- FIN DEL PARCHE ---

                  // Limpiamos el select y lo llenamos con el array de colonias devuelto
                  selectColonia.innerHTML = '<option value="">Selecciona tu colonia</option>';
                  data.places.forEach(place => {
                      const option = document.createElement('option');
                      option.value = place['place name'];
                      option.textContent = place['place name'];
                      selectColonia.appendChild(option);
                  });

              } catch (error) {
                  // Reseteamos en caso de error
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
<<<<<<< .merge_file_El4E3D
    e.preventDefault();
=======
    // 1. Prevenir el envío inmediato para poder validar con JS
    e.preventDefault(); 
>>>>>>> .merge_file_LnTAVg

    // 2. Obtener el panel activo (el que el usuario está viendo)
    const activePanel = document.querySelector('.tab-pane.active');
    if (!activePanel) return;

    // 3. Extraer SOLO los inputs Y SELECTS del panel activo
    const elementosActivos = activePanel.querySelectorAll('input, select');
    let formValido = true;

<<<<<<< .merge_file_El4E3D
=======
    // Revisar la validación nativa (required, pattern, min, max) SOLO en los visibles
    elementosActivos.forEach(elemento => {
        if (!elemento.checkValidity()) {
            formValido = false;
        }
    });

    // Aplicar la clase de Bootstrap para que pinte de rojo/verde los inputs
    form.classList.add('was-validated');

    // 4. Si hay algún error en el panel actual, mostramos alerta y detenemos
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

    // 5. Si todo es válido, procedemos a recopilar los datos
    const formData = {};
>>>>>>> .merge_file_LnTAVg
    const activeTabButton = document.querySelector('.nav-link.active');
    
    if (activeTabButton) {
      const tipoEnvio = activeTabButton.querySelector('.fw-bold').textContent.trim();
      formData['Tipo de Servicio'] = tipoEnvio;
    }

<<<<<<< .merge_file_El4E3D
    const activePanel = document.querySelector('.tab-pane.active');
    
    if (!activePanel) return;

    const inputs = activePanel.querySelectorAll('input');

    // 3. Validar que no estén vacíos
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

    // 4. Guardar en LocalStorage
=======
    // Guardamos los valores ingresados
    elementosActivos.forEach(elemento => {
        const label = elemento.previousElementSibling;
        const nombreCampo = label ? label.textContent.trim() : (elemento.placeholder || 'Colonia');
        formData[nombreCampo] = elemento.value.trim();
    });

    // 6. Guardar en LocalStorage
>>>>>>> .merge_file_LnTAVg
    localStorage.setItem('cotizacionEnvio', JSON.stringify(formData));
    console.log('Datos listos para enviar:', formData);

<<<<<<< .merge_file_El4E3D
    alert('¡Cotización guardada exitosamente en LocalStorage!');
    console.log('Datos guardados:', formData);
=======
    // 7. Alerta de ÉXITO profesional (SweetAlert2)
    Swal.fire({
        icon: 'success',
        title: '¡Cotización exitosa!',
        text: 'Tu pedido ha sido generado correctamente y tus datos están protegidos.',
        confirmButtonColor: '#0DA74A', 
        confirmButtonText: 'Entendido'
    }).then((result) => {
        // Cuando el usuario cierra la alerta, limpiamos el formulario para uno nuevo
        if (result.isConfirmed) {
            form.reset();
            form.classList.remove('was-validated'); 
            
            // Limpiar manualmente las opciones de los selects para que no se queden las colonias viejas
            const selects = document.querySelectorAll('.colonia-select');
            selects.forEach(select => {
                select.innerHTML = '<option value="">Ingresa tu CP primero...</option>';
            });
        }
    });
>>>>>>> .merge_file_LnTAVg
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