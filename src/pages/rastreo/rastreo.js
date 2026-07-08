document.addEventListener("DOMContentLoaded", () => {
  const formRastreo = document.getElementById("form-rastreo");
  const resultadoRastreo = document.getElementById("resultado-rastreo");

  formRastreo.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputId = document.getElementById("id-rastreo");
    const idGuia = inputId.value.trim();

    if (!formRastreo.checkValidity() || idGuia === "") {
      e.stopPropagation();
      formRastreo.classList.add("was-validated");

      Swal.fire({
        icon: "warning",
        title: "Campo vacío",
        text: "Por favor, ingresa un ID de rastreo o número de guía.",
        confirmButtonColor: "#0DA74A",
      });
      return;
    }

    formRastreo.classList.remove("was-validated");

    mostrarCargandoYResultados();
  });

  function mostrarCargandoYResultados() {
    Swal.fire({
      title: "Consultando guía...",
      text: "Buscando actualizaciones en Syntax Logistics.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      timer: 1000,
    }).then(() => {
      resultadoRastreo.classList.remove("d-none");

      resultadoRastreo.scrollIntoView({ behavior: "smooth", block: "nearest" });

      console.log("Rastreo cargado exitosamente.");
    });
  }
});
