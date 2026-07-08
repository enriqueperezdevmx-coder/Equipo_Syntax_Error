const STORAGE = "carrito";

document.addEventListener("DOMContentLoaded", () => {

    renderizarCarrito();

});

function obtenerCarrito(){

    return JSON.parse(localStorage.getItem(STORAGE)) || [];

}


function guardarCarrito(carrito){

    localStorage.setItem(STORAGE, JSON.stringify(carrito));

}


// =========================
// MOSTRAR CARRITO
// =========================

function renderizarCarrito(){

    const listaCarrito = document.getElementById("lista-carrito");
    const totalServicios = document.getElementById("total-servicios");
    const subtotal = document.getElementById("subtotal");
    const btnPagar = document.getElementById("btn-pagar");


    let carrito = obtenerCarrito();


    if(carrito.length === 0){

        listaCarrito.innerHTML = `
            <div class="alert alert-info">
                Tu carrito está vacío.
            </div>
        `;

        totalServicios.textContent = 0;
        subtotal.textContent = "$0";
        btnPagar.disabled = true;

        return;
    }


    let total = 0;
    let cantidadServicios = 0;


    listaCarrito.innerHTML = "";


    carrito.forEach(servicio => {


        total += servicio.precio * servicio.cantidad;
        cantidadServicios += servicio.cantidad;


        listaCarrito.innerHTML += `

        <div class="card mb-3">

            <div class="card-body d-flex justify-content-between align-items-center">

                <div>

                    <h5>${servicio.nombre}</h5>

                    <p>
                        Precio: $${servicio.precio}
                    </p>

                    <p>
                        Cantidad: ${servicio.cantidad}
                    </p>

                </div>


                <div>

                    <button class="btn btn-sm btn-success"
                    onclick="aumentar('${servicio.nombre}')">
                    +
                    </button>


                    <button class="btn btn-sm btn-warning"
                    onclick="disminuir('${servicio.nombre}')">
                    -
                    </button>


                    <button class="btn btn-sm btn-danger"
                    onclick="eliminar('${servicio.nombre}')">
                    Eliminar
                    </button>

                </div>

            </div>

        </div>

        `;


    });


    totalServicios.textContent = cantidadServicios;

    subtotal.textContent = `$${total}`;

    btnPagar.disabled = false;

}


// =========================
// AGREGAR SERVICIO
// =========================

function agregarServicio(servicio){

    let carrito = obtenerCarrito();


    const existe = carrito.find(
        item => item.nombre === servicio.nombre
    );


    if(existe){

        if(existe.cantidad < 3){

            existe.cantidad++;

        }

    }else{

        carrito.push({

            ...servicio,

            cantidad:1

        });

    }

    guardarCarrito(carrito);

}


window.agregarServicio = agregarServicio;


// =========================
// AUMENTAR
// =========================

function aumentar(nombre){

    let carrito = obtenerCarrito();


    carrito = carrito.map(item => {


        if(item.nombre === nombre && item.cantidad < 3){

            item.cantidad++;
        }
        return item;
    });
    guardarCarrito(carrito);
    renderizarCarrito();
}
window.aumentar = aumentar;



// =========================
// DISMINUIR
// =========================
function disminuir(nombre){
    let carrito = obtenerCarrito();
    carrito = carrito.map(item=>{
        if(item.nombre === nombre){
            item.cantidad--;
        }
        return item;
    }).filter(item=>item.cantidad>0);
    guardarCarrito(carrito);
    renderizarCarrito();
}
window.disminuir = disminuir;
// =========================
// ELIMINAR
// =========================
function eliminar(nombre){
    let carrito = obtenerCarrito();
    carrito = carrito.filter(
        item => item.nombre !== nombre
    );
    guardarCarrito(carrito);
    renderizarCarrito();
}
window.eliminar = eliminar;
// =========================
// PAGAR
// =========================
document.getElementById("btn-pagar")?.addEventListener("click",()=>{
    window.location.href="../pago/pago.html";
});
