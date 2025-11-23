import { db } from '../firebase.js';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export const userService = {
  async addMatchedPet(userId, petId) {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      matches: arrayUnion(petId),
    });
  },

  async addAdoptedPet(userId, petId) {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      adoptions: arrayUnion(petId),
      matches: arrayRemove(petId),
    });
  },
};
