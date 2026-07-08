// Importamos el HTML del footer
import footerHTML from '../componentes/navbar/footer.html?raw';
function cargarFooter() {
  const container = document.getElementById('footer');
  if (!container) return;
  
  // Inyectamos el HTML al instante
  container.innerHTML = footerHTML;
}

cargarFooter();