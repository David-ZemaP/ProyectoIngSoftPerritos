// src/Register_Pet/presenterRegister.js
import '../firebase.js';                         // inicializa Firebase
import { auth } from '../firebase';              // para obtener el usuario actual (si hay)
import { createPet } from '../services/pets.service.js';  // guarda en Firestore

import registrar from './register.js';
import displayMessage from './displayMessage.js';
import { handleImageUpload, resetFormView } from './RegisterView.js';

/**
 * Recolecta todos los datos del formulario y los devuelve como un objeto.
 * Los nombres coinciden con los parámetros de registrar().
 */
function collectFormData() {
  const name = document.getElementById('name').value.trim();
  const species = document.getElementById('species').value;
  const genderElement = document.querySelector('input[name="gender"]:checked');
  const gender = genderElement ? genderElement.value : '';

  const personality = document.getElementById('personality').value.trim();
  const age = document.getElementById('age').value.trim();
  const breed = document.getElementById('breed').value.trim();

  return { name, species, gender, personality, age, breed };
}

function init() {
  const form = document.getElementById('register-form');
  const photoInput = document.getElementById('photo-upload');
  const msgBox = document.getElementById('form-message');

  // Vista: preview de imagen (no subimos a Storage todavía)
  photoInput.addEventListener('change', handleImageUpload);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    msgBox.classList.remove('hidden');
    msgBox.textContent = '';
    msgBox.style.color = 'var(--primary)';

    const data = collectFormData();

    try {
      // 1) Validación de negocio (NO tocar por Cypress)
      const result = registrar(
        data.name,
        data.species,
        data.gender,
        data.age,
        data.breed,
        data.personality
      );

      if (typeof result === 'string') {
        // Falla de validación
        displayMessage(result, 'error');
        return;
      }

      // 2) Éxito: persistir en Firestore
      const petData = result;

      // Si aún no implementaste login, guardamos como 'guest'
      const user = auth.currentUser;
      const ownerId = user ? user.uid : 'guest';

      // Puedes mapear age a número si lo prefieres:
      // const ageNum = Number(petData.age ?? 0) || 0;

      await createPet(
        {
          ...petData,          // { name, species, gender, age, breed, personality }
          status: 'available', // campo adicional
          // photoUrl: null,    // si luego subes a Storage
        },
        ownerId
      );

      // 3) Feedback y limpieza de UI
      displayMessage(`¡${petData.name} ha sido registrado(a) exitosamente!`, 'success');
      resetFormView(form);

    } catch (error) {
      console.error('Error al registrar:', error);
      displayMessage(error.message || 'Ocurrió un error inesperado al registrar la mascota.', 'error');
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
