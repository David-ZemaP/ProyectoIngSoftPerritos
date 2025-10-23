import { checkMatch, MOCK_PETS } from './match.js';
import { setTimeout } from 'timers/promises';

const currentPetIndex = 0;
let isProcessing = false;

const petCardEl = document.getElementById('pet-card');
const dislikeBtn = document.getElementById('dislike-btn');
const likeBtn = document.getElementById('like-btn');
const statusMessageEl = document.getElementById('status-message');
const matchMessageEl = document.getElementById('match-message');
const matchedPetNameEl = document.getElementById('matched-pet-name');

const pets = MOCK_PETS;

const renderPetCard = (pet) => {
  if (!pet) {
    petCardEl.innerHTML = `
            <div class="p-8 text-center text-gray-500">
                <p class="text-xl font-semibold">¡Eso es todo por ahora!</p>
                <p>Vuelve más tarde para ver nuevas mascotas.</p>
            </div>
        `;
    dislikeBtn.disabled = true;
    likeBtn.disabled = true;
    statusMessageEl.textContent = 'No hay más mascotas en tu zona.';
    return;
  }

  // HTML con un placeholder de imagen (usando placehold.co)
  petCardEl.innerHTML = `
        <div class="h-96 bg-cover bg-center flex items-end p-4 relative"
            style="background-image: url('https://placehold.co/400x500/A3A3A3/FFFFFF?text=${pet.name}')">
            <div class="bg-black/60 p-4 rounded-t-lg backdrop-blur-sm w-full">
                <h2 class="text-3xl font-bold text-white">${pet.name}, ${pet.age} años</h2>
                <p class="text-sm text-gray-200">${pet.breed}</p>
            </div>
        </div>
        <div class="p-5">
            <p class="text-gray-600 italic">"${pet.description}"</p>
            <p class="text-xs mt-3 text-gray-400">ID: ${pet.id}</p>
        </div>
    `;
  statusMessageEl.textContent = `Viendo a ${pet.name}.`;
};

/**
 * Muestra la animación de Match.
 * @param {string} petName - Nombre de la mascota con la que se hizo match.
 */
const showMatchAnimation = (petName) => {
  return new Promise((resolve) => {
    matchedPetNameEl.textContent = `Con ${petName}.`;
    matchMessageEl.classList.remove('hidden');

    setTimeout(() => {
      matchMessageEl.classList.add('hidden');
      resolve();
    }, 2500);
  });
};

const advanceToNextPet = (direction) => {
  if (isProcessing) {
    return;
  }
  isProcessing = true;

  const currentPet = pets[currentPetIndex];

  const nextPetIndex = (currentPetIndex + 1) % pets.length;
  const nextPet = pets[nextPetIndex];

  dislikeBtn.disabled = true;
  likeBtn.disabled = true;
  statusMessageEl.textContent = 'Procesando...';

  const transformValue =
    direction === 'like' ? 'translateX(150%) rotate(10deg)' : 'translateX(-150%) rotate(-10deg)';
  petCardEl.style.transform = transformValue;
  petCardEl.style.opacity = '0';

  setTimeout(async () => {
    if (direction === 'like') {
      const isMatched = checkMatch(currentPet.id);

      if (isMatched) {
        await showMatchAnimation(currentPet.name);
      }
    }

    currentPetIndex = nextPetIndex;
    petCardEl.style.transition = 'none';
    petCardEl.style.transform = 'none';
    petCardEl.style.opacity = '0';

    renderPetCard(nextPet);

    setTimeout(() => {
      petCardEl.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
      petCardEl.style.opacity = '1';
      petCardEl.style.transform = 'none';
      dislikeBtn.disabled = false;
      likeBtn.disabled = false;
      isProcessing = false;
    }, 50);
  }, 500);
};

/**
 * Inicializa la aplicación y configura los event listeners.
 * Utilizamos el patrón de 'addEventListener' directamente, similar a tu ejemplo de formulario.
 */
const init = () => {
  // 1. Configurar Event Listeners con el patrón solicitado
  // Botón 'Me gusta'
  likeBtn.addEventListener('click', (event) => {
    event.preventDefault(); // Detiene el comportamiento predeterminado, aunque no es un form
    advanceToNextPet('like');
  });

  // Botón 'No me gusta'
  dislikeBtn.addEventListener('click', (event) => {
    event.preventDefault(); // Detiene el comportamiento predeterminado
    advanceToNextPet('dislike');
  });

  // 2. Iniciar la UI con la primera mascota
  renderPetCard(pets[currentPetIndex]);
  dislikeBtn.disabled = false;
  likeBtn.disabled = false;
};

// Ejecutar la inicialización
document.addEventListener('DOMContentLoaded', init);
