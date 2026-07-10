document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-cotizacion');

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

  const tabButtons = document.querySelectorAll('button[data-bs-toggle="pill"]');
  tabButtons.forEach(button => {
    button.addEventListener('shown.bs.tab', () => {
      form.classList.remove('was-validated');
    });
  });

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

  const mapaServiceType = {
    'Express': 'EXPRESS',
    'Compartido': 'SHARED',
    'Exclusivo': 'EXCLUSIVE',
    'Extraordinario': 'EXTRAORDINARY',
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const activePanel = document.querySelector('.tab-pane.active');
    if (!activePanel) return;

    const elementosActivos = activePanel.querySelectorAll('input, select');
    let formValido = true;
    elementosActivos.forEach(elemento => {
      if (!elemento.checkValidity()) formValido = false;
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

    // --- Sesión: necesitamos el userId ---
    const sesionRaw = localStorage.getItem('sesionActiva');
    const sesion = sesionRaw ? JSON.parse(sesionRaw) : null;

    if (!sesion || !sesion.id) {
      Swal.fire({
        icon: 'warning',
        title: 'Necesitas iniciar sesión',
        text: 'Debes iniciar sesión para poder cotizar un envío.',
        confirmButtonColor: '#0DA74A'
      });
      return;
    }

    const activeTabButton = document.querySelector('#categorias-envio .nav-link.active');
    const tipoEnvioVisible = activeTabButton.querySelector('.fw-bold').textContent.trim();
    const serviceType = mapaServiceType[tipoEnvioVisible];

    // --- Armar el request EXACTO que pide el backend (NewQuoteRequest) ---
    const bloques = activePanel.querySelectorAll('.bloque-direccion');
    const bloqueOrigen = bloques[0];
    const bloqueDestino = bloques[1];

    const cpOrigen = bloqueOrigen.querySelector('.cp-input').value.trim();
    const colOrigen = bloqueOrigen.querySelector('.colonia-select').value.trim();
    const calleOrigen = activePanel.querySelector('.calle-origen-input').value.trim();

    const cpDestino = bloqueDestino.querySelector('.cp-input').value.trim();
    const colDestino = bloqueDestino.querySelector('.colonia-select').value.trim();
    const calleDestino = activePanel.querySelector('.calle-destino-input').value.trim();

    const peso = parseFloat(activePanel.querySelector('.peso-input').value);
    const alto = parseFloat(activePanel.querySelector('.alto-input').value);
    const largo = parseFloat(activePanel.querySelector('.largo-input').value);
    const ancho = parseFloat(activePanel.querySelector('.ancho-input').value);

    const nuevaCotizacion = {
      userId: sesion.id,
      originAddress: `${calleOrigen}, Col. ${colOrigen}, CP ${cpOrigen}`,
      destinationAddress: `${calleDestino}, Col. ${colDestino}, CP ${cpDestino}`,
      weight: peso,
      length: largo,
      width: ancho,
      height: alto,
      serviceType: serviceType,
    };

    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaCotizacion),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const mensaje = data?.message || 'Error al guardar la cotización';
        throw new Error(mensaje);
      }

      // Para el modal usamos el precio que ya calculábamos localmente
      const precio = calcularPrecio(tipoEnvioVisible, { peso, alto, largo, ancho });
      mostrarModalPrecio({ tipoServicio: tipoEnvioVisible, precio, quoteId: data.id });

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'No se pudo enviar la cotización',
        text: error.message || 'Intenta de nuevo más tarde.',
      });
    }
  });
});

const BASE_POR_SERVICIO = {
  'Express': 120, 'Compartido': 80, 'Exclusivo': 340, 'Extraordinario': 800,
};
const COSTO_POR_KG_FACTURABLE = {
  'Express': 8, 'Compartido': 5, 'Exclusivo': 15, 'Extraordinario': 25,
};

function calcularPrecio(tipoEnvio, { peso, alto, largo, ancho }) {
  const base = BASE_POR_SERVICIO[tipoEnvio] ?? 100;
  const costoPorKg = COSTO_POR_KG_FACTURABLE[tipoEnvio] ?? 10;
  const pesoVolumetrico = (alto * largo * ancho) / 5000;
  const pesoFacturable = Math.max(peso, pesoVolumetrico);
  return Math.round(base + pesoFacturable * costoPorKg);
}

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
    window.location.href = '/src/pages/carrito/carrito.html';
  });
}

function agregarCotizacionAlCarrito(cotizacion) {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const existe = carrito.find(item => item.nombre === cotizacion.tipoServicio);
  if (existe) {
    if (existe.cantidad < 3) existe.cantidad++;
  } else {
    carrito.push({ nombre: cotizacion.tipoServicio, precio: cotizacion.precio, cantidad: 1 });
  }
  localStorage.setItem('carrito', JSON.stringify(carrito));
}