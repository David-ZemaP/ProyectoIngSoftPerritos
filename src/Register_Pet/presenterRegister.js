import registrar from './register.js';

/**
 * Maneja la carga de imágenes y muestra una vista previa.
 * @param {Event} event
 */
function handleImageUpload(event) {
    const file = event.target.files[0];
    const previewContainer = document.getElementById('image-preview');
    const iconContainer = document.getElementById('camera-icon');

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewContainer.style.backgroundImage = `url('${e.target.result}')`;
            if (iconContainer) {
                iconContainer.classList.add('hidden');
            }
            previewContainer.style.borderStyle = 'solid';
            previewContainer.style.borderWidth = '0';
        };
        reader.readAsDataURL(file);
    }
}

function resetFormView(form) {
    form.reset();
    const previewContainer = document.getElementById('image-preview');
    const iconContainer = document.getElementById('camera-icon');
    previewContainer.style.backgroundImage = 'none';
    previewContainer.style.borderStyle = 'dashed';
    previewContainer.style.borderWidth = '2px';
    if (iconContainer) {
         iconContainer.classList.remove('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('register-form');
    const photoInput = document.getElementById('photo-upload');
    const toggleButton = document.getElementById('toggle-theme-button');
    
    photoInput.addEventListener('change', handleImageUpload);
    if (toggleButton) {
        toggleButton.addEventListener('click', toggleDarkMode);
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const petName = document.getElementById('name').value.trim();
        const petAge = document.getElementById('age').value.trim();
        const petBreed = document.getElementById('breed').value.trim();
        const petPersonality = document.getElementById('description').value.trim();

        if (!petName || !petAge || !petBreed || !petPersonality) {
            displayMessage('Por favor, rellena todos los campos obligatorios (*).', 'error');
            return;
        }

        try {
            const petData = registrar(petName, petAge, petBreed, petPersonality);
            
            console.log('Datos de la mascota a registrar:', petData);
            
            displayMessage(`¡${petName} ha sido registrado(a) exitosamente!`, 'success');
            resetFormView(form);

        } catch (error) {
            console.error('Error al registrar:', error);
            displayMessage(error.message || 'Ocurrió un error inesperado al registrar la mascota.', 'error');
        }
    });
});
