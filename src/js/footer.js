// async function cargarFooter() {
//   const res = await fetch('/src/componentes/navbar/footer.html');
//   const html = await res.text();
//   document.getElementById('footer').innerHTML = html;
// }

// cargarFooter();

async function cargarFooter() {
  try {
    const res = await fetch("/src/componentes/navbar/footer.html");
    const html = await res.text();

    const footerContainer = document.getElementById("footer");
    footerContainer.innerHTML = html;

    inicializarEstilosYAnimaciones();
  } catch (error) {
    console.error("Error al cargar el footer:", error);
  }
}

function inicializarEstilosYAnimaciones() {
  const footerElement = document.querySelector("footer");
  if (!footerElement) return;

  const verdeFigma = "#70c054";
  const verdeHover = "#4a9e2f";

  // 1. Estilos generales del contenedor del Footer (Fondo blanco, tipografía uniforme)
  Object.assign(footerElement.style, {
    backgroundColor: "#ffffff",
    padding: "40px 0 20px 0",
    fontFamily: "Arial, sans-serif",
    borderTop: "1px solid #eaeaea",
  });

  // Alínea verticalmente todas las columnas en medio (como se ve en Figma)
  const row = footerElement.querySelector(".row");
  if (row) {
    row.style.alignItems = "center";
  }

  // 2. Aplicar color Verde Figma a los títulos y textos informativos
  footerElement
    .querySelectorAll(".fg-title, .fg-text, .fg-bottom-bar p")
    .forEach((el) => {
      el.style.color = verdeFigma;
    });

  // 3. Quitar estilos por defecto a las listas y enlaces
  footerElement.querySelectorAll("ul").forEach((ul) => {
    ul.style.listStyle = "none";
    ul.style.padding = "0";
    ul.style.margin = "0";
  });

  footerElement.querySelectorAll("a").forEach((a) => {
    a.style.color = verdeFigma;
    a.style.textDecoration = "none";
  });

  // ==========================================
  // ANIMACIONES PURAS CON JAVASCRIPT (DOM)
  // ==========================================

  // Animación 1: Hover en los enlaces de Servicios y Nosotros (Elevación + Cambio de color)
  const links = footerElement.querySelectorAll(".fg-list a");
  links.forEach((link) => {
    link.style.display = "inline-block";
    link.style.transition = "transform 0.2s ease, color 0.2s ease";

    link.onmouseenter = () => {
      link.style.color = verdeHover;
      link.style.transform = "translateY(-2px)"; // Pequeña elevación profesional
    };
    link.onmouseleave = () => {
      link.style.color = verdeFigma;
      link.style.transform = "translateY(0)";
    };
  });

  // Animación 2: Micro-interacción en la lista de Contacto (Efecto en los Iconos de Bootstrap)
  const contactItems = footerElement.querySelectorAll(".fg-contact-item");
  contactItems.forEach((item) => {
    const icon = item.querySelector("i");
    if (icon) {
      icon.style.display = "inline-block";
      icon.style.marginRight = "10px";
      icon.style.transition =
        "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"; // Efecto elástico

      item.onmouseenter = () => {
        icon.style.transform = "scale(1.3) rotate(-10deg)"; // Agranda y rota levemente
      };
      item.onmouseleave = () => {
        icon.style.transform = "scale(1) rotate(0deg)";
      };
    }
  });

  // Animación 3: Fade-In (Revelado suave) al terminar de cargar el componente
  footerElement.style.opacity = "0";
  footerElement.style.transform = "translateY(10px)";
  footerElement.style.transition =
    "opacity 0.6s ease-out, transform 0.6s ease-out";

  setTimeout(() => {
    footerElement.style.opacity = "1";
    footerElement.style.transform = "translateY(0)";
  }, 50);
}

// Ejecutar la carga
cargarFooter();
