// src/api/servicioUsuario.js
// Cliente HTTP para conectar el front con el backend de SintaxLogistics2 (Spring Boot).
// Traduce los nombres de campo en español que usa el front a los que espera el
// backend (name, lastName, email, phone, password) y guarda el JWT del login.

//const BASE_URL = "http://localhost:8080/api";, esto conecta al backend real de Spring Boot. En producción, el front y el back corren en el mismo host, así que no hace falta poner localhost ni puerto.
const BASE_URL = "/api";
/**

 * @param {{nombres: string, apellidos: string, correo: string, celular: string, password: string}} datos
 * @returns {Promise<object>} el UserResponse que regresa el backend
 */
export async function registrarUsuario({ nombres, apellidos, correo, celular, password }) {
  const respuesta = await fetch(`${BASE_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: nombres,
      lastName: apellidos,
      email: correo,
      phone: celular,
      password,
    }),
  });

  // El backend puede regresar un body vacío en algunos errores, por eso el catch
  const datos = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    const mensaje = datos?.message || "No se pudo completar el registro. Intenta de nuevo.";
    throw new Error(mensaje);
  }

  return datos;
}

/**
 * Inicia sesión con correo y contraseña.
 * Pega a POST /api/auth/login (AuthController). Si el login es exitoso, guarda
 * el JWT en sessionStorage para que las siguientes peticiones puedan usarlo.
 * @param {{correo: string, password: string}} datos
 * @returns {Promise<object>} el LoginResponse del backend ({ token, id, name, ... })
 */
export async function iniciarSesion({ correo, password }) {
  const respuesta = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: correo,
      password,
    }),
  });

  const datos = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    const mensaje = datos?.message || "Correo o contraseña incorrectos.";
    throw new Error(mensaje);
  }

  // Guardamos el JWT para las siguientes peticiones autenticadas
  if (datos?.token) {
    sessionStorage.setItem("jwt_token", datos.token);
  }

  return datos;
}
