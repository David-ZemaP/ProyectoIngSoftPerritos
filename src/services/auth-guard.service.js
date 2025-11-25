import { auth } from '../firebase.js';
import { onAuthStateChanged } from 'firebase/auth';

/**
 * Verifica si el usuario está autenticado.
 * Si no está autenticado, redirige al login.
 * @param {string} redirectTo - URL a la que redirigir si no está autenticado
 * @returns {Promise<Object>} - Promesa que resuelve con el usuario autenticado
 */
export function requireAuth(redirectTo = '/src/login/login.html') {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe(); // Desuscribirse después de la primera verificación
      if (user) {
        resolve(user);
      } else {
        window.location.href = redirectTo;
        reject(new Error('Usuario no autenticado'));
      }
    });
  });
}

export function requireAuth() {
  return new Promise((resolve, reject) => {
    const unsub = auth.onAuthStateChanged((user) => {
      unsub();
      if (user) resolve(user);
      else reject('No autenticado');
    });
  });
}

/**
 * Obtiene el usuario actualmente autenticado.
 * @returns {Object|null} - Usuario autenticado o null
 */
export function getCurrentUser() {
  return auth.currentUser;
}

/**
 * Verifica si hay un usuario autenticado de forma síncrona.
 * @returns {boolean} - true si hay usuario autenticado
 */
export function isAuthenticated() {
  return auth.currentUser !== null;
}

/**
 * Escucha cambios en el estado de autenticación.
 * @param {Function} callback - Función que se ejecuta cuando cambia el estado
 * @returns {Function} - Función para desuscribirse
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}
