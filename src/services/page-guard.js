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
  
  if (logoutLink) {
    logoutLink.addEventListener('click', async (e) => {
      e.preventDefault();
      
      try {
        await signOut(auth);
        console.log('Sesión cerrada exitosamente');
        window.location.href = '../login/login.html';
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
        alert('Error al cerrar sesión. Intenta nuevamente.');
      }
    });
  }
});
