async function cargarFooter() {
  const res = await fetch('/src/componentes/navbar/footer.html');
  const html = await res.text();
  document.getElementById('footer').innerHTML = html;
}

cargarFooter();