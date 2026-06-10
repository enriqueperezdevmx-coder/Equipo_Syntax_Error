document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("contenedor-historial");

  // 1. Leer el array acumulado desde LocalStorage
  const historialPedidos =
    JSON.parse(localStorage.getItem("historialPedidos")) || [];

  // 2. Si el usuario no ha hecho ninguna cotización, mostramos un mensaje amigable
  if (historialPedidos.length === 0) {
    contenedor.innerHTML = `
            <div class="col-12 text-center py-5">
                <p class="fs-5 mensaje-vacio">Aún no tienes servicios solicitados.</p>
                <a href="../cotizar/cotizar.html" class="btn text-white px-4 py-2 rounded-3 fw-medium boton-cotizar-vacio">
                    Cotizar mi primer envío
                </a>
            </div>
        `;
    return;
  }

  // 3. Si hay datos, preparar la inyección dinámica
  contenedor.innerHTML = "";
  const columnaPrincipal = document.createElement("div");
  columnaPrincipal.className = "col-12 px-4 px-md-5";

  // 4. Ciclo para dibujar cada registro guardado
  historialPedidos.forEach((pedido) => {
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
                    <p class="mb-0">No. de Guía: 
                        <a href="#" class="text-dark fw-bold text-decoration-underline" onclick="copiarGuia(event, '${pedido.numGuia}')">
                            ${pedido.numGuia} (Clic para copiar)
                        </a>
                    </p>
                </div>
                
                <div class="col-12 col-md-4 d-flex flex-column flex-sm-row justify-content-md-end align-items-center gap-3">
                    <a href="#" class="text-dark fw-bold text-decoration-underline small enlace-volver-pedir">(Volver a pedir)</a>
                    <button class="btn px-4 text-white rounded-3 fw-medium boton-ver">Ver</button>
                </div>
            </div>
        `;

    columnaPrincipal.innerHTML += tarjetaPedidoHTML;
  });

  contenedor.appendChild(columnaPrincipal);
});

// Función nativa para el portapapeles
function copiarGuia(event, numeroGuia) {
  event.preventDefault();
  navigator.clipboard
    .writeText(numeroGuia)
    .then(() => {
      alert(`Número de guía ${numeroGuia} copiado al portapapeles.`);
    })
    .catch((err) => {
      console.error("No se pudo copiar el texto automáticamente: ", err);
    });
}
