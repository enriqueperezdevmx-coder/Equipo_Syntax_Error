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

const container = document.getElementById("cards-container");

// 1. Crear la fila (row)
const row = document.createElement("div");
row.className = "row g-4 justify-content-center";

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
            </div>
        </div>
    `;

    row.appendChild(col);
});

//Se agrega la fila completa al contenedor principal
container.appendChild(row);