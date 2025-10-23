// displayMessage.js (Verifica que tu código haga esto)
function displayMessage(message, type) {
    const messageBox = document.getElementById('form-message');
    
    // 1. Ocultar y limpiar (buena práctica)
    messageBox.classList.add('hidden');
    messageBox.classList.remove('text-success', 'text-error');
    messageBox.textContent = '';
    
    // 2. Si hay mensaje, hacerlo visible y darle estilo
    if (message) {
        messageBox.textContent = message;
        
        // ¡ESTA LÍNEA ES CRUCIAL PARA CYPRESS!
        messageBox.classList.remove('hidden'); 
        
        if (type === 'success') {
            messageBox.classList.add('text-success');
        } else if (type === 'error') {
            messageBox.classList.add('text-error');
        }
    }
}
export default displayMessage;