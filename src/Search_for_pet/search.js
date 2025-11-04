function buscarMascota({ nombre, especie, genero, edad, raza }) {
    const mascota = {
        nombre: 'Max',
        edad: 3,
        raza: 'Bulldog',
        especie: 'Perro',
        genero: 'Macho'
    };


    if (nombre && nombre === mascota.nombre) {
        throw new Error('¡Mascota Encontrada por nombre!');
    }

    if (especie && especie === mascota.especie) {
        throw new Error('¡Mascota Encontrada por especie!');
    }
    if (edad !== undefined && edad === mascota.edad) {
        throw new Error('¡Mascota Encontrada por edad!');
    }

    if (raza && raza === mascota.raza) {
        throw new Error('¡Mascota Encontrada por raza!');
    }

    if (genero && genero === mascota.genero) {
        throw new Error('¡Mascota Encontrada por género!');
    }

    return '¡Mascota No Encontrada!';
}

export default buscarMascota;