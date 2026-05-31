<<<<<<< Updated upstream
import '../css/aboutUs.css'; //Se importaron los estilos de aboutUs
import 'bootstrap-icons/font/bootstrap-icons.css'; //importo los iconos de bootstrap


//Arrays con la informacion para las cards de aboutUs.html

const valores = [
    {
        titulo : "Responsabilidad",
        descripcion : "Cumplimos cada entrega de manera segura, eficiente y dentro del tiempo acordado, actuando con profesionalismo en cada servicio.",
        icon: "bi-shield-check" //Icono de escudo
    },
    {
        titulo : "Puntualidad",
        descripcion : "Valoramos el tiempo de nuestros clientes, garantizando entregas oportunas y un servicio confiable.",
        icon: "bi-clock-history" //icono de reloj
    },
    {
        titulo : "Compromiso",
        descripcion : "Trabajamos con dedicación para brindar soluciones de mensajería de calidad que satisfagan las necesidades de nuestros clientes.",
        icon: "bi-hand-thumbs-up" //icono de pulgar arriba
    },
    {
        titulo : "Confianza",
        descripcion : "Manejamos cada envío con honestidad, cuidado y transparencia, generando seguridad en cada entrega.",
        icon: "bi-heart-fill" //icono de corazon
    },
    {
        titulo : "Respeto",
        descripcion : "Mantenemos una relación basada en la amabilidad, la empatía y el profesionalismo con clientes, colaboradores y socios.",
        icon: "#" //icono de pendiente por definir
    },
    {
        titulo : "Eficiencia",
        descripcion : "Optimizamos nuestros procesos para realizar entregas rápidas, organizadas y efectivas, ofreciendo un servicio ágil y de calidad.",
        icon: "bi-lightning-charge" //Icono de rayo
    }
];

=======
import "../css/aboutUs.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// ============================================
// ANIMACIÓN DE BARRA CONECTORA - about-features
// ============================================

function animateConnectingLine() {
  const section = document.querySelector(".about-features");
  const line = document.querySelector(".connecting-line");
  const dots = document.querySelectorAll(".about-features .dot");

  if (!section || !line || dots.length === 0) return;

  // Calcular posición inicial (primer dot) y final (último dot)
  function getLinePositions() {
    const sectionRect = section.getBoundingClientRect();
    const firstDot = dots[0];
    const lastDot = dots[dots.length - 1];

    const firstDotRect = firstDot.getBoundingClientRect();
    const lastDotRect = lastDot.getBoundingClientRect();

    const startX =
      firstDotRect.left - sectionRect.left + firstDotRect.width / 2;
    const endX = lastDotRect.left - sectionRect.left + lastDotRect.width / 2;
    const dotY = firstDotRect.top - sectionRect.top + firstDotRect.height / 2;

    return { startX, endX, dotY };
  }

  // Estilos base de la línea
  function setupLine() {
    const { startX, endX, dotY } = getLinePositions();
    const totalWidth = endX - startX;

    Object.assign(line.style, {
      position: "absolute",
      top: `${dotY}px`,
      left: `${startX}px`,
      width: `${totalWidth}px`,
      height: "3px",
      backgroundColor: "#198754",
      transformOrigin: "left center",
      transform: "scaleX(0)",
      transition: "none",
      borderRadius: "2px",
      zIndex: "1",
    });
  }

  // Asegurar que la sección tenga position relative
  const sectionStyle = window.getComputedStyle(section);
  if (sectionStyle.position === "static") {
    section.style.position = "relative";
  }

  setupLine();

  // Recalcular en resize
  window.addEventListener("resize", () => {
    setupLine();
    // Reiniciar animación si ya fue activada
    if (line.dataset.animated === "true") {
      line.style.transition = "none";
      line.style.transform = "scaleX(1)";
    }
  });

  // Intersection Observer para disparar la animación al hacer scroll
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && line.dataset.animated !== "true") {
          line.dataset.animated = "true";

          // Pequeño delay antes de arrancar
          setTimeout(() => {
            line.style.transition =
              "transform 1.4s cubic-bezier(0.4, 0, 0.2, 1)";
            line.style.transform = "scaleX(1)";

            // Animar los dots secuencialmente
            animateDots();
          }, 200);
        }
      });
    },
    { threshold: 0.4 },
  );

  observer.observe(section);
}

function animateDots() {
  const dots = document.querySelectorAll(".about-features .dot");

  // Duración total de la línea: 1400ms + 200ms delay = 1600ms total
  // Distribuir los dots a lo largo de ese tiempo
  const totalDuration = 1400;
  const delayBase = 200;

  dots.forEach((dot, index) => {
    const dotDelay = delayBase + (totalDuration / (dots.length - 1)) * index;

    // Estilos iniciales del dot
    Object.assign(dot.style, {
      width: "12px",
      height: "12px",
      borderRadius: "50%",
      backgroundColor: "#198754",
      display: "inline-block",
      transform: "scale(0)",
      transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      position: "relative",
      zIndex: "2",
    });

    setTimeout(() => {
      dot.style.transform = "scale(1)";

      // Efecto pulse al aparecer
      setTimeout(() => {
        dot.style.boxShadow = "0 0 0 4px rgba(25, 135, 84, 0.25)";
        setTimeout(() => {
          dot.style.boxShadow = "0 0 0 0px rgba(25, 135, 84, 0)";
          dot.style.transition =
            "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.5s ease";
        }, 300);
      }, 150);
    }, dotDelay);
  });
}

// Inicializar cuando el DOM esté listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", animateConnectingLine);
} else {
  animateConnectingLine();
}

const valores = [
  {
    titulo: "Responsabilidad",
    descripcion:
      "Cumplimos cada entrega de manera segura, eficiente y dentro del tiempo acordado, actuando con profesionalismo en cada servicio.",
    icon: "bi-shield-check", //icono de responsabilidad
  },
  {
    titulo: "Puntualidad",
    descripcion:
      "Valoramos el tiempo de nuestros clientes, garantizando entregas oportunas y un servicio confiable.",
    icon: "bi-clock-history", //icono de reloj
  },
  {
    titulo: "Compromiso",
    descripcion:
      "Trabajamos con dedicación para brindar soluciones de mensajería de calidad que satisfagan las necesidades de nuestros clientes.",
    icon: "bi-hand-thumbs-up", //icono de pulgar arriba
  },
  {
    titulo: "Confianza",
    descripcion:
      "Manejamos cada envío con honestidad, cuidado y transparencia, generando seguridad en cada entrega.",
    icon: "bi-heart-fill", //icono de corazon
  },
  {
    titulo: "Respeto",
    descripcion:
      "Mantenemos una relación basada en la amabilidad, la empatía y el profesionalismo con clientes, colaboradores y socios.",
    icon: "bi-people-fill", // Icono de personas
  },
  {
    titulo: "Eficiencia",
    descripcion:
      "Optimizamos nuestros procesos para realizar entregas rápidas, organizadas y efectivas, ofreciendo un servicio ágil y de calidad.",
    icon: "bi-lightning-charge", //icono de rayo
  },
];

//Mi logica para las cards y como hacer que su descripcion sean deslizables
>>>>>>> Stashed changes
const container = document.getElementById("cards-container");

// 1. Crear la fila (row)
const row = document.createElement("div");
row.className = "row g-4 justify-content-center";

<<<<<<< Updated upstream
// 2. Renderizar las Cards
valores.forEach((valor, index) => {
    const col = document.createElement("div");
    col.className = "col-12 col-md-6 col-lg-4"; 
    
    col.innerHTML = `
        <div 
            class="card value-card border-0 text-center h-100 shadow-sm"
            data-bs-toggle="collapse"
            data-bs-target="#collapse${index}"
            role="button"
        >
            <div class="card-body">
                <div class="icon-container mb-3">
                    <i class="bi ${valor.icon} fs-1 text-success"></i>
                </div>
                <h4 class="fw-bold mb-3">${valor.titulo}</h4>
                <div id="collapse${index}" class="collapse">
                    <p class="card-text text-muted">${valor.descripcion}</p>
                </div>
=======
valores.forEach((valor) => {
  const col = document.createElement("div");
  col.className = "col-12 col-md-6 col-lg-4";

  const card = document.createElement("div");
  card.className = "card value-card border-0 text-center h-100 shadow-sm";

  card.innerHTML = `
        <div class="card-body">
            <div class="icon-container mb-3">
                <i class="bi ${valor.icon} fs-1 text-success"></i>
>>>>>>> Stashed changes
            </div>
        </div>
    `;

<<<<<<< Updated upstream
    row.appendChild(col);
});

//Se agrega la fila completa al contenedor principal
container.appendChild(row);
=======
  // Eventos para hover
  card.addEventListener("mouseenter", () => {
    card.classList.add("hover-active");
  });

  card.addEventListener("mouseleave", () => {
    card.classList.remove("hover-active");
  });

  col.appendChild(card);
  row.appendChild(col);
});

container.appendChild(row);
>>>>>>> Stashed changes
