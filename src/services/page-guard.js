import { requireAuth } from './auth-guard.service.js';
import { auth } from '../firebase.js';
import { signOut } from 'firebase/auth';

// Proteger esta página - requiere autenticación
requireAuth().then(() => {
  console.log('Usuario autenticado correctamente');
}).catch((error) => {
  console.error('Acceso denegado:', error);
});

// Manejar cierre de sesión en el navbar
document.addEventListener('DOMContentLoaded', () => {
  const logoutLink = document.getElementById('logout-link');
  const profileNameEl = document.getElementById('profile-name');
  const profilePill = document.getElementById('profile-pill');
  
  if (logoutLink) {
    logoutLink.addEventListener('click', async (e) => {
      e.preventDefault();
      
      try {
        await signOut(auth);
        console.log('Sesión cerrada exitosamente');
        window.location.href = '/src/login/login.html';
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
        alert('Error al cerrar sesión. Intenta nuevamente.');
      }
    });
  }

  // Ensure profile pill navigates even if href wasn't set due to timing
  if (profilePill) {
    profilePill.addEventListener('click', (e) => {
      const href = profilePill.getAttribute('href');
      // if href is missing or just '#', force navigation to profile page
      if (!href || href === '#') {
        e.preventDefault();
        window.location.href = '/src/profile/profile.html';
      }
      // otherwise allow default (will follow href)
    });
  }

  // Populate profile pill with user name when auth state changes
  try {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const name = user.displayName || (user.email ? user.email.split('@')[0] : 'Usuario');
        if (profileNameEl) profileNameEl.textContent = name;
        if (profilePill) {
          // use absolute path so it works from any page
          profilePill.setAttribute('href', '/src/profile/profile.html');
        }
      } else {
        // hide profile pill if not authenticated
        if (profilePill) profilePill.style.display = 'none';
      }
    });
  } catch (e) {
    // auth might not expose onAuthStateChanged in some test contexts - ignore
    console.warn('No se pudo enlazar onAuthStateChanged:', e);
  }
});
