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

  // 1. Quitar el borde rojo cuando el usuario empiece a escribir
  form.addEventListener('input', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      e.target.classList.remove('is-invalid');
    }
  });

  // 2. Manejar el evento de envío (Submit)
  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita que la página se recargue

    let isValid = true;
    const formData = {};

    // Obtener la pestaña (tipo de envío) que está activa actualmente
    const activeTabButton = document.querySelector('.nav-link.active');
    
    // Validar si realmente hay una pestaña activa (por si acaso)
    if (activeTabButton) {
        const tipoEnvio = activeTabButton.querySelector('.fw-bold').textContent.trim();
        formData['Tipo de Servicio'] = tipoEnvio;
    }

    // Obtener solo el panel de contenido que está visible
    const activePanel = document.querySelector('.tab-pane.active');
    
    if (!activePanel) return; // Si no hay panel activo, no hace nada

    // Buscar todos los inputs dentro de ese panel visible
    const inputs = activePanel.querySelectorAll('input');

    // 3. Validar que no estén vacíos
    inputs.forEach(input => {
      if (input.value.trim() === '') {
        input.classList.add('is-invalid'); // Clase de Bootstrap para pintar en rojo
        isValid = false;
      } else {
        input.classList.remove('is-invalid');
        
        // Usar el texto de la etiqueta (<label>) como nombre para guardar en localStorage
        const label = input.previousElementSibling;
        const nombreCampo = label ? label.textContent.trim() : input.placeholder;
        
        // Guardar el valor en nuestro objeto
        formData[nombreCampo] = input.value.trim();
      }
    });

    // Si falta algún campo, detenemos el proceso
    if (!isValid) {
      alert('Por favor, completa todos los campos marcados en rojo.');
      return; 
    }

    // 4. Si todo está correcto, guardamos en LocalStorage
    localStorage.setItem('cotizacionEnvio', JSON.stringify(formData));

    // Mostrar éxito
    alert('¡Cotización guardada exitosamente en LocalStorage!');
    console.log('Datos guardados:', formData);
    
    // Opcional: limpiar el formulario después de enviar
    // form.reset(); 
  });
});