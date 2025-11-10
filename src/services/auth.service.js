import { auth, googleProvider } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';

export const authService = {
  onChange(cb) {
    return onAuthStateChanged(auth, cb); // devuelve unsubscribe()
  },

  async registerEmail({ email, password, displayName }) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) await updateProfile(cred.user, { displayName });
    return cred.user;
  },

  async loginEmail({ email, password }) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  },

  async loginGoogle() {
    const cred = await signInWithPopup(auth, googleProvider);
    return cred.user;
  },

  async logout() {
    await signOut(auth);
  },
};
