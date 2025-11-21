import { auth, db } from '../firebase.js';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

/**
 * Registra un nuevo usuario en Firebase Authentication y guarda sus datos en Firestore.
 * @param {string} fullName - Nombre completo del usuario
 * @param {string} email - Correo electrónico del usuario
 * @param {string} password - Contraseña del usuario
 * @param {string} confirmPassword - Confirmación de la contraseña
 * @param {string} matches - Confirmación de la contraseña
 * @returns {Promise<Object>} - Objeto con los datos del usuario registrado
 * @throws {Error} - Si hay algún error en el proceso de registro
 */
export async function registerUser(fullName, email, password, confirmPassword) {
  // Validaciones
  if (!fullName || fullName.trim() === '') {
    throw new Error('El nombre completo es requerido');
  }

  if (!email || email.trim() === '') {
    throw new Error('El correo electrónico es requerido');
  }

  if (!password || password.trim() === '') {
    throw new Error('La contraseña es requerida');
  }

  if (password !== confirmPassword) {
    throw new Error('Las contraseñas no coinciden');
  }

  if (password.length < 6) {
    throw new Error('La contraseña debe tener al menos 6 caracteres');
  }

  try {
    // Crear usuario en Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Actualizar el perfil con el nombre completo
    await updateProfile(user, {
      displayName: fullName
    });

    // Guardar datos adicionales en Firestore
    await setDoc(doc(db, 'users', user.uid), {
      fullName: fullName.trim(),
      email: email.trim(),
      createdAt: new Date().toISOString(),
      uid: user.uid
    });

    return {
      uid: user.uid,
      fullName: fullName.trim(),
      email: email.trim(),
      message: 'Usuario registrado exitosamente'
    };
  } catch (error) {
    // Manejo de errores específicos de Firebase
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('Este correo electrónico ya está registrado');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('El correo electrónico no es válido');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('La contraseña es muy débil');
    } else {
      throw new Error(error.message || 'Error al registrar usuario');
    }
  }
}
