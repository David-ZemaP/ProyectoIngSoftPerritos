/**
 * Simula la lógica de registro de una mascota.
 * * @param {string} name 
 * @param {string} species 
 * @param {string} gender 
 * @param {string} age 
 * @param {string} breed 
 * @param {string} personality 
 * @returns {object} Un objeto con los datos de la mascota.
 */
function registrar(name, species, gender, age, breed, personality) 
{
    return { name, species, gender, age, breed, personality };
}

export default registrar;