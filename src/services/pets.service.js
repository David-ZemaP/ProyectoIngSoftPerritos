// src/services/pets.service.js
import { db } from '../firebase';
import {
  collection, addDoc, doc, getDoc, getDocs,
  updateDoc, deleteDoc, query, where, orderBy, serverTimestamp
} from 'firebase/firestore';

const col = collection(db, 'pets');

export async function createPet(pet, ownerId) {
  const payload = {
    ...pet,                // { name, species, breed, age, photoUrl, tags, status }
    ownerId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const ref = await addDoc(col, payload);
  const snap = await getDoc(ref);
  return { id: ref.id, ...snap.data() };
}

export async function getPet(id) {
  const snap = await getDoc(doc(db, 'pets', id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function searchPets({ species, status, ownerId } = {}) {
  let q = col;
  const filters = [];
  if (species) filters.push(where('species', '==', species));
  if (status)  filters.push(where('status', '==', status));
  if (ownerId) filters.push(where('ownerId', '==', ownerId));
  let finalQ = filters.length ? query(col, ...filters, orderBy('createdAt', 'desc')) : query(col, orderBy('createdAt', 'desc'));
  const snaps = await getDocs(finalQ);
  return snaps.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function updatePet(id, data) {
  await updateDoc(doc(db, 'pets', id), { ...data, updatedAt: serverTimestamp() });
}

export async function deletePet(id) {
  await deleteDoc(doc(db, 'pets', id));
}
