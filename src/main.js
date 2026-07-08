// 1. Importamos el HTML de la página de inicio como texto plano
import inicioHTML from './pages/inicio/inicio.html?raw';
// 2. Buscamos el contenedor en el index.html
const inicioContainer = document.getElementById('inicio-container');

// 3. Si el contenedor existe en esta página, le inyectamos todo el contenido
if (inicioContainer) {
    inicioContainer.innerHTML = inicioHTML;
}