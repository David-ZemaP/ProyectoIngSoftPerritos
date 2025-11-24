import { auth } from '../firebase.js';
import coreMatch from '../core/matchUseCase.js';
import petsAdapter from '../adapters/petsServiceAdapter.js';
import userAdapter from '../adapters/userServiceAdapter.js';
import Pet from '../models/Pet.js';
import { checkMatch } from './match.js';
import '../services/page-guard.js';

// --- UI refs ---
const petCardEl = document.getElementById('pet-card');
const dislikeBtn = document.getElementById('dislike-btn');
const likeBtn = document.getElementById('like-btn');
const statusMessageEl = document.getElementById('status-message');
const matchMessageEl = document.getElementById('match-message');
const matchedPetNameEl = document.getElementById('matched-pet-name');
const cardWrapperEl = document.getElementById('card-wrapper');
const resetBtn = document.getElementById('reset-btn');
const toastEl = document.getElementById('toast');

// --- Estado ---
let pets = [];
let currentPetIndex = 0;
let isProcessing = false;
// --- Drag state ---
let pointerDown = false;
let startX = 0;
let startY = 0;
let currentX = 0;
let currentY = 0;
const SWIPE_THRESHOLD = 120; // px

// --- Overlays (creados una vez) ---
let likeOverlayEl = null;
let dislikeOverlayEl = null;

const createOverlays = () => {
  if (!cardWrapperEl) return;

  // Heart overlay (like)
  likeOverlayEl = document.createElement('div');
  likeOverlayEl.className = 'swipe-overlay green';
  likeOverlayEl.innerHTML = `
    <div class="overlay-icon">
      <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </div>
  `;

  // X overlay (dislike)
  dislikeOverlayEl = document.createElement('div');
  dislikeOverlayEl.className = 'swipe-overlay red';
  dislikeOverlayEl.innerHTML = `
    <div class="overlay-icon x">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" xmlns="http://www.w3.org/2000/svg">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </div>
  `;

  cardWrapperEl.appendChild(likeOverlayEl);
  cardWrapperEl.appendChild(dislikeOverlayEl);
};

/**
 * Show overlay for a short time. durationMs controls how long it stays visible.
 * If durationMs is omitted, defaults to 650ms.
 */
const showOverlay = (direction, durationMs = 650) => {
  if (!likeOverlayEl || !dislikeOverlayEl) return;
  const el = direction === 'like' ? likeOverlayEl : dislikeOverlayEl;
  const other = direction === 'like' ? dislikeOverlayEl : likeOverlayEl;
  other.style.opacity = '0';
  other.style.display = 'none';
  el.style.display = 'flex';
  el.classList.add('show');
  el.style.transform = 'scale(1.02)';
  // ensure we clear previous timeouts by storing on element
  if (el._hideTimeout) clearTimeout(el._hideTimeout);
  el._hideTimeout = setTimeout(() => {
    el.classList.remove('show');
    el.style.transform = '';
    el._hideTimeout = null;
    // keep display none after fade out
    setTimeout(() => {
      el.style.display = 'none';
    }, 180);
  }, durationMs);
};

const updateOverlayDuringDrag = (dx) => {
  if (!likeOverlayEl || !dislikeOverlayEl) return;
  const ratio = Math.min(Math.abs(dx) / SWIPE_THRESHOLD, 1);
  if (dx > 0) {
    // like
    likeOverlayEl.style.display = 'flex';
    likeOverlayEl.style.opacity = `${ratio}`;
    dislikeOverlayEl.style.opacity = '0';
    // ensure hidden after
    if (ratio === 0) likeOverlayEl.style.display = 'none';
  } else if (dx < 0) {
    dislikeOverlayEl.style.display = 'flex';
    dislikeOverlayEl.style.opacity = `${ratio}`;
    likeOverlayEl.style.opacity = '0';
    if (ratio === 0) dislikeOverlayEl.style.display = 'none';
  } else {
    likeOverlayEl.style.opacity = '0';
    dislikeOverlayEl.style.opacity = '0';
    likeOverlayEl.style.display = 'none';
    dislikeOverlayEl.style.display = 'none';
  }
};

const showToast = (text, ms = 1800) => {
  if (!toastEl) return;
  toastEl.textContent = text;
  toastEl.classList.remove('hidden');
  toastEl.classList.add('show');
  setTimeout(() => {
    toastEl.classList.remove('show');
    toastEl.classList.add('hidden');
  }, ms);
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
    : `https://placehold.co/400x500/A3A3A3/FFFFFF?text=${encodeURIComponent(
        pet.name || 'Mascota'
      )}`;

  petCardEl.innerHTML = `
    <div class="h-96 bg-cover bg-center flex items-end p-4 relative"
         style="background-image: url('${bgUrl}')">
      <div class="bg-black/60 p-4 rounded-t-lg backdrop-blur-sm w-full">
        <h2 class="text-3xl font-bold text-white">${pet.name ?? 'Sin nombre'}, ${pet.age ?? '?'} años</h2>
        <p class="text-sm text-gray-200">${pet.breed ?? '-'}</p>
      </div>
    </div>
    <div class="p-5">
      <p class="text-gray-600 italic">"${pet.personality ?? 'Sin descripción'}"</p>
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

const advanceToNextPet = (direction, { fromDrag = false } = {}) => {
  if (isProcessing) {
    return;
  }
  if (!pets.length) {
    return;
  }

  isProcessing = true;

  const currentPet = pets[currentPetIndex];
  const nextPetIndex = (currentPetIndex + 1) % pets.length;
  const nextPet = pets[nextPetIndex];

  dislikeBtn.disabled = true;
  likeBtn.disabled = true;
  statusMessageEl.textContent = 'Procesando...';

  // Mostrar overlay de like/dislike (animación centrada) en clicks
  if (!fromDrag) showOverlay(direction, 820); // persist while card animates (≈500ms) + small buffer

  const transformValue =
    direction === 'like' ? 'translateX(150%) rotate(10deg)' : 'translateX(-150%) rotate(-10deg)';
  petCardEl.style.transform = transformValue;
  petCardEl.style.opacity = '0';

  setTimeout(async () => {
    // Handle like action: save to database and check for matches
    if (direction === 'like') {
      const user = auth.currentUser;

      if (user) {
        try {
          // Use core use-case to save match
          await coreMatch.likePet(user, currentPet, userAdapter);
          console.log(`Saved match: ${currentPet.name}`);

          // Check Business Rule (Show Animation?)
          const isMatched = checkMatch(currentPet.id);
          if (isMatched) {
            await showMatchAnimation(currentPet.name ?? 'esa mascota');
          }
        } catch (error) {
          console.error('Error saving match:', error);
        }
      } else {
        console.warn('User not logged in. Match not saved.');
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
  try {
    const results = await coreMatch.loadPets(petsAdapter);
    pets = results;
  } catch (e) {
    console.error('Error cargando mascotas:', e);
    pets = [];
  }

  if (!pets.length) {
    renderPetCard(null);
    return;
  }

  renderPetCard(pets[currentPetIndex]);

  // create overlays after initial render
  createOverlays();

  // --- Pointer (drag / swipe) handlers ---
  if (petCardEl) {
    petCardEl.addEventListener('pointerdown', (ev) => {
      if (isProcessing) return;
      pointerDown = true;
      startX = ev.clientX;
      startY = ev.clientY;
      currentX = 0;
      currentY = 0;
      petCardEl.setPointerCapture(ev.pointerId);
      petCardEl.style.transition = 'none';
    });

    petCardEl.addEventListener('pointermove', (ev) => {
      if (!pointerDown) return;
      currentX = ev.clientX - startX;
      currentY = ev.clientY - startY;
      const rotate = currentX / 15;
      petCardEl.style.transform = `translate(${currentX}px, ${currentY * 0.3}px) rotate(${rotate}deg)`;
      // optional slight fade as you drag further
      petCardEl.style.opacity = `${Math.max(0.6, 1 - Math.abs(currentX) / 800)}`;
      updateOverlayDuringDrag(currentX);
    });

    petCardEl.addEventListener('pointerup', (ev) => {
      if (!pointerDown) return;
      pointerDown = false;
      try { petCardEl.releasePointerCapture(ev.pointerId); } catch (e) {}
      petCardEl.style.transition = 'transform 0.35s ease-out, opacity 0.35s ease-out';

      // determine if swipe threshold met
      if (Math.abs(currentX) > SWIPE_THRESHOLD) {
        const dir = currentX > 0 ? 'like' : 'dislike';
        // ensure overlays clear
        likeOverlayEl.style.opacity = '0';
        dislikeOverlayEl.style.opacity = '0';
        // call advance with fromDrag true so it doesn't re-show overlay twice
        advanceToNextPet(dir, { fromDrag: true });
      } else {
        // Below threshold: reset card position
        petCardEl.style.transition = 'transform 0.25s ease-out, opacity 0.25s ease-out';
        petCardEl.style.transform = 'none';
        petCardEl.style.opacity = '1';
        if (likeOverlayEl) likeOverlayEl.style.opacity = '0';
        if (dislikeOverlayEl) dislikeOverlayEl.style.opacity = '0';
      }
    });
  }

  likeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    advanceToNextPet('like');
  });
  dislikeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    advanceToNextPet('dislike');
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!pets || !pets.length) return;
      currentPetIndex = 0;
      renderPetCard(pets[currentPetIndex]);
      showToast('¡Lista reiniciada!');
    });
  }

  dislikeBtn.disabled = false;
  likeBtn.disabled = false;
};

document.addEventListener('DOMContentLoaded', init);
