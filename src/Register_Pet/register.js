// src/Register_Pet/register.js

import Pet from '../models/Pet.js'; 

/**
 * Valida los campos obligatorios de una mascota y, si son válidos, 
 * crea y devuelve una nueva instancia de Pet con los datos limpios.
 * * @param {string} name - Nombre de la mascota (obligatorio).
 * @param {string} species - Especie de la mascota (obligatorio).
 * @param {string} gender - Sexo de la mascota (obligatorio).
 * @param {string | number | null} age - Edad de la mascota.
 * @param {string | null} breed - Raza de la mascota.
 * @param {string} personality - Personalidad de la mascota.
 * @returns {Pet | string} Instancia de Pet si es válido, o mensaje de error (string).
 */
export function validateAndCreatePet(name, species, gender, age, breed, personality) {
    
    // Limpia el nombre para la validación y el uso posterior.
    // Si 'name' es null o undefined, trimName será null o undefined (coalescencia nula).
    const trimmedName = name?.trim();
    
    // Validación: Se verifica que trimmedName exista (no nulo/undefined) Y no sea una cadena vacía ('').
    // Se verifica que species y gender existan (no nulos/undefined/cadenas vacías).
    if (!trimmedName || !species || !gender) {
        return 'Por favor, rellena los campos obligatorios (*): Nombre, Especie y Sexo.'; 
    }

    // El objeto petData incluye todos los campos, usando el nombre limpio (trimmedName)
    const petData = { 
        name: trimmedName,
        species, 
        gender, 
        age, 
        breed, 
        personality 
    };

    // La lógica de la clase Pet se encarga de aplicar los valores por defecto (status, ownerId, etc.)
    return Pet.fromPlain(petData); 
}

// Mantener export por defecto para compatibilidad con tests que usan import default
export default validateAndCreatePet;