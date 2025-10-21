import registrar from './register.js';

describe("Registro de Mascota", () => {

  it("debe registrar el nombre de una mascota:", () => {
    expect(registrar("Luna", 0)).toEqual(["Luna", 0]);
  });

  it("debe registrar el nombre de una mascota diferente:", () => {
    expect(registrar("Max", 0)).toEqual(["Max", 0]);
  });

  it("debe registrar el nombre de una mascota y su edad:", () => {
    expect(registrar("Rocky", 2)).toEqual(["Rocky", 2]);
  });
//   test('debe fallar si la edad no es válida', async () => {
//     const petData = { nombre: 'Luna', edad: -2, raza: 'Labrador', descripcion: 'Muy juguetona' };
//     await expect(registerPet(petData, 1))
//       .rejects
//       .toThrow('Edad inválida');
//   });

//   test('debe registrar correctamente una mascota', async () => {
//     const petData = { nombre: 'Rocky', edad: 4, raza: 'Bulldog', descripcion: 'Tranquilo y amigable' };
//     const result = await registerPet(petData, 1);
    
//     expect(result).toHaveProperty('id');
//     expect(result).toMatchObject({
//       nombre: 'Rocky',
//       edad: 4,
//       raza: 'Bulldog',
//       descripcion: 'Tranquilo y amigable',
//       userId: 1
//     });
//   });
// });

// describe('Perfil de mascota', () => {
//   test('debe devolver los datos de una mascota registrada', async () => {
//     const petData = { nombre: 'Mia', edad: 2, raza: 'Poodle', descripcion: 'Cariñosa' };
//     const newPet = await registerPet(petData, 2);

//     const pet = await getPetById(newPet.id);
//     expect(pet.nombre).toBe('Mia');
//     expect(pet.userId).toBe(2);
//   });

//   test('debe lanzar error si la mascota no existe', async () => {
//     await expect(getPetById(999))
//       .rejects
//       .toThrow('Mascota no encontrada');
//   });
});
