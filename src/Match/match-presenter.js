// src/Match/match-presenter.js
import '../firebase.js';                                   // inicializa Firebase
import { searchPets } from '../services/pets.service.js';  // lee mascotas desde Firestore

// --- UI refs ---
const petCardEl = document.getElementById('pet-card');
const dislikeBtn = document.getElementById('dislike-btn');
const likeBtn = document.getElementById('like-btn');
const statusMessageEl = document.getElementById('status-message');
const matchMessageEl = document.getElementById('match-message');
const matchedPetNameEl = document.getElementById('matched-pet-name');

// --- Estado ---
let pets = [];
let currentPetIndex = 0;
let isProcessing = false;

// --- Helpers ---
const checkMatch = (petId) => {
  // Mantengo tu lógica simple (match con la 3ra mascota) o ajústalo a tu criterio
  return currentPetIndex % 3 === 2 || petId === 'pet-3';
};

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

  const bgUrl = pet.photoUrl
    ? pet.photoUrl
    : `https://placehold.co/400x500/A3A3A3/FFFFFF?text=${encodeURIComponent(pet.name || 'Mascota')}`;

  petCardEl.innerHTML = `
    <div class="h-96 bg-cover bg-center flex items-end p-4 relative"
         style="background-image: url('${bgUrl}')">
      <div class="bg-black/60 p-4 rounded-t-lg backdrop-blur-sm w-full">
        <h2 class="text-3xl font-bold text-white">${pet.name ?? 'Sin nombre'}, ${pet.age ?? '?'} años</h2>
        <p class="text-sm text-gray-200">${pet.breed ?? '-'}</p>
      </div>
    </div>
    <div class="p-5">
      <p class="text-gray-600 italic">"${pet.description ?? 'Sin descripción'}"</p>
      <p class="text-xs mt-3 text-gray-400">ID: ${pet.id}</p>
    </div>
  `;
  statusMessageEl.textContent = `Viendo a ${pet.name ?? 'Mascota'}.`;
};

const showMatchAnimation = (petName) =>
  new Promise((resolve) => {
    matchedPetNameEl.textContent = `Con ${petName}.`;
    matchMessageEl.classList.remove('hidden');
    setTimeout(() => {
      matchMessageEl.classList.add('hidden');
      resolve();
    }, 2500);
  });

const advanceToNextPet = (direction) => {
  if (isProcessing) return;
  if (!pets.length) return;

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
        await showMatchAnimation(currentPet.name ?? 'esa mascota');
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

const init = async () => {
  // Carga desde Firestore (todas las mascotas ordenadas por createdAt desc)
  try {
    pets = await searchPets();
  } catch (e) {
    console.error('Error cargando mascotas:', e);
    pets = [];
  }

  if (!pets.length) {
    renderPetCard(null);
    return;
  }

  renderPetCard(pets[currentPetIndex]);

  likeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    advanceToNextPet('like');
  });
  dislikeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    advanceToNextPet('dislike');
  });

  dislikeBtn.disabled = false;
  likeBtn.disabled = false;
};

document.addEventListener('DOMContentLoaded', init);
