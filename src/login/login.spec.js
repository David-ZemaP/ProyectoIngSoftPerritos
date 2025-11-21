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

describe('User Login', () => {
  beforeEach(() => {
    // Limpiar mocks antes de cada test
    jest.clearAllMocks();
  });

  it('should have a loginUser function', () => {
    expect(typeof loginUser).toBe('function');
  });

  it('should throw error if email is empty', async () => {
    await expect(loginUser('', 'password123'))
      .rejects.toThrow('El correo electrónico es requerido');
  });

  it('should throw error if email is only whitespace', async () => {
    await expect(loginUser('   ', 'password123'))
      .rejects.toThrow('El correo electrónico es requerido');
  });

  it('should throw error if password is empty', async () => {
    await expect(loginUser('test@test.com', ''))
      .rejects.toThrow('La contraseña es requerida');
  });

  it('should throw error if password is only whitespace', async () => {
    await expect(loginUser('test@test.com', '   '))
      .rejects.toThrow('La contraseña es requerida');
  });

  it('should successfully login user with valid credentials', async () => {
    const mockUser = {
      uid: 'test-uid-123',
      email: 'test@test.com',
      displayName: 'Juan Perez'
    };

    mockSignInWithEmailAndPassword.mockResolvedValue({
      user: mockUser
    });

    const result = await loginUser('test@test.com', 'password123');

    expect(result).toEqual({
      uid: 'test-uid-123',
      email: 'test@test.com',
      displayName: 'Juan Perez',
      message: 'Inicio de sesión exitoso'
    });

    expect(mockSignInWithEmailAndPassword).toHaveBeenCalled();
  });

  it('should trim whitespace from email', async () => {
    const mockUser = {
      uid: 'test-uid-123',
      email: 'test@test.com',
      displayName: 'Juan Perez'
    };

    mockSignInWithEmailAndPassword.mockResolvedValue({
      user: mockUser
    });

    await loginUser('  test@test.com  ', 'password123');

    expect(mockSignInWithEmailAndPassword).toHaveBeenCalled();
  });

  it('should handle user-not-found error', async () => {
    const firebaseError = {
      code: 'auth/user-not-found',
      message: 'User not found'
    };

    mockSignInWithEmailAndPassword.mockRejectedValue(firebaseError);

    await expect(loginUser('test@test.com', 'password123'))
      .rejects.toThrow('No existe una cuenta con este correo electrónico');
  });

  it('should handle wrong-password error', async () => {
    const firebaseError = {
      code: 'auth/wrong-password',
      message: 'Wrong password'
    };

    mockSignInWithEmailAndPassword.mockRejectedValue(firebaseError);

    await expect(loginUser('test@test.com', 'wrongpassword'))
      .rejects.toThrow('Contraseña incorrecta');
  });

  it('should handle invalid-email error', async () => {
    const firebaseError = {
      code: 'auth/invalid-email',
      message: 'Invalid email'
    };

    mockSignInWithEmailAndPassword.mockRejectedValue(firebaseError);

    await expect(loginUser('invalid-email', 'password123'))
      .rejects.toThrow('El correo electrónico no es válido');
  });

  it('should handle user-disabled error', async () => {
    const firebaseError = {
      code: 'auth/user-disabled',
      message: 'User disabled'
    };

    mockSignInWithEmailAndPassword.mockRejectedValue(firebaseError);

    await expect(loginUser('test@test.com', 'password123'))
      .rejects.toThrow('Esta cuenta ha sido deshabilitada');
  });

  it('should handle too-many-requests error', async () => {
    const firebaseError = {
      code: 'auth/too-many-requests',
      message: 'Too many requests'
    };

    mockSignInWithEmailAndPassword.mockRejectedValue(firebaseError);

    await expect(loginUser('test@test.com', 'password123'))
      .rejects.toThrow('Demasiados intentos fallidos. Intenta más tarde');
  });

  it('should handle invalid-credential error', async () => {
    const firebaseError = {
      code: 'auth/invalid-credential',
      message: 'Invalid credential'
    };

    mockSignInWithEmailAndPassword.mockRejectedValue(firebaseError);

    await expect(loginUser('test@test.com', 'password123'))
      .rejects.toThrow('Credenciales inválidas. Verifica tu email y contraseña');
  });

  it('should handle generic Firebase errors', async () => {
    const firebaseError = {
      code: 'auth/network-request-failed',
      message: 'Network error'
    };

    mockSignInWithEmailAndPassword.mockRejectedValue(firebaseError);

    await expect(loginUser('test@test.com', 'password123'))
      .rejects.toThrow('Network error');
  });
});
