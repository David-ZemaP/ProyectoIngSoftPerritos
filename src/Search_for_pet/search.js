function buscar({ nombre, edad, raza }) {
    const mascota = {
        nombre: 'Max',
        edad: 3,
        raza: 'Bulldog'
    };


    if (nombre && nombre === mascota.nombre) {
        throw new Error('¡Mascota Encontrada por nombre!');
    }


    if (edad !== undefined && edad === mascota.edad) {
        throw new Error('¡Mascota Encontrada por edad!');
    }

    if (raza && raza === mascota.raza) {
        throw new Error('¡Mascota Encontrada por raza!');
    }

    return '¡Mascota No Encontrada!';
}

export default buscar;
