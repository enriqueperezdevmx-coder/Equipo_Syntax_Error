import '../css/aboutUs.css'; //Se importaron los estilos de aboutUs
import 'bootstrap-icons/font/bootstrap-icons.css'; //importo los iconos de bootstrap


//Arrays con la informacion para las cards de aboutUs.html

const valores = [
    {
        titulo : "Responsabilidad",
        descripcion : "Cumplimos cada entrega de manera segura, eficiente y dentro del tiempo acordado.",
        icon: "bi-shield-check" //Icono de escudo
    },
    {
        titulo : "Puntualidad",
        descripcion : "Valoramos el tiempo de nuestros clientes garantizando entregas oportunas.",
        icon: "bi-clock-history" //icono de reloj
    },
    {
        titulo : "Compromiso",
        descripcion : "Trabajamos con dedicación para brindar soluciones de mensajería de calidad.",
        icon: "bi-hand-thumbs-up" //icono de pulgar arriba
    },
    {
        titulo : "Confianza",
        descripcion : "Manejamos una relación basada en la amabilidad y el profesionalismo",
        icon: "bi-heart-fill" //icono de corazon
    },
    {
        titulo : "Eficiencia",
        descripcion : "Optimizamos nuestroc procesos para realizar entregas rápidas y efectivas.",
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