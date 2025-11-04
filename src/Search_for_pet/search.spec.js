import buscarMascota from '../Search_for_pet/search.js';

describe('Búsqueda de mascota', () => {

    it('debe encontrar la mascota por nombre', () => {
        expect(() => buscarMascota({ nombre: 'Max' })).toThrow('¡Mascota Encontrada por nombre!');
    });

    it('debe encontrar la mascota por edad', () => {
        expect(() => buscarMascota({ edad: 3 })).toThrow('¡Mascota Encontrada por edad!');
    });

    it('debe encontrar la mascota por raza', () => {
        expect(() => buscarMascota({ raza: 'Bulldog' })).toThrow('¡Mascota Encontrada por raza!');
    });

    it('debe retornar mensaje si no se encuentra la mascota', () => {
        const result = buscarMascota({ nombre: 'Luna', edad: 2, raza: 'Labrador' });
        expect(result).toBe('¡Mascota No Encontrada!');
    });
});
