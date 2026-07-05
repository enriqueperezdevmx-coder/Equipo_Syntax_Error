const STORAGE = "carrito";

document.addEventListener("DOMContentLoaded", () => {

    renderizarCarrito();

});

function obtenerCarrito(){

    return JSON.parse(localStorage.getItem(STORAGE)) || [];

}

function guardarCarrito(carrito){

    localStorage.setItem(STORAGE,JSON.stringify(carrito));

}

function agregarServicio(servicio){

    let carrito = obtenerCarrito();

    const existe = carrito.find(item=>item.nombre===servicio.nombre);

    if(existe){

        if(existe.cantidad<3){

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

window.agregarServicio=agregarServicio;

function aumentar(nombre){

    let carrito=obtenerCarrito();

    carrito=carrito.map(item=>{

        if(item.nombre===nombre && item.cantidad<3){

            item.cantidad++;

        }

        return item;

    });

    guardarCarrito(carrito);

    renderizarCarrito();

}

function disminuir(nombre){

    let carrito=obtenerCarrito();

    carrito=carrito.map(item=>{

        if(item.nombre===nombre){

            item.cantidad--;

        }

        return item;

    }).filter(item=>item.cantidad>0);

    guardarCarrito(carrito);

    renderizarCarrito();

}

function eliminar(nombre){

    let carrito=obtenerCarrito();

    carrito=carrito.filter(item=>item.nombre!==nombre);

    guardarCarrito(carrito);

    renderizarCarrito();

}

function eliminar(nombre){

    let carrito=obtenerCarrito();

    carrito=carrito.filter(item=>item.nombre!==nombre);

    guardarCarrito(carrito);

    renderizarCarrito();

}

//Hacer publicas las funciones

window.aumentar=aumentar;

window.disminuir=disminuir;

window.eliminar=eliminar;

//pagar carrito

document.getElementById("btn-pagar")?.addEventListener("click",()=>{

    window.location.href="/src/pages/pago/pago.html";

});

