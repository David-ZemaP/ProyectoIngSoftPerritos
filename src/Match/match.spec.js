import { checkMatch } from './match.js';

describe('TDD: Lógica Central de Match (checkMatch)', () => {
  it('Debe retornar TRUE para el ID que genera Match', () => {
    expect(checkMatch('pet-3')).toBe(true);
  });

  it('Debe retornar TRUE para el ID que genera Match ("pet-3")', () => {
    // La prueba TDD valida la regla de negocio: pet-3 siempre es un match.
    const petIdToLike = 'pet-3';
    const result = checkMatch(petIdToLike);
    expect(result).toBe(true);
  });

  it('Debe retornar FALSE para un ID que no genera Match ("pet-5")', () => {
    const petIdToLike = 'pet-5';
    const result = checkMatch(petIdToLike);
    expect(result).toBe(false);
  });

  it('Debe retornar FALSE si se recibe un valor nulo', () => {
    expect(checkMatch(null)).toBe(false);
  });

  it('Debe retornar FALSE si se recibe un valor indefinido', () => {
    expect(checkMatch(undefined)).toBe(false);
  });

  it('Debe retornar FALSE para un ID vacío', () => {
    expect(checkMatch('')).toBe(false);
  });
});
