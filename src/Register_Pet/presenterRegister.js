import '../firebase.js';
import { auth } from '../firebase';
import { createPet } from '../services/pets.service.js';

import registrar from './register.js';
import displayMessage from './displayMessage.js';
import { handleImageUpload, resetFormView } from './RegisterView.js';
import Pet from '../models/Pet.js';

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

  photoInput.addEventListener('change', handleImageUpload);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    msgBox.classList.remove('hidden');
    msgBox.textContent = '';
    msgBox.style.color = 'var(--primary)';

    const data = collectFormData();

    try {
      // 1) Validación de negocio (no tocar por Cypress)
      const result = registrar(
        data.name,
        data.species,
        data.gender,
        data.age,
        data.breed,
        data.personality
      );

      if (typeof result === 'string') {
        displayMessage(result, 'error');
        return;
      }

      // 2) Instancia Pet + persistencia
      const user = auth.currentUser;
      const ownerId = user ? user.uid : 'guest';

      const pet = new Pet({
        ...result,          // name, species, gender, age, breed, personality
        status: 'available',
        ownerId,
        // photoUrl: (cuando uses Storage)
      });

      await createPet(pet, ownerId);

      displayMessage(`¡${pet.name} ha sido registrado(a) exitosamente!`, 'success');
      resetFormView(form);
    } catch (error) {
      console.error('Error al registrar:', error);
      displayMessage(error.message || 'Ocurrió un error inesperado al registrar la mascota.', 'error');
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
