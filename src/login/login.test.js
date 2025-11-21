import { loginUser } from './login.js';

// Mock de Firebase
jest.mock('../firebase.js', () => ({
  auth: {}
}));

// Mock de firebase/auth
const mockSignInWithEmailAndPassword = jest.fn();

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: (...args) => mockSignInWithEmailAndPassword(...args)
}));

describe('User Login - Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully login and return user data', async () => {
    const mockUser = {
      uid: 'test-uid-123',
      email: 'test@test.com',
      displayName: 'Juan Perez'
    };

    mockSignInWithEmailAndPassword.mockResolvedValue({
      user: mockUser
    });

    const result = await loginUser('test@test.com', 'password123');

    expect(result).toHaveProperty('uid');
    expect(result).toHaveProperty('email');
    expect(result).toHaveProperty('message');
    expect(result.message).toBe('Inicio de sesión exitoso');
  });

  it('should reject with error message on invalid credentials', async () => {
    const firebaseError = {
      code: 'auth/invalid-credential',
      message: 'Invalid credential'
    };

    mockSignInWithEmailAndPassword.mockRejectedValue(firebaseError);

    await expect(loginUser('test@test.com', 'wrongpassword'))
      .rejects.toThrow();
  });
});
