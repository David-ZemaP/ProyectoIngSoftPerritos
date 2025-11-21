import { registerUser } from './signing_up.js';

// Mock de Firebase
jest.mock('../firebase.js', () => ({
  auth: {},
  db: {}
}));

// Mock de firebase/auth
const mockCreateUserWithEmailAndPassword = jest.fn();
const mockUpdateProfile = jest.fn();

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: (...args) => mockCreateUserWithEmailAndPassword(...args),
  updateProfile: (...args) => mockUpdateProfile(...args)
}));

// Mock de firebase/firestore
const mockSetDoc = jest.fn();
const mockDoc = jest.fn();

jest.mock('firebase/firestore', () => ({
  setDoc: (...args) => mockSetDoc(...args),
  doc: (...args) => mockDoc(...args)
}));

describe('User Registration', () => {
  beforeEach(() => {
    // Limpiar mocks antes de cada test
    jest.clearAllMocks();
  });

  it('should have a registerUser function', () => {
    expect(typeof registerUser).toBe('function');
  });

  it('should throw error if fullName is empty', async () => {
    await expect(registerUser('', 'test@test.com', 'password123', 'password123'))
      .rejects.toThrow('El nombre completo es requerido');
  });

  it('should throw error if fullName is only whitespace', async () => {
    await expect(registerUser('   ', 'test@test.com', 'password123', 'password123'))
      .rejects.toThrow('El nombre completo es requerido');
  });

  it('should throw error if email is empty', async () => {
    await expect(registerUser('Juan Perez', '', 'password123', 'password123'))
      .rejects.toThrow('El correo electrónico es requerido');
  });

  it('should throw error if password is empty', async () => {
    await expect(registerUser('Juan Perez', 'test@test.com', '', 'password123'))
      .rejects.toThrow('La contraseña es requerida');
  });

  it('should throw error if passwords do not match', async () => {
    await expect(registerUser('Juan Perez', 'test@test.com', 'password123', 'password456'))
      .rejects.toThrow('Las contraseñas no coinciden');
  });

  it('should throw error if password is less than 6 characters', async () => {
    await expect(registerUser('Juan Perez', 'test@test.com', '12345', '12345'))
      .rejects.toThrow('La contraseña debe tener al menos 6 caracteres');
  });

  it('should successfully register user with valid data', async () => {
    const mockUser = {
      uid: 'test-uid-123',
      email: 'test@test.com'
    };

    mockCreateUserWithEmailAndPassword.mockResolvedValue({
      user: mockUser
    });
    mockUpdateProfile.mockResolvedValue();
    mockSetDoc.mockResolvedValue();
    mockDoc.mockReturnValue('mock-doc-ref');

    const result = await registerUser('Juan Perez', 'test@test.com', 'password123', 'password123');

    expect(result).toEqual({
      uid: 'test-uid-123',
      fullName: 'Juan Perez',
      email: 'test@test.com',
      message: 'Usuario registrado exitosamente'
    });

    expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalled();
    expect(mockUpdateProfile).toHaveBeenCalledWith(mockUser, {
      displayName: 'Juan Perez'
    });
    expect(mockSetDoc).toHaveBeenCalled();
  });

  it('should trim whitespace from fullName and email', async () => {
    const mockUser = {
      uid: 'test-uid-123',
      email: 'test@test.com'
    };

    mockCreateUserWithEmailAndPassword.mockResolvedValue({
      user: mockUser
    });
    mockUpdateProfile.mockResolvedValue();
    mockSetDoc.mockResolvedValue();

    const result = await registerUser('  Juan Perez  ', '  test@test.com  ', 'password123', 'password123');

    expect(result.fullName).toBe('Juan Perez');
    expect(result.email).toBe('test@test.com');
  });

  it('should handle email-already-in-use error', async () => {
    const firebaseError = {
      code: 'auth/email-already-in-use',
      message: 'Email already in use'
    };

    mockCreateUserWithEmailAndPassword.mockRejectedValue(firebaseError);

    await expect(registerUser('Juan Perez', 'test@test.com', 'password123', 'password123'))
      .rejects.toThrow('Este correo electrónico ya está registrado');
  });

  it('should handle invalid-email error', async () => {
    const firebaseError = {
      code: 'auth/invalid-email',
      message: 'Invalid email'
    };

    mockCreateUserWithEmailAndPassword.mockRejectedValue(firebaseError);

    await expect(registerUser('Juan Perez', 'invalid-email', 'password123', 'password123'))
      .rejects.toThrow('El correo electrónico no es válido');
  });

  it('should handle weak-password error', async () => {
    const firebaseError = {
      code: 'auth/weak-password',
      message: 'Weak password'
    };

    mockCreateUserWithEmailAndPassword.mockRejectedValue(firebaseError);

    await expect(registerUser('Juan Perez', 'test@test.com', 'password123', 'password123'))
      .rejects.toThrow('La contraseña es muy débil');
  });

  it('should handle generic Firebase errors', async () => {
    const firebaseError = {
      code: 'auth/network-request-failed',
      message: 'Network error'
    };

    mockCreateUserWithEmailAndPassword.mockRejectedValue(firebaseError);

    await expect(registerUser('Juan Perez', 'test@test.com', 'password123', 'password123'))
      .rejects.toThrow('Network error');
  });
});
