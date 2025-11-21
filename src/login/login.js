import { auth } from '../firebase.js';
import { signInWithEmailAndPassword } from 'firebase/auth';

/**
 * Inicia sesión de un usuario en Firebase Authentication.
 * @param {string} email - Correo electrónico del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise<Object>} - Objeto con los datos del usuario autenticado
 * @throws {Error} - Si hay algún error en el proceso de inicio de sesión
 */
export async function loginUser(email, password) {
  // Validaciones
  if (!email || email.trim() === '') {
    throw new Error('El correo electrónico es requerido');
  }

  if (!password || password.trim() === '') {
    throw new Error('La contraseña es requerida');
  }

  try {
    // Iniciar sesión en Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      message: 'Inicio de sesión exitoso'
    };
  } catch (error) {
    // Manejo de errores específicos de Firebase
    if (error.code === 'auth/user-not-found') {
      throw new Error('No existe una cuenta con este correo electrónico');
    } else if (error.code === 'auth/wrong-password') {
      throw new Error('Contraseña incorrecta');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('El correo electrónico no es válido');
    } else if (error.code === 'auth/user-disabled') {
      throw new Error('Esta cuenta ha sido deshabilitada');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Demasiados intentos fallidos. Intenta más tarde');
    } else if (error.code === 'auth/invalid-credential') {
      throw new Error('Credenciales inválidas. Verifica tu email y contraseña');
    } else {
      throw new Error(error.message || 'Error al iniciar sesión');
    }
  }
}
