document.addEventListener('DOMContentLoaded', () => {
    const formRegistro = document.getElementById('form-registro');
    const alertasContenedor = document.getElementById('alertas-contenedor');
    const inputCelular = document.getElementById('celular');
    const inputNombres = document.getElementById('nombres');
    const inputApellidos = document.getElementById('apellidos');

    // ESCUDO ANTI-INYECCIÓN XSS, me protejo, me protejo (Por si algún graciosillo intenta inyectar código)
    // Convierte caracteres peligrosos en texto inofensivo
    function escaparHTML(texto) {
        const elemento = document.createElement('div');
        elemento.textContent = texto;
        return elemento.innerHTML;
    }

    // Campo de fuerza: Destruye cualquier letra o símbolo que intente entrar al teléfono (soy un espejo)
    inputCelular.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, ''); 
    });

    // NUEVO CAMPO DE FUERZA: Solo letras, acentos, ñ y espacios para los nombres (Adiós hijos de Elon Musk)
    function purificarNombre(e) {
        // Reemplaza globalmente todo lo que NO (^) sea a-z, A-Z, áéíóú, ÁÉÍÓÚ, ñ, Ñ, o espacio (\s)
        this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    }

    inputNombres.addEventListener('input', purificarNombre);
    inputApellidos.addEventListener('input', purificarNombre);

    formRegistro.addEventListener('submit', (e) => {
        e.preventDefault(); 
        alertasContenedor.innerHTML = ''; 
        let errores = [];

        // guardamos los valores
        const nombres = inputNombres.value.trim();
        const apellidos = inputApellidos.value.trim();
        const correo = document.getElementById('correo').value.trim();
        const celular = inputCelular.value.trim();
        const password = document.getElementById('password').value;
        const confirmarPassword = document.getElementById('confirmar-password').value;

        // no pasasaran de aqui!! dijo el mago blanco

        // primera revision Revisión específica de campos vacíos
        if (!nombres) errores.push("Falta ingresar tu <strong>nombre</strong>.");
        if (!apellidos) errores.push("Falta ingresar tus <strong>apellidos</strong>.");
        if (!correo) errores.push("Falta ingresar tu <strong>correo electrónico</strong>.");
        if (!celular) errores.push("Falta ingresar tu <strong>número celular</strong>.");
        if (!password) errores.push("Falta ingresar una <strong>contraseña</strong>.");
        if (!confirmarPassword) errores.push("Debes <strong>confirmar tu contraseña</strong>.");

        // si ya quedo seguimos, si no no
        if (errores.length === 0) {
            
            // segunda revision del correo
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(correo)) {
                errores.push("El formato del correo electrónico no es válido.");
            }

            // tercera revision Teléfono bonito si no no
            if (celular.length !== 10) {
                errores.push("El número de celular debe tener exactamente 10 dígitos.");
            }

            // cuarta revision a que no pasan de aqui 
            if (password !== confirmarPassword) {
                errores.push("Las contraseñas no coinciden. Revisa que hayas escrito lo mismo.");
            } else {
                
                // no seas menso no pongas tus datos de contraseña
                const nombreLower = nombres.toLowerCase();
                const apellidoLower = apellidos.toLowerCase();
                const passLower = password.toLowerCase();

                // en mexa si usamos dos nombres aveces
                const partesNombre = nombreLower.split(' ').filter(p => p.length > 2);
                const partesApellido = apellidoLower.split(' ').filter(p => p.length > 2);

                partesNombre.forEach(parte => {
                    if (passLower.includes(parte)) {
                        // aqui seguimos protegiendo los intereses de la nacion 
                        errores.push(`La contraseña no puede contener tu nombre ("${escaparHTML(parte)}").`);
                    }
                });

                partesApellido.forEach(parte => {
                    if (passLower.includes(parte)) {
                        // aqui tambien seguimos protegiendo los intereses de la nacion 
                        errores.push(`La contraseña no puede contener tus apellidos ("${escaparHTML(parte)}").`);
                    }
                });
                
                // Evaluamos mas cosas, por que no, yo no soy el usuario
                if (password.length < 12) {
                    errores.push("La contraseña es muy corta. Mínimo 12 caracteres.");
                }
                if (!/[A-Z]/.test(password)) {
                    errores.push("La contraseña debe incluir al menos una letra MAYÚSCULA.");
                }
                if (!/[a-z]/.test(password)) {
                    errores.push("La contraseña debe incluir al menos una letra minúscula.");
                }
                if (!/[0-9]/.test(password)) {
                    errores.push("La contraseña debe incluir al menos un número.");
                }
                if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
                    errores.push("Falta un carácter especial (ej. ! @ # $ % & *).");
                }
                // No permitir 3 caracteres idénticos consecutivos
                if (/(.)\1\1/.test(password)) {
                    errores.push("No puedes usar 3 caracteres idénticos consecutivos (ej. aaa, 111).");
                }
                // No permitir secuencias de 3 números
                if (tieneNumerosSecuenciales(password)) {
                    errores.push("No uses 3 números consecutivos en secuencia (ej. 123 o 321).");
                }
                if (/\s/.test(password)) {
                    errores.push("La contraseña no puede contener espacios en blanco.");
                }
            }
        }

        // como llegaste hasta aqui :O

        // Mostrar el veredicto en pantalla, vive o no vive
        if (errores.length > 0) {
            let listaErrores = '<ul class="mb-0 text-start mt-2">';
            errores.forEach(err => { listaErrores += `<li>${err}</li>`; });
            listaErrores += '</ul>';
            
            // aqui ya no es necesario seguir cuidando desde antes ya quedo encerrao en su cuarto de panico
            mostrarAlerta(`<strong>¡Alto ahí! Corrige lo siguiente:</strong>${listaErrores}`, 'danger');
        } else {
            // vive
            mostrarAlerta('✅ ¡Registro validado exitosamente!', 'success');
            
            // Listo para enviarse a Java/Spring Boot para que Json les de cuello
            console.log("JSON listo:", {
                nombre: nombres,
                apellido: apellidos,
                correo: correo,
                telefono: celular,
                password: password
            });
        }
    });

    function mostrarAlerta(mensaje, tipo) {
        alertasContenedor.innerHTML = `
            <div class="alert alert-${tipo} alert-dismissible fade show shadow-sm" role="alert">
                ${mensaje}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    }

    function tieneNumerosSecuenciales(str) {
        for (let i = 0; i < str.length - 2; i++) {
            let num1 = str.charCodeAt(i);
            let num2 = str.charCodeAt(i + 1);
            let num3 = str.charCodeAt(i + 2);
            
            if (num1 >= 48 && num1 <= 57 && num2 >= 48 && num2 <= 57 && num3 >= 48 && num3 <= 57) {
                if (num2 === num1 + 1 && num3 === num2 + 1) return true;
                if (num2 === num1 - 1 && num3 === num2 - 1) return true;
            }
        }
        return false;
    }
});