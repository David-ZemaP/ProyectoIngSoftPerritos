// tests/registerPet.test.js
import buscar from '../Search_for_pet/search.js';
describe('Busqueda de mascota', () => {

    it('debe buscar el nombre de una mascota', () => {
    // Esperamos que buscar retorne el mensaje correcto
    expect(() => buscar('Max')).toThrow('¡Mascota Encontrada!');
    });

//   it('debe fallar si la edad no es válida', async () => {
//     const petData = { nombre: 'Luna', edad: -2, raza: 'Labrador' };
//     await expect(registerPet(petData, 1))
//       .rejects
//       .toThrow('Edad inválida');
//   });

//   it('debe registrar correctamente una mascota', async () => {
//     const petData = { nombre: 'Rocky', edad: 4, raza: 'Bulldog' };
//     const result = await registerPet(petData, 1);

//     });
//   });
});