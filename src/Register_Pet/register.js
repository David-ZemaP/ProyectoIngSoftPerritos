// register.js (MANTENER ESTE CÓDIGO)
/**
 * Simula la lógica de registro de una mascota, incluyendo la validación
 * de campos obligatorios.
 * @returns {object|string} Un objeto con los datos de la mascota si es exitoso, 
 * o un string con el mensaje de error si falla la validación.
 */
function registrar(name, species, gender, age, breed, personality) 
{
    // Esta es la validación requerida por Cypress y la lógica de negocio
    if (!name || !species || !gender) {
        return 'Por favor, rellena los campos obligatorios (*): Nombre, Especie y Sexo.'; 
    }

    return { name, species, gender, age, breed, personality };
}

export default registrar;