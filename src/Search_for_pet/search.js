export function buscar(pets, filters) {
    return pets.filter(pet => {
        // Filtro por nombre
        if (filters.name && !pet.name.toLowerCase().includes(filters.name.toLowerCase())) {
            return false;
        }

        // Filtro por especie
        if (filters.species !== 'todos' && pet.species.toLowerCase() !== filters.species.toLowerCase()) {
            return false;
        }

        // Filtro por sexo
        if (filters.gender !== 'todos' && pet.gender !== filters.gender) {
            return false;
        }

        // Filtro por raza
        if (filters.breed && !pet.breed.toLowerCase().includes(filters.breed.toLowerCase())) {
            return false;
        }

        // Filtro por edad
        if (filters.age !== 'todos') {
            const petAge = parseInt(pet.age, 10);
            if (isNaN(petAge)) return false; // No se puede comparar si la edad de la mascota no es un número

            switch (filters.age) {
                case '0-1':
                    if (petAge > 1) return false;
                    break;
                case '1-5':
                    if (petAge < 1 || petAge > 5) return false;
                    break;
                case '5+':
                    if (petAge < 5) return false;
                    break;
                default:
                    break;
            }
        }

        return true; // Si pasa todos los filtros, se incluye en el resultado
    });
}
