document.addEventListener('DOMContentLoaded', () => {

  // RIPPLE
  document.querySelectorAll('.btn-cotizar').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      const ripple = document.createElement('span');
      ripple.classList.add('ripple');

      const size = Math.max(btn.offsetWidth, btn.offsetHeight);
      ripple.style.width = ripple.style.height = `${size}px`;

      const rect = btn.getBoundingClientRect();
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

      btn.appendChild(ripple);

      const destino = btn.getAttribute('href');

      setTimeout(() => {
        if (destino) window.location.href = destino;
      }, 300);
    });
  });

  // FAQ TOGGLE
document.querySelectorAll('.faq-card').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('active');
    console.log(card.classList);
  });
});

  // Si se llega desde el link "Preguntas frecuentes" del footer (#faq-section),
  // resalta brevemente la sección para que sea evidente a dónde se llegó.
  if (window.location.hash === '#faq-section') {
    const faqSection = document.getElementById('faq-section');
    if (faqSection) {
      faqSection.classList.add('faq-highlight');
      setTimeout(() => faqSection.classList.remove('faq-highlight'), 1200);
    }
  }

  //AGREGO CARRITO

 const botones = document.querySelectorAll(".btn-agregar-carrito");
  botones.forEach((boton) => {
    boton.addEventListener("click", () => {
      const servicio = {
        id: boton.dataset.id,
        nombre: boton.dataset.servicio,
        precio: Number(boton.dataset.precio),
        cantidad: 1
      };
      let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      const existe = carrito.find(item => item.id === servicio.id);
      if (existe) {
        existe.cantidad++;
      } else {
        carrito.push(servicio);
      }
      localStorage.setItem("carrito", JSON.stringify(carrito));
      alert(`${servicio.nombre} agregado al carrito`);

    });

  });

});