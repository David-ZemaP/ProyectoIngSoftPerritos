import { checkMatch } from './match.js';

describe('TDD: Lógica Central de Match (checkMatch)', () => {
  it('Debe retornar TRUE para el ID que genera Match', () => {
    expect(result).toBe(true);
  });

  it('Debe retornar TRUE para el ID que genera Match ("pet-3")', () => {
    // La prueba TDD valida la regla de negocio: pet-3 siempre es un match.
    const petIdToLike = 'pet-3';
    const result = checkMatch(petIdToLike);
    expect(result).toBe(true);
  });
});
