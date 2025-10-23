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
    const newPet = {
        name,
        species,
        gender,
        age,
        breed,
        personality,
        // Default image, since image upload is not fully implemented
        image: '../assets/Max-pet.png' 
    };

    // Obtener la lista actual de mascotas de localStorage
    let pets = JSON.parse(localStorage.getItem('pets')) || [];
    
    // Agregar la nueva mascota
    pets.push(newPet);
    
    // Guardar la lista actualizada en localStorage
    localStorage.setItem('pets', JSON.stringify(pets));
    
    return newPet;
}

export default registrar;