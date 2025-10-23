import registrar from './register.js';
import displayMessage from './displayMessage.js';
import { handleImageUpload, resetFormView } from './RegisterView.js';

/**
 * Recolecta todos los datos del formulario y los devuelve como un objeto.
 * Se han ajustado los nombres de las propiedades para coincidir con la función registrar.
 * @returns {object} Un objeto con los datos de la mascota.
 */
function collectFormData() {
    // 1. Recolección de datos (obligatorios)
    // Usamos 'name', 'species', 'gender' para coincidir con los parámetros de registrar
    const name = document.getElementById('name').value.trim();
    const species = document.getElementById('species').value;
    const genderElement = document.querySelector('input[name="gender"]:checked');
    const gender = genderElement ? genderElement.value : '';

    // 2. Recolección de datos (opcionales)
    // Usamos 'personality', 'age', 'breed'
    const personality = document.getElementById('personality').value.trim();
    const age = document.getElementById('age').value.trim();
    const breed = document.getElementById('breed').value.trim();

    // NOTA: Devolvemos el objeto con las propiedades con los nombres correctos.
    return { name, species, gender, personality, age, breed };
}


function init() {
    const form = document.getElementById('register-form'); 
    const photoInput = document.getElementById('photo-upload');
    const toggleButton = document.getElementById('toggle-theme-button'); 

    // 1. Configuración de Listeners de la vista
    photoInput.addEventListener('change', handleImageUpload);

    if (toggleButton) {
        // Lógica para el botón de tema (se mantiene comentada)
        // toggleButton.addEventListener('click', toggleDarkMode);
    }

    if (!form) {
        console.error("Error: No se encontró el formulario con ID 'register-form'.");
        return;
    }

    // 2. Listener principal de sumisión del formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const data = collectFormData();

        try {
            // Llamada a la lógica de negocio (registrar.js)
            // Usamos las propiedades del objeto 'data' directamente
            const result = registrar(
                data.name,        // Antes era data.petName
                data.species,     // Antes era data.petSpecies
                data.gender,      // Antes era data.petGender
                data.age,         // Antes era data.petAge
                data.breed,       // Antes era data.petBreed
                data.personality  // Antes era data.petPersonality
            );
            
            // ----------------------------------------------------
            // CORRECCIÓN/VERIFICACIÓN: La lógica de manejo es correcta
            // ----------------------------------------------------

            if (typeof result === 'string') {
                // Caso de FALLO (Validación desde registrar.js)
                // Usamos el mensaje devuelto por 'registrar'
                displayMessage(result, 'error'); // 👈 El fallo de Cypress se resuelve aquí, si displayMessage remueve la clase 'hidden'
                
            } else {
                // Caso de ÉXITO (El módulo devuelve el objeto de datos)
                const petData = result;
                
                console.log('Datos de la mascota a registrar:', petData);
                
                // Retroalimentación al usuario y limpieza
                displayMessage(`¡${petData.name} ha sido registrado(a) exitosamente!`, 'success');
                resetFormView(form);
            }

        } catch (error) {
            // Manejo de errores de ejecución inesperados (no de validación)
            console.error('Error al registrar:', error);
            displayMessage(error.message || 'Ocurrió un error inesperado al registrar la mascota.', 'error');
        }
    });
}

document.addEventListener('DOMContentLoaded', init);