const { resolve } = require('path');
const { defineConfig } = require('vite');
const { viteStaticCopy } = require('vite-plugin-static-copy');

// Esta es una app multipágina real (sin framework): cada página HTML se navega
// con <a href>, no con un router de JS. Por default Vite solo empaqueta el
// index.html de la raíz, así que aquí declaramos las 14 páginas reales como
// entradas de rollupOptions.input para que `npm run build` las incluya todas.
export default defineConfig({
  server: {
    // En dev, el front corre en Vite (5173) y el back en Spring Boot (8080).
    // Sin este proxy, fetch("/api/...") pega contra el propio Vite y nunca
    // llega al backend real (esto era lo que rompía el registro/login).
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        aboutUs: resolve(__dirname, 'src/pages/aboutUs.html'),
        carrito: resolve(__dirname, 'src/pages/carrito/carrito.html'),
        contacto: resolve(__dirname, 'src/pages/contacto/contacto.html'),
        cotizar: resolve(__dirname, 'src/pages/cotizar/cotizar.html'),
        historial: resolve(__dirname, 'src/pages/historial/historial.html'),
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
  plugins: [
    viteStaticCopy({
      targets: [
        // Fragmentos HTML que se cargan en runtime con fetch() (navbar, footer,
        // inicio) — no son entradas de Vite, así que hay que copiarlos a mano
        // a la misma ruta exacta desde la que se hace el fetch en producción.
        // dest: '.' porque el plugin ya preserva la ruta relativa de "src" tal
        // cual dentro de dist/ (si le ponemos una carpeta la duplica).
        { src: 'src/assets/*', dest: '.' },
        { src: 'src/componentes/navbar/navbar.html', dest: '.' },
        { src: 'src/api/servicioUsuario.js', dest: '.' },
        { src: 'src/componentes/navbar/footer.html', dest: '.' },
        { src: 'src/pages/inicio/inicio.html', dest: '.' },
        { src: 'src/css/variables.css', dest: '.' },
        { src: 'src/css/navbar.css', dest: '.' },
        { src: 'src/css/footer.css', dest: '.' },
        { src: 'src/css/layout.css', dest: '.' },
        { src: 'src/pages/inicio/inicio.css', dest: '.' },
        { src: 'src/js/sesion.js', dest: '.' },



        // Scripts clásicos (sin type="module") que varias páginas cargan con
        // <script src="..."> normal. Vite no los detecta ni los empaqueta
        // automáticamente porque no son ni entradas ni imports de ES modules.
        { src: 'src/js/navbar.js', dest: '.' },
        { src: 'src/js/footer.js', dest: '.' },
        { src: 'src/pages/contacto/contacto.js', dest: '.' },
        { src: 'src/pages/servicios/servicios.js', dest: '.' },
        { src: 'src/pages/servicios/catalogo/catalogo.js', dest: '.' },
        { src: 'src/pages/carrito/carrito.js', dest: '.' },
        { src: 'src/pages/cotizar/cotizar.js', dest: '.' },
        { src: 'src/pages/rastreo/rastreo.js', dest: '.' },
        { src: 'src/pages/pago/pago.js', dest: '.' },
      ],
    }),
  ],
});