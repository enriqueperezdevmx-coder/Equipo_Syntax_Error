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
  });

  // 2. Manejar el evento de envío (Submit)
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    const formData = {};

    const activeTabButton = document.querySelector('.nav-link.active');
    
    if (activeTabButton) {
        const tipoEnvio = activeTabButton.querySelector('.fw-bold').textContent.trim();
        formData['Tipo de Servicio'] = tipoEnvio;
    }

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
    localStorage.setItem('cotizacionEnvio', JSON.stringify(formData));

    alert('¡Cotización guardada exitosamente en LocalStorage!');
    console.log('Datos guardados:', formData);
  });
});