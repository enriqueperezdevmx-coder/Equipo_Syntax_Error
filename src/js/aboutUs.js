import '../css/aboutUs.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const valores = [
    {
        titulo: "Responsabilidad",
        descripcion: "Cumplimos cada entrega de manera segura, eficiente y dentro del tiempo acordado, actuando con profesionalismo en cada servicio.",
        icon: "bi-shield-check" //icono de responsabilidad
    },
    {
        titulo: "Puntualidad",
        descripcion: "Valoramos el tiempo de nuestros clientes, garantizando entregas oportunas y un servicio confiable.",
        icon: "bi-clock-history" //icono de reloj
    },
    {
        titulo: "Compromiso",
        descripcion: "Trabajamos con dedicación para brindar soluciones de mensajería de calidad que satisfagan las necesidades de nuestros clientes.",
        icon: "bi-hand-thumbs-up" //icono de pulgar arriba
    },
    {
        titulo: "Confianza",
        descripcion: "Manejamos cada envío con honestidad, cuidado y transparencia, generando seguridad en cada entrega.",
        icon: "bi-heart-fill" //icono de corazon
    },
    {
        titulo: "Respeto",
        descripcion: "Mantenemos una relación basada en la amabilidad, la empatía y el profesionalismo con clientes, colaboradores y socios.",
        icon: "bi-people-fill" // Icono de personas
    },
    {
        titulo: "Eficiencia",
        descripcion: "Optimizamos nuestros procesos para realizar entregas rápidas, organizadas y efectivas, ofreciendo un servicio ágil y de calidad.",
        icon: "bi-lightning-charge" //icono de rayo
    }
];


//Mi logica para las cards y como hacer que su descripcion sean deslizables
const container = document.getElementById("cards-container");
const row = document.createElement("div");
row.className = "row g-4 justify-content-center";

valores.forEach((valor) => {
    const col = document.createElement("div");
    col.className = "col-12 col-md-6 col-lg-4";

    const card = document.createElement("div");
    card.className = "card value-card border-0 text-center h-100 shadow-sm";

    card.innerHTML = `
        <div class="card-body">
            <div class="icon-container mb-3">
                <i class="bi ${valor.icon} fs-1 text-success"></i>
            </div>
            <h4 class="fw-bold mb-3 card-title">${valor.titulo}</h4>
            <p class="card-text text-muted card-desc">${valor.descripcion}</p>
        </div>
    `;

    // Eventos para hover
    card.addEventListener('mouseenter', () => {
        card.classList.add('hover-active');
    });

    card.addEventListener('mouseleave', () => {
        card.classList.remove('hover-active');
    });

    col.appendChild(card);
    row.appendChild(col);
});

container.appendChild(row);