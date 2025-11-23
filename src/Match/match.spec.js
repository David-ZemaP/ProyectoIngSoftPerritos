import { addMatchToUser, checkMatch } from './match.js';

import { db, auth } from '../firebase.js';

import { doc, updateDoc } from 'firebase/firestore';

jest.mock('../firebase.js', () => ({
  db: {},
  auth: { currentUser: { uid: 'test-user-123' } },
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(() => 'mock-ref'),
  updateDoc: jest.fn(),
  arrayUnion: jest.fn((val) => val),
}));

describe('TDD: Lógica Central de Match (checkMatch)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Debe retornar TRUE para el ID que genera Match', () => {
    expect(checkMatch('pet-3')).toBe(true);
  });

  // Simplified test for the "All Matches" rule
  it('Debe retornar TRUE para cualquier mascota (Regla: match con todos)', () => {
    expect(checkMatch('pet-1')).toBe(true);
    expect(checkMatch('pet-99')).toBe(true);
  });

  it('Debe agregar el ID de la mascota a la lista de matches del usuario', async () => {
    const petId = 'pet-555';

    await addMatchToUser(petId);

    expect(doc).toHaveBeenCalledWith(db, 'users', 'test-user-123');

    expect(updateDoc).toHaveBeenCalledWith(expect.anything(), {
      matches: petId,
    });
  });

  // 👇 3. Add this test case to use the 'auth' import and fix the error
  it('Debe lanzar error si el usuario no está logueado', async () => {
    const originalUser = auth.currentUser;
    auth.currentUser = null; // Simulate logout

    await expect(addMatchToUser('pet-1')).rejects.toThrow('User not authenticated');

    auth.currentUser = originalUser; // Restore user
  });
});
