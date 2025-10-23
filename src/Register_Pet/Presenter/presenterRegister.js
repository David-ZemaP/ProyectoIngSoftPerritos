import registrar from './register.js';
import displayMessage from './displayMessage.js';
import { handleImageUpload, resetFormView } from './RegisterView.js'; // 👈 IMPORTACIÓN DE LAS FUNCIONES DE VISTA

/**
 * Recolecta todos los datos del formulario y los devuelve como un objeto.
 * @returns {object} Un objeto con los datos de la mascota.
 */
function collectFormData() {
    // 1. Recolección de datos (obligatorios)
    const petName = document.getElementById('name').value.trim();
    const petSpecies = document.getElementById('species').value;
    const petGenderElement = document.querySelector('input[name="gender"]:checked');
    const petGender = petGenderElement ? petGenderElement.value : '';

    // 2. Recolección de datos (opcionales)
    const petPersonality = document.getElementById('personality').value.trim();
    const petAge = document.getElementById('age').value.trim();
    const petBreed = document.getElementById('breed').value.trim();

    return { petName, petSpecies, petGender, petPersonality, petAge, petBreed };
}


function init() {
    const form = document.getElementById('register-form'); 
    const photoInput = document.getElementById('photo-upload');
    const toggleButton = document.getElementById('toggle-theme-button'); 

    // 1. Configuración de Listeners de la vista
    photoInput.addEventListener('change', handleImageUpload);

    if (toggleButton) {
        // Lógica para el botón de tema (asumiendo que toggleDarkMode existe)
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

        // Validación de campos obligatorios (*)
        if (!data.petName || !data.petSpecies || !data.petGender) {
            displayMessage('Por favor, rellena los campos obligatorios (*): Nombre, Especie y Sexo.', 'error');
            return;
        }

        try {
            // Llamada a la lógica de negocio
            const petData = registrar(
                data.petName, 
                data.petSpecies, 
                data.petGender, 
                data.petAge, 
                data.petBreed, 
                data.petPersonality
            );
            
            console.log('Datos de la mascota a registrar:', petData);
            
            // Retroalimentación al usuario y limpieza
            displayMessage(`¡${data.petName} ha sido registrado(a) exitosamente!`, 'success');
            resetFormView(form);

        } catch (error) {
            console.error('Error al registrar:', error);
            displayMessage(error.message || 'Ocurrió un error inesperado al registrar la mascota.', 'error');
        }
    });
}

document.addEventListener('DOMContentLoaded', init);