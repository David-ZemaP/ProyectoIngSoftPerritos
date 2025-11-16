// src/Register_Pet/register.presenter.spec.js

// --- CONFIGURACIÓN DE MOCKING ---

// 1. Mock para la función de validación (validateAndCreatePet)
// Renombramos la variable del mock para mayor claridad
const mockValidateAndCreatePet = jest.fn(); 
jest.mock('./register.js', () => ({
    __esModule: true,
    // Usamos jest.requireActual para simular correctamente la exportación por defecto
    validateAndCreatePet: mockValidateAndCreatePet, // Usamos el mock renombrado
    // También exportamos por defecto para compatibilidad con imports default
    default: mockValidateAndCreatePet,
}));

// Aseguramos la misma mock usando otra forma de ruta por si la resolución de módulos difiere
jest.mock('../Register_Pet/register.js', () => ({
    __esModule: true,
    validateAndCreatePet: mockValidateAndCreatePet,
    default: mockValidateAndCreatePet,
}));

// También exponemos el mock en global para facilitar su acceso desde el módulo bajo prueba
// (algunas configuraciones de Jest/ESM pueden no propagar el mock como esperamos).
global.__mockValidateAndCreatePet = mockValidateAndCreatePet;

// 2. Mock para el servicio de la BD (pets.service.js)
const mockCreatePet = jest.fn();
jest.mock('../services/pets.service.js', () => ({
    createPet: mockCreatePet,
}));

// También exponemos el mock del servicio en global para compatibilidad en algunos entornos
global.__mockCreatePet = mockCreatePet;

// 3. Mock para Firebase Auth
const MOCK_AUTH_USER_ID = 'user_test_123';
const mockAuth = {
    currentUser: { uid: MOCK_AUTH_USER_ID },
};

jest.mock('../firebase.js', () => ({
    auth: mockAuth, 
}));

// 4. Importación de la clase Pet (para verificar instancias)
import Pet from '../models/Pet.js';

// --- IMPORTACIÓN DE LA FUNCIÓN A TESTEAR ---
import { handlePetRegistration } from '../Register_Pet/register.presenter.js'; 

// --- Constantes de Ayuda ---
const DEFAULT_FORM_DATA = { 
    name: 'Luna', 
    species: 'perro', 
    gender: 'hembra', 
    age: '2', 
    breed: 'Beagle', 
    personality: 'juguetona' 
};
const MOCK_USER = { uid: MOCK_AUTH_USER_ID }; // Usamos la misma constante
const ERROR_MESSAGE = 'Por favor, rellena los campos obligatorios (*): Nombre, Especie y Sexo.';

describe('Presenter: handlePetRegistration (Flujo completo)', () => {
    
    // Limpiar mocks antes de cada test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ==============================================
    // A. PRUEBAS DE VALIDACIÓN Y ERROR
    // ==============================================

    it('1. Debe devolver el mensaje de error de validación y NO llamar al servicio si la validación falla', async () => {
        // Configurar el mock de 'validateAndCreatePet' para que devuelva un error (string)
        mockValidateAndCreatePet.mockReturnValueOnce(ERROR_MESSAGE);

        const result = await handlePetRegistration({ name: '', species: 'perro' }, MOCK_USER);

        // Aserción 1: Verifica que se devuelve el error de validación
        expect(result).toBe(ERROR_MESSAGE);

        // Aserción 2: Verifica que el servicio de guardado NO fue llamado
        expect(mockCreatePet).not.toHaveBeenCalled();
    });
    
    // ==============================================
    // B. PRUEBAS DE FLUJO EXITOSO
    // ==============================================

    it('2. Debe llamar a validateAndCreatePet, crear la instancia de Pet y llamar a createPet para guardarla', async () => {
        
        // 1. Configurar el mock de validación para que devuelva una Pet *lista* para persistir.
        // Simulamos que validateAndCreatePet ya hace la construcción completa:
        const mockPetInstance = new Pet({ 
            ...DEFAULT_FORM_DATA, 
            status: 'available', 
            ownerId: 'guest' // El valor inicial de Pet
        });
        mockValidateAndCreatePet.mockReturnValue(mockPetInstance); // Devuelve la Pet ya construida
        
        // 2. Configurar el mock de 'createPet' para que devuelva el resultado guardado
        const mockPetGuardada = new Pet({ ...mockPetInstance, id: 'db_id_456' });
        mockCreatePet.mockResolvedValue(mockPetGuardada);

        const result = await handlePetRegistration(DEFAULT_FORM_DATA, MOCK_USER);

        // Aserción 1: Verifica que validateAndCreatePet fue llamado con los datos limpios del formulario.
        // Se corrige el orden de los argumentos: (name, species, gender, age, breed, personality)
        expect(mockValidateAndCreatePet).toHaveBeenCalledWith(
            DEFAULT_FORM_DATA.name, 
            DEFAULT_FORM_DATA.species, 
            DEFAULT_FORM_DATA.gender, 
            DEFAULT_FORM_DATA.age,    // Age (4to argumento)
            DEFAULT_FORM_DATA.breed,  // Breed (5to argumento)
            DEFAULT_FORM_DATA.personality // Personality (6to argumento)
        );

        // Aserción 2: Verifica que 'createPet' fue llamado
        expect(mockCreatePet).toHaveBeenCalledTimes(1);
        
        // Aserción 3: Verifica los argumentos de la llamada al servicio
        const [petInstanceSent, ownerIdSent] = mockCreatePet.mock.calls[0];
        
        // El presentador DEBE enviar la instancia de Pet recibida de la unidad de validación
        expect(petInstanceSent).toBe(mockPetInstance); 
        
        // El presentador DEBE obtener el ownerId del currentUser (MOCK_USER)
        expect(ownerIdSent).toBe(MOCK_USER.uid);
        
        // Aserción 4: El resultado devuelto es la mascota con el ID de la BD
        expect(result).toBe(mockPetGuardada); 
    });

    it('3. Debe asignar "guest" como ownerId y pasarlo a createPet si currentUser es null', async () => {
        
        const mockPetInstance = new Pet(DEFAULT_FORM_DATA);
        mockValidateAndCreatePet.mockReturnValue(mockPetInstance); 
        const mockPetGuardada = new Pet({ ...mockPetInstance, id: 'db_id_456' });
        mockCreatePet.mockResolvedValue(mockPetGuardada);
        
        await handlePetRegistration(DEFAULT_FORM_DATA, null); // Pasamos null como currentUser

        // Aserción: Verifica que 'createPet' fue llamado con el ownerId 'guest'
        const [petInstanceSent, ownerIdSent] = mockCreatePet.mock.calls[0];
        
        // El ownerId enviado al servicio debe ser 'guest'
        expect(ownerIdSent).toBe('guest'); 
        
        // Aunque la instancia Pet creada por la unidad tendrá ownerId: 'guest' por defecto, 
        // el presentador usa el ownerId derivado de currentUser para la llamada al servicio.
        expect(petInstanceSent.ownerId).toBe('guest'); 
    });

    // ==============================================
    // C. PRUEBAS DE ERRORES DE PERSISTENCIA
    // ==============================================

    it('4. Debe lanzar un error con el mensaje genérico si la función createPet del servicio falla', async () => {
        
        const mockPetInstance = new Pet(DEFAULT_FORM_DATA);
        mockValidateAndCreatePet.mockReturnValue(mockPetInstance);
        
        // Simular que createPet lanza un error (falla de BD o red)
        const mockError = new Error('Firestore connection failed');
        mockCreatePet.mockRejectedValueOnce(mockError);

        // Aserción: Esperamos que el presentador atrape el error del servicio y lance el mensaje genérico
        await expect(handlePetRegistration(DEFAULT_FORM_DATA, MOCK_USER)).rejects.toThrow(
            'Ocurrió un error inesperado al registrar la mascota.'
        );
        
        // Verificamos que el servicio fue llamado antes de fallar
        expect(mockCreatePet).toHaveBeenCalledTimes(1);
    });
});