// src/services/pets.service.js
import { db } from '../firebase';
import {
  collection, addDoc, doc, getDoc, getDocs,
  updateDoc, deleteDoc, query, where, orderBy, serverTimestamp
} from 'firebase/firestore';
import Pet from '../models/Pet.js';

const petsCol = collection(db, 'pets');

export async function createPet(petOrPlain, ownerId) {
  const pet = petOrPlain instanceof Pet
    ? petOrPlain
    : Pet.fromPlain({ ...petOrPlain, ownerId });

  const payload = {
    ...pet.toFirestore(),
    ownerId: ownerId ?? pet.ownerId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const ref = await addDoc(petsCol, payload);
  const snap = await getDoc(ref);
  return Pet.fromFirestore({ id: ref.id, data: snap.data() });
}

export async function getPet(id) {
  const snap = await getDoc(doc(db, 'pets', id));
  return snap.exists() ? Pet.fromFirestore(snap) : null;
}

export async function searchPets(filters = {}) {
  const f = [];
  if (filters.species) f.push(where('species', '==', filters.species));
  if (filters.status)  f.push(where('status', '==', filters.status));
  if (filters.ownerId) f.push(where('ownerId', '==', filters.ownerId));

  const qy = f.length ? query(petsCol, ...f, orderBy('createdAt', 'desc'))
                      : query(petsCol, orderBy('createdAt', 'desc'));

  const snaps = await getDocs(qy);
  return snaps.docs.map(d => Pet.fromFirestore(d));
}

export async function updatePet(id, partial) {
  await updateDoc(doc(db, 'pets', id), { ...partial, updatedAt: serverTimestamp() });
}

export async function deletePet(id) {
  await deleteDoc(doc(db, 'pets', id));
}
