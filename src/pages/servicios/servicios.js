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
});