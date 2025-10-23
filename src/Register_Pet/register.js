// register.js (MANTENER ESTE CÓDIGO)
/**
 * Simula la lógica de registro de una mascota, incluyendo la validación
 * de campos obligatorios.
 * @returns {object|string} Un objeto con los datos de la mascota si es exitoso, 
 * o un string con el mensaje de error si falla la validación.
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