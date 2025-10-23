import buscar from './search.js';
import displayMessage from '../displayMessage.js';

/**
 * Recolecta los filtros de búsqueda del formulario.
 * @returns {object} Objeto con los filtros ingresados.
 */
function collectSearchData() {
    const name = document.getElementById('name').value.trim();
    const age = document.getElementById('age').value.trim();
    const breed = document.getElementById('breed').value.trim();

    return { nombre: name, edad: age ? Number(age) : '', raza: breed };
}

function init() {
    const form = document.getElementById('search-form');
    const messageBox = document.getElementById('form-message');

    if (!form) {
        return;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        messageBox.classList.add('hidden');

        const data = collectSearchData();

        try {
            const result = buscar(data);

            if (typeof result === 'string') {
                displayMessage(result, 'error');
            } else {
                displayMessage('¡Mascota encontrada exitosamente!', 'success');
            }

        } catch (error) {
            displayMessage(error.message, 'success');
        }
    });
}

document.addEventListener('DOMContentLoaded', init);
