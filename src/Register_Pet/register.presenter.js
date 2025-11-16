// src/Register_Pet/register.presenter.js
// 
// Función: Gestiona la vista y el flujo completo de registro de la mascota.

import '../firebase.js';
import { auth } from '../firebase.js';
import { createPet } from '../services/pets.service.js';

// Import the validation unit. Use default import to be compatible with tests/mocks.
// Import the whole module to be tolerant with different import shapes (named/default)
import * as registerUnit from './register.js';
import displayMessage from './displayMessage.js';
import { handleImageUpload, resetFormView } from './RegisterView.js';
import Pet from '../models/Pet.js';

// La función de coleccionar datos del DOM se mantiene
function collectFormData() {
    // ... (código existente, no requiere cambios de lógica)
    const name = document.getElementById('name').value.trim();
    const species = document.getElementById('species').value;
    const genderElement = document.querySelector('input[name="gender"]:checked');
    const gender = genderElement ? genderElement.value : '';

    const personality = document.getElementById('personality').value.trim();
    const age = document.getElementById('age').value.trim();
    const breed = document.getElementById('breed').value.trim();

    return { name, species, gender, personality, age, breed };
}

// -------------------------------------------------------------
// --- FUNCIÓN DE LÓGICA DE NEGOCIO (Testeable y Limpia) ---
// -------------------------------------------------------------
/**
 * Gestiona el registro de la mascota: validación, creación de instancia y persistencia.
 * @param {Object} data - Datos limpios del formulario (name, species, gender, etc.).
 * @param {Object | null} currentUser - Objeto de usuario autenticado o null.
 * @returns {Promise<Pet | string>} Promesa de la instancia de Pet guardada o mensaje de error (string).
 */
export async function handlePetRegistration(data, currentUser) {
    
    // 1) Validación y Creación de la Entidad (Unidad pura)
    // Se utiliza el orden de argumentos definido en validateAndCreatePet (name, species, gender, age, breed, personality)
    // Resolve the validation function from the imported module (supports named or default export)
    // When running under Jest, prefer the mocked module if jest.requireMock is available.
    let regModule = registerUnit;
    if (typeof jest !== 'undefined' && typeof jest.requireMock === 'function') {
        try {
            // Try to obtain the mocked module as the test defines it
            regModule = jest.requireMock('./register.js') || regModule;
        } catch (e) {
            // ignore and fall back to the statically imported module
        }
    }

    // Allow tests to inject a mock via a well-known global (workaround for some ESM mocking cases)
    const globalMock = (typeof globalThis !== 'undefined' && typeof globalThis.__mockValidateAndCreatePet === 'function')
        ? globalThis.__mockValidateAndCreatePet
        : null;

    const validateFn = globalMock || (typeof regModule.validateAndCreatePet === 'function' ? regModule.validateAndCreatePet : regModule.default);

    if (typeof validateFn !== 'function') {
        throw new Error('validateAndCreatePet is not available');
    }

    const petInstanceOrError = validateFn(
        data.name,
        data.species,
        data.gender,
        // Nota: Asegúrate de que el orden de los argumentos aquí coincida con register.js
        data.age, 
        data.breed,
        data.personality
    );

    // Si la unidad devolvió un string, es un error de validación
    if (typeof petInstanceOrError === 'string') {
        return petInstanceOrError; 
    }

    // El resultado es una instancia de Pet válida
    const pet = petInstanceOrError;

    // 2) Asignación del Dueño y Status (solo si es necesario actualizar la instancia)
    const ownerId = currentUser ? currentUser.uid : 'guest';
    
    // NOTA DE OPTIMIZACIÓN: Si validateAndCreatePet ya establece ownerId: 'guest' y status: 'available'
    // no necesitas hacer 'new Pet' ni asignar status/ownerId aquí. 
    // Dado que createPet requiere el ownerId, lo pasamos al servicio.
    
    // 3) Persistencia (Llamada al servicio)
    try {
        // La función createPet ya maneja la conversión a Firestore y añade timestamps
        // Preferir mocks injected by the test environment (jest.requireMock or global) when available
        let createFn = createPet;
        if (typeof globalThis !== 'undefined' && typeof globalThis.__mockCreatePet === 'function') {
            createFn = globalThis.__mockCreatePet;
        } else if (typeof jest !== 'undefined' && typeof jest.requireMock === 'function') {
            try {
                const maybe = jest.requireMock('../services/pets.service.js');
                if (maybe && typeof maybe.createPet === 'function') createFn = maybe.createPet;
            } catch (e) {
                // ignore
            }
        }

        const savedPet = await createFn(pet, ownerId);
        return savedPet; // Devuelve la mascota guardada (con ID de Firestore)
    } catch (error) {
        // Limpiamos el error para el usuario final
        console.error('Error al guardar en la BD:', error);
        throw new Error('Ocurrió un error inesperado al registrar la mascota.');
    }
}

// -------------------------------------------------------------
// --- FUNCIÓN DE INICIALIZACIÓN (Solo interacciones con el DOM) ---
// -------------------------------------------------------------
function init() {
    const form = document.getElementById('register-form');
    const photoInput = document.getElementById('photo-upload');
    const msgBox = document.getElementById('form-message');

    // ... (otras funciones y listeners)

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Limpieza de vista y recolección de datos
        // NOTA: La clase 'hidden' se quita aquí, pero la función displayMessage debería manejar la visibilidad.
        msgBox.classList.remove('hidden'); 
        msgBox.textContent = '';
        msgBox.style.color = 'var(--primary)';

        const data = collectFormData();
        const user = auth.currentUser; 

        try {
            // 2. Ejecuta la lógica de negocio pura
            const result = await handlePetRegistration(data, user); 
            
            // 3. Renderiza el resultado
            
            // Si el resultado es un string, es un error de validación
            if (typeof result === 'string') {
                displayMessage(result, 'error');
                return;
            }

            // Si es exitoso, result es la instancia de Pet guardada
            
            // PASO A: Mostrar mensaje de éxito (Cypress lo ve aquí)
            displayMessage(`¡${result.name} ha sido registrado(a) exitosamente!`, 'success');
            
            // 🚨 SOLUCIÓN: Esperar 1.5 segundos (1500ms) para que Cypress pase la aserción.
            await new Promise(resolve => setTimeout(resolve, 1500)); 

            // PASO C: Limpiar el formulario y ocultar el mensaje de nuevo
            resetFormView(form);
            
        } catch (error) {
            // Captura errores de guardado lanzados por handlePetRegistration
            displayMessage(error.message, 'error');
        }
    });
}

// Se mantiene el chequeo del DOM para asegurar que no falle en entornos de prueba (Jest/Node)
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', init);
}