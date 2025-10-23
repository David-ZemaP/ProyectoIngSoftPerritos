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
                // Ocultar el ícono de la cámara
                iconContainer.classList.add('hidden');
            }
            // Quitar el borde dashed (asumiendo que solid y 0 es el estado "con imagen")
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
    
    // 1. Restablecer la vista de la imagen (vuelve al estado inicial con borde dashed)
    previewContainer.style.backgroundImage = 'none';
    previewContainer.style.borderStyle = 'dashed';
    previewContainer.style.borderWidth = '2px';
    if (iconContainer) {
        // Mostrar el ícono de la cámara
        iconContainer.classList.remove('hidden');
    }
    
    // 2. CORRECCIÓN CLAVE: Oculta el mensaje de estado y limpia las clases de estilo.
    const messageElement = document.getElementById('form-message');
    if (messageElement) {
        // Asegura que el mensaje se oculte
        messageElement.classList.add('hidden');
        
        // Limpia las clases de color que quedaron del mensaje anterior (éxito o error)
        messageElement.classList.remove('text-success', 'text-error');
    }
}