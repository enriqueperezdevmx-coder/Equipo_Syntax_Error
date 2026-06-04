document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.btn-cotizar').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault(); // evita que navegue antes de verse el efecto

      const ripple = document.createElement('span');
      ripple.classList.add('ripple');

      const size = Math.max(btn.offsetWidth, btn.offsetHeight);
      ripple.style.width  = size + 'px';
      ripple.style.height = size + 'px';

      const rect = btn.getBoundingClientRect();
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top  = (e.clientY - rect.top  - size / 2) + 'px';

      btn.appendChild(ripple);

      ripple.addEventListener('animationend', () => {
        ripple.remove();
        // navega después del efecto
        if (btn.href) window.location.href = btn.href;
      });
    });
  });
});