async function cargarNavbar() {
  const res = await fetch('/src/componentes/navbar/navbar.html');
  const html = await res.text();
  document.getElementById('navbar').innerHTML = html;
}

cargarNavbar();