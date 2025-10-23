/**
 * Muestra mensajes de éxito/error en la vista. 
 * NOTA: Asume que tienes clases CSS 'text-error' y 'text-success' definidas.
 * @param {string} message 
 * @param {'success'|'error'} type 
 */
function displayMessage(message, type) {
    const msgElement = document.getElementById('form-message');
    msgElement.textContent = message;
    
    // Limpia y añade clases base
    msgElement.classList.remove('hidden', 'text-error', 'text-success');
    msgElement.classList.add('text-center', 'font-semibold');

    if (type === 'error') {
        msgElement.classList.add('text-error');
    } else if (type === 'success') {
        msgElement.classList.add('text-success');
    }
}

export default displayMessage;