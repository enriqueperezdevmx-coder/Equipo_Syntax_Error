const { resolve } = require('path');
const { defineConfig } = require('vite');

// Configuración Multipágina (MPA) limpia para Syntax Logistics.
// Ya no se requiere 'vite-plugin-static-copy' porque las imágenes viven en /public 
// y los scripts usan type="module", permitiendo que Vite los empaquete de forma nativa.
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        aboutUs: resolve(__dirname, 'src/pages/aboutUs.html'),
        carrito: resolve(__dirname, 'src/pages/carrito/carrito.html'),
        contacto: resolve(__dirname, 'src/pages/contacto/contacto.html'),
        cotizar: resolve(__dirname, 'src/pages/cotizar/cotizar.html'),
        historial: resolve(__dirname, 'src/pages/historial/historial.html'),
        inicio: resolve(__dirname, 'src/pages/inicio/inicio.html'),
        pago: resolve(__dirname, 'src/pages/pago/pago.html'),
        rastreo: resolve(__dirname, 'src/pages/rastreo/rastreo.html'),
        registro: resolve(__dirname, 'src/pages/registro/registro.html'),
        servicios: resolve(__dirname, 'src/pages/servicios/servicios.html'),
        catalogoCompartido: resolve(__dirname, 'src/pages/servicios/catalogo/compartido.html'),
        catalogoExclusivo: resolve(__dirname, 'src/pages/servicios/catalogo/exclusivo.html'),
        catalogoExpress: resolve(__dirname, 'src/pages/servicios/catalogo/express.html'),
        catalogoExtraordinario: resolve(__dirname, 'src/pages/servicios/catalogo/extraordinario.html'),
      },
    },
  },
});