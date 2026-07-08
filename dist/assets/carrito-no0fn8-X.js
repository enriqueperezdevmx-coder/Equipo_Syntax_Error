import{n as e,r as t,t as n}from"./footer-CjuA6v9J.js";var r=t((()=>{var e=`carrito`;document.addEventListener(`DOMContentLoaded`,()=>{r()});function t(){return JSON.parse(localStorage.getItem(e))||[]}function n(t){localStorage.setItem(e,JSON.stringify(t))}function r(){let e=document.getElementById(`lista-carrito`),n=document.getElementById(`total-servicios`),r=document.getElementById(`subtotal`),i=document.getElementById(`btn-pagar`),a=t();if(a.length===0){e.innerHTML=`
            <div class="alert alert-info">
                Tu carrito está vacío.
            </div>
        `,n.textContent=0,r.textContent=`$0`,i.disabled=!0;return}let o=0,s=0;e.innerHTML=``,a.forEach(t=>{o+=t.precio*t.cantidad,s+=t.cantidad,e.innerHTML+=`

        <div class="card mb-3">

            <div class="card-body d-flex justify-content-between align-items-center">

                <div>

                    <h5>${t.nombre}</h5>

                    <p>
                        Precio: $${t.precio}
                    </p>

                    <p>
                        Cantidad: ${t.cantidad}
                    </p>

                </div>


                <div>

                    <button class="btn btn-sm btn-success"
                    onclick="aumentar('${t.nombre}')">
                    +
                    </button>


                    <button class="btn btn-sm btn-warning"
                    onclick="disminuir('${t.nombre}')">
                    -
                    </button>


                    <button class="btn btn-sm btn-danger"
                    onclick="eliminar('${t.nombre}')">
                    Eliminar
                    </button>

                </div>

            </div>

        </div>

        `}),n.textContent=s,r.textContent=`$${o}`,i.disabled=!1}function i(e){let r=t(),i=r.find(t=>t.nombre===e.nombre);i?i.cantidad<3&&i.cantidad++:r.push({...e,cantidad:1}),n(r)}window.agregarServicio=i;function a(e){let i=t();i=i.map(t=>(t.nombre===e&&t.cantidad<3&&t.cantidad++,t)),n(i),r()}window.aumentar=a;function o(e){let i=t();i=i.map(t=>(t.nombre===e&&t.cantidad--,t)).filter(e=>e.cantidad>0),n(i),r()}window.disminuir=o;function s(e){let i=t();i=i.filter(t=>t.nombre!==e),n(i),r()}window.eliminar=s,document.getElementById(`btn-pagar`)?.addEventListener(`click`,()=>{window.location.href=`../pago/pago.html`})}));e(),n(),r();