// src/services/pets.service.js
// 
// Responsabilidad: Capa de acceso a datos (DAL) para la colección 'pets' en Firestore.

import { db } from '../firebase';
import {
  collection, addDoc, doc, getDoc, getDocs,
  updateDoc, deleteDoc, query, where, orderBy, serverTimestamp
} from 'firebase/firestore';
import Pet from '../models/Pet.js';

// Referencia a la colección principal
const petsCol = collection(db, 'pets');

/**
 * Guarda una nueva mascota en la base de datos, asegurando la trazabilidad.
 * Espera una instancia de Pet ya validada y con propiedades de entidad (status, ownerId por defecto).
 * @param {Pet} petInstance - La instancia de Pet (debe ser Pet.fromPlain o Pet.fromFirestore).
 * @param {string} ownerId - El UID del propietario real o 'guest'.
 * @returns {Promise<Pet>} La instancia de Pet con el ID asignado por Firestore.
 */
// 🚨 CAMBIO AQUÍ: Renombrar la función de 'saveNewPet' a 'createPet'
export async function createPet(petInstance, ownerId) {
  
  // Nota: El presentador ya asegura que petInstance es una instancia de Pet.
  // La lógica de verificación de tipo fue eliminada para simplificar la interfaz, 
  // confiando en la capa del presentador para enviar el tipo correcto.

  const payload = {
    // Convierte la entidad Pet a un objeto plano apto para Firestore
    ...petInstance.toFirestore(), 
    
    // Asegura que el ownerId final enviado por el presentador se utilice para el guardado.
    ownerId: ownerId, 
    
    // Añade los timestamps de creación y actualización
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const ref = await addDoc(petsCol, payload);
  const snap = await getDoc(ref);
  
  // Devuelve la entidad Pet hidratada con el ID de Firestore
  return Pet.fromFirestore({ id: ref.id, data: snap.data() });
}

/**
 * Obtiene una mascota por su ID.
 * @param {string} id - El ID de la mascota en Firestore.
 * @returns {Promise<Pet | null>} La instancia de Pet o null si no existe.
 */
export async function getPet(id) {
  const snap = await getDoc(doc(db, 'pets', id));
  return snap.exists() ? Pet.fromFirestore(snap) : null;
}

/**
 * Busca mascotas aplicando filtros y ordenando por fecha de creación descendente.
 * @param {Object} filters - Objeto con filtros opcionales (species, status, ownerId).
 * @returns {Promise<Pet[]>} Un array de instancias de Pet.
 */
export async function searchPets(filters = {}) {
  const f = [];
  
  // Construcción de cláusulas where
  if (filters.species) f.push(where('species', '==', filters.species));
  if (filters.status)  f.push(where('status', '==', filters.status));
  if (filters.ownerId) f.push(where('ownerId', '==', filters.ownerId));

  // Construcción de la consulta con o sin filtros, siempre con orden
  const qy = query(petsCol, ...f, orderBy('createdAt', 'desc'));

  const snaps = await getDocs(qy);
  return snaps.docs.map(d => Pet.fromFirestore(d));
}

/**
 * Actualiza parcialmente un documento de mascota.
 * @param {string} id - El ID de la mascota a actualizar.
 * @param {Object} partial - Objeto con los campos a modificar.
 */
export async function updatePet(id, partial) {
  // Añade el timestamp de actualización automáticamente
  await updateDoc(doc(db, 'pets', id), { ...partial, updatedAt: serverTimestamp() });
}

/**
 * Elimina un documento de mascota por su ID.
 * @param {string} id - El ID de la mascota a eliminar.
 */
export async function deletePet(id) {
  await deleteDoc(doc(db, 'pets', id));
}