/**
 * Maneja la carga de imágenes y muestra una vista previa.
 * @param {Event} event
 */
export function handleImageUpload(event) {
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

/**
 * Restablece el formulario a su estado inicial, incluyendo la vista previa de la imagen.
 * @param {HTMLFormElement} form
 */
export function resetFormView(form) {
    form.reset();
    const previewContainer = document.getElementById('image-preview');
    const iconContainer = document.getElementById('camera-icon');
    
    // Restablecer la vista de la imagen
    previewContainer.style.backgroundImage = 'none';
    previewContainer.style.borderStyle = 'dashed';
    previewContainer.style.borderWidth = '2px';
    if (iconContainer) {
         iconContainer.classList.remove('hidden');
    }
    
    // Oculta el mensaje de estado
    const messageElement = document.getElementById('form-message');
    if (messageElement) {
        messageElement.classList.add('hidden');
    }
}