import { auth, db } from '../firebase.js';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { searchPets, getPet } from '../services/pets.service.js';
import { updateProfile } from 'firebase/auth';

const profileDisplay = document.getElementById('profile-display');
const profileEmail = document.getElementById('profile-email');
const profileBio = document.getElementById('profile-bio');
const matchesCountEl = document.getElementById('matches-count');
const publishedCountEl = document.getElementById('published-count');
const adoptedCountEl = document.getElementById('adopted-count');

const loadProfileStats = async (user) => {
  if (!user) return;
  try {
    // 1) Fetch user document to read matches/adoptions arrays
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    const data = snap.exists() ? snap.data() : {};

    const matches = Array.isArray(data.matches) ? data.matches.length : 0;
    const adoptions = Array.isArray(data.adoptions) ? data.adoptions.length : 0;

    // 2) Count published pets (ownerId == user.uid)
    let published = 0;
    try {
      const pets = await searchPets({ ownerId: user.uid });
      published = Array.isArray(pets) ? pets.length : 0;
    } catch (e) {
      console.warn('No se pudieron obtener mascotas publicadas:', e);
      published = 0;
    }

    // Update UI
    if (matchesCountEl) matchesCountEl.textContent = String(matches);
    if (adoptedCountEl) adoptedCountEl.textContent = String(adoptions);
    if (publishedCountEl) publishedCountEl.textContent = String(published);

    // Render recent matches list (first 6)
    renderMatchesList(Array.isArray(data.matches) ? data.matches : []);
  } catch (err) {
    console.error('Error cargando datos de perfil:', err);
  }
};

const renderMatchesList = async (matchIds = []) => {
  const containerId = document.querySelector('.matches-list');
  if (!containerId) return;
  containerId.innerHTML = '';
  if (!matchIds.length) {
    containerId.innerHTML = '<p style="color:#666">No tienes matches aún.</p>';
    return;
  }

  // show up to 6 recent
  const ids = matchIds.slice(0, 6);
  for (const pid of ids) {
    try {
      const pet = await getPet(pid);
      if (!pet) continue;
      const div = document.createElement('div');
      div.className = 'match-item';
      const bg = pet.photoUrl || 'https://placehold.co/400x250/A3A3A3/FFFFFF?text=Mascota';
      div.innerHTML = `
        <div class="img" style="background-image:url('${bg}')"></div>
        <div class="meta">
          <strong>${pet.name ?? 'Sin nombre'}</strong>
          <div style="font-size:0.85rem;color:#666">${pet.breed ?? ''}</div>
        </div>
      `;
      containerId.appendChild(div);
    } catch (e) {
      console.warn('Error fetch pet for matches', e);
    }
  }
};

// Render basic profile info
const renderBasicInfo = (user) => {
  if (!user) return;
  const display = user.displayName || (user.email ? user.email.split('@')[0] : 'Usuario');
  if (profileDisplay) profileDisplay.textContent = display;
  if (profileEmail) profileEmail.textContent = user.email || '';
  // avatar initial
  if (document.getElementById('profile-avatar')) {
    document.getElementById('profile-avatar').textContent = (display && display[0]) ? display[0].toUpperCase() : 'U';
  }
  // profileBio stays as placeholder unless we fetch from user doc (optional)
};

// Listen auth state
if (typeof auth !== 'undefined' && auth) {
  try {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        renderBasicInfo(user);
        await loadProfileStats(user);
        // bind edit button
        const editBtn = document.getElementById('edit-profile-btn');
        if (editBtn) {
          editBtn.addEventListener('click', async () => {
            openInlineEditor(user);
          });
        }
        // keep modal init for legacy fallback, but prefer inline editor
        initEditModal();
      } else {
        // Not logged in — redirect to login
        window.location.href = '../login/login.html';
      }
    });
  } catch (e) {
    console.warn('Auth not available or onAuthStateChanged failed', e);
  }
}

/* Edit modal implementation */
const initEditModal = () => {
  let modal = document.getElementById('edit-modal');
  if (modal) return; // already created in DOM? If not, create DOM structure
  // Create modal HTML and append to body
  modal = document.createElement('div');
  modal.id = 'edit-modal';
  modal.innerHTML = `
    <div class="modal-backdrop"></div>
    <div class="modal-panel">
      <h3>Editar Perfil</h3>
      <label>Nombre</label>
      <input id="edit-name" type="text" style="width:100%;padding:0.5rem;border-radius:0.35rem;border:1px solid #e5e7eb;" />
      <label>Biografía</label>
      <textarea id="edit-bio" rows="4" style="width:100%;padding:0.5rem;border-radius:0.35rem;border:1px solid #e5e7eb;"></textarea>
      <div class="modal-actions">
        <button class="btn secondary" id="edit-cancel">Cancelar</button>
        <button class="btn primary" id="edit-save">Guardar</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('edit-cancel').addEventListener('click', () => {
    closeEditModal();
  });
  document.getElementById('edit-save').addEventListener('click', async () => {
    await saveProfileEdits();
  });
};

const openEditModal = async (user) => {
  const modal = document.getElementById('edit-modal');
  if (!modal) return;
  // prefill with current values from user doc
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);
  const data = snap.exists() ? snap.data() : {};
  document.getElementById('edit-name').value = user.displayName || (user.email ? user.email.split('@')[0] : '');
  document.getElementById('edit-bio').value = data.bio || '';
  modal.style.display = 'flex';
};

const closeEditModal = () => {
  const modal = document.getElementById('edit-modal');
  if (modal) modal.style.display = 'none';
};

const saveProfileEdits = async () => {
  const name = document.getElementById('edit-name').value.trim();
  const bio = document.getElementById('edit-bio').value.trim();
  const user = auth.currentUser;
  if (!user) return;
  try {
    // Update Auth displayName
    try { await updateProfile(user, { displayName: name }); } catch (e) { console.warn('updateProfile failed', e); }
    // Update user doc
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { displayName: name, bio });
    // reflect on UI
    if (profileDisplay) profileDisplay.textContent = name;
    if (profileBio) profileBio.textContent = bio;
    if (document.getElementById('profile-avatar')) document.getElementById('profile-avatar').textContent = (name[0]||'U').toUpperCase();
    closeEditModal();
  } catch (err) {
    console.error('Error saving profile edits', err);
  }
};

/* Inline editor implementation (preferred): open a form inside the profile card */
const openInlineEditor = async (user) => {
  const card = document.getElementById('profile-card');
  if (!card) return;
  // prevent opening twice
  if (card.querySelector('.inline-editor')) return;

  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);
  const data = snap.exists() ? snap.data() : {};

  // Build inline editor layout: left controls (save/cancel) remain near avatar, right form fields
  const right = document.createElement('div');
  right.className = 'inline-editor';
  right.innerHTML = `
    <div class="editor-form">
      <label>Nombre completo</label>
      <input id="inline-name" type="text" value="${escapeHtml(user.displayName || (user.email?user.email.split('@')[0]:''))}" />
      <label>Teléfono</label>
      <input id="inline-phone" type="text" value="${escapeHtml(data.phone || '')}" />
      <label>Ubicación</label>
      <input id="inline-location" type="text" value="${escapeHtml(data.location || '')}" />
      <label>Biografía</label>
      <textarea id="inline-bio">${escapeHtml(data.bio || '')}</textarea>
    </div>
  `;

  // Insert editor to the right of profile-left (which contains avatar and edit button)
  const profileLeft = card.querySelector('.profile-left');
  const profileRight = card.querySelector('.profile-right');
  if (profileRight) {
    // hide original display content and append editor
    profileRight.style.display = 'none';
    profileRight.parentNode.insertBefore(right, profileRight.nextSibling);
  } else {
    card.appendChild(right);
  }

  // Replace edit button with Save/Cancel controls (left area)
  const editBtn = document.getElementById('edit-profile-btn');
  if (editBtn && profileLeft) {
    editBtn.style.display = 'none';
    const actions = document.createElement('div');
    actions.className = 'inline-actions';
    actions.innerHTML = `
      <button id="inline-save" class="btn primary">Guardar</button>
      <button id="inline-cancel" class="btn secondary">Cancelar</button>
    `;
    profileLeft.appendChild(actions);

    document.getElementById('inline-cancel').addEventListener('click', () => {
      closeInlineEditor();
    });
    document.getElementById('inline-save').addEventListener('click', async () => {
      await saveInlineEdits();
    });
  }
};

const closeInlineEditor = () => {
  const card = document.getElementById('profile-card');
  if (!card) return;
  const editor = card.querySelector('.inline-editor');
  if (editor) editor.remove();
  const profileRight = card.querySelector('.profile-right');
  if (profileRight) profileRight.style.display = '';
  const actions = card.querySelector('.inline-actions');
  if (actions) actions.remove();
  const editBtn = document.getElementById('edit-profile-btn');
  if (editBtn) editBtn.style.display = '';
};

const saveInlineEdits = async () => {
  const name = document.getElementById('inline-name').value.trim();
  const phone = document.getElementById('inline-phone').value.trim();
  const location = document.getElementById('inline-location').value.trim();
  const bio = document.getElementById('inline-bio').value.trim();
  const user = auth.currentUser;
  if (!user) return;
  try {
    try { await updateProfile(user, { displayName: name }); } catch (e) { console.warn('updateProfile failed', e); }
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { displayName: name, phone, location, bio });
    // reflect on UI
    if (profileDisplay) profileDisplay.textContent = name;
    if (profileEmail) profileEmail.textContent = user.email || '';
    if (profileBio) profileBio.textContent = bio;
    if (document.getElementById('profile-avatar')) document.getElementById('profile-avatar').textContent = (name[0]||'U').toUpperCase();
    closeInlineEditor();
  } catch (err) {
    console.error('Error saving inline edits', err);
    alert('Error al guardar. Intenta nuevamente.');
  }
};

// small helper to avoid XSS when inserting values
function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>]/g, function(tag) {
    const charsToReplace = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };
    return charsToReplace[tag] || tag;
  });
}
