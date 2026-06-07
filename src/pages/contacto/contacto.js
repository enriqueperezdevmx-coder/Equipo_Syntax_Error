document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    
    // Obtenemos todos los elementos del formulario
    const inputs = {
        nombre: document.getElementById('nombre'),
        apellido: document.getElementById('apellido'),
        email: document.getElementById('email'),
        telefono: document.getElementById('telefono'),
        asunto: document.getElementById('asunto'),
        mensaje: document.getElementById('mensaje')
    };

    form.addEventListener('submit', (e) => {
        // Evitamos que la página se recargue por defecto
        e.preventDefault(); 
        
        let formularioValido = true;

        // 1. Validar cada campo
        for (const clave in inputs) {
            const campo = inputs[clave];
            
            // Eliminar espacios en blanco al inicio y final para evitar trampas con la barra espaciadora
            if (campo.value.trim() === '') {
                campo.classList.add('error');
                formularioValido = false;
            } else {
                campo.classList.remove('error');
            }
        }

        // Validar estructura básica del correo electrónico de forma adicional
        if (inputs.email.value && !validateEmail(inputs.email.value)) {
            inputs.email.classList.add('error');
            formularioValido = false;
        }

        // Validar el número de teléfono si está presente
        if (inputs.telefono.value && !validatePhone(inputs.telefono.value)) {
            inputs.telefono.classList.add('error');
            formularioValido = false;
        }

        // 2. Si hay fallas, detenemos el proceso
        if (!formularioValido) {
            alert('Por favor, completa todos los campos marcados en rojo.');
            return;
        }

        // 3. Si todo está correcto, recolectamos los datos
        const datosFormulario = {
            nombre: inputs.nombre.value.trim(),
            apellido: inputs.apellido.value.trim(),
            email: inputs.email.value.trim(),
            telefono: inputs.telefono.value.trim(),
            asunto: inputs.asunto.value,
            mensaje: inputs.mensaje.value.trim(),
            fechaRegistro: new Date().toLocaleString()
        };

        // 4. Almacenar en LocalStorage
        // Guardamos los datos convirtiendo el objeto en una cadena de texto JSON
        localStorage.setItem('contactoEnvioExpress', JSON.stringify(datosFormulario));

        alert(`¡Mensaje enviado correctamente!`);
        form.submit();
    });

    // Opcional: Quitar el borde rojo en tiempo real mientras el usuario escribe
    for (const clave in inputs) {
        inputs[clave].addEventListener('input', function() {
            if (this.value.trim() !== '') {
                this.classList.remove('error');
            }
        });
    }

    // Función auxiliar para validar formato de correo
    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Función auxiliar para validar formato de teléfono
    function validatePhone(phone) {
        const regex = /^\d{10}$/;
        return regex.test(phone);
    }
});