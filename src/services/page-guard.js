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
  let profilePill = document.getElementById('profile-pill');

  // Fallback: if the markup was transformed (build/dist) and the profile link
  // lost its id or was replaced with href="#", try to find an anchor that
  // looks like the profile entry and assign it the expected id so handlers work.
  if (!profilePill) {
    const anchors = Array.from(document.querySelectorAll('a'));
    for (const a of anchors) {
      const txt = (a.textContent || '').trim();
      const hasUserIcon = a.querySelector && a.querySelector('.fa-user');
      // Heuristics: contains 'Perfil' text or contains a user icon
      if (txt.includes('Perfil') || txt.includes('Mi Perfil') || hasUserIcon) {
        a.id = 'profile-pill';
        profilePill = a;
        console.log('[page-guard] Assigned id profile-pill to anchor:', a);
        break;
      }
    }
  }
  
  if (logoutLink) {
    logoutLink.addEventListener('click', async (e) => {
      e.preventDefault();
      
      try {
        await signOut(auth);
        console.log('Sesión cerrada exitosamente');
          window.location.href = 'login/login.html';
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
      console.log('[page-guard] profile-pill click, href=', href);
      // if href is missing or just '#', force navigation to profile page
      // treat empty or any hash-only href as missing
      if (!href || href === '#' || href.endsWith('#') || href.indexOf('#') === 0) {
        e.preventDefault();
        // Use absolute path so navigation works from any route served by the dev server
        const abs = `${window.location.origin}/src/profile/profile.html`;
        window.location.href = abs;
        return;
      }
      // If href exists but is relative and may not resolve correctly, normalize to absolute
      try {
        const resolved = new URL(href, window.location.href).href;
        // If resolved points to the same page (no-op), still force absolute profile URL
        if (resolved === window.location.href) {
          e.preventDefault();
          window.location.href = `${window.location.origin}/src/profile/profile.html`;
        }
        // otherwise allow default navigation
      } catch (err) {
        // If URL resolution fails for any reason, fallback to absolute link
        e.preventDefault();
        window.location.href = `${window.location.origin}/src/profile/profile.html`;
      }
    });
  }

  // Populate profile pill with user name when auth state changes
  try {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const name = user.displayName || (user.email ? user.email.split('@')[0] : 'Usuario');
        if (profileNameEl) profileNameEl.textContent = name;
        if (profilePill) {
          // prefer an absolute path so it works from any page served by Parcel
          profilePill.setAttribute('href', `${window.location.origin}/src/profile/profile.html`);
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
