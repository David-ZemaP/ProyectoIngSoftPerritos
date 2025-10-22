// tests/registerPet.test.js
import { registrar, registerPet } from '../src/Register_Pet/registerPet.js';

describe('Registro de mascota', () => {

    it('debe registrar el nombre de una mascota', () => {
    // Esperamos que registrar retorne el mensaje correcto
    expect(() => registrar('Luna')).toThrow('¡Mascota Registrada!');
    });

  it('debe fallar si la edad no es válida', async () => {
    const petData = { nombre: 'Luna', edad: -2, raza: 'Labrador', descripcion: 'Muy juguetona' };
    await expect(registerPet(petData, 1))
      .rejects
      .toThrow('Edad inválida');
  });

  it('debe registrar correctamente una mascota', async () => {
    const petData = { nombre: 'Rocky', edad: 4, raza: 'Bulldog', descripcion: 'Tranquilo y amigable' };
    const result = await registerPet(petData, 1);

    expect(result).toHaveProperty('id');
    expect(result).toMatchObject({
      nombre: 'Rocky',
      edad: 4,
      raza: 'Bulldog',
      descripcion: 'Tranquilo y amigable',
      userId: 1
    });
  });
});