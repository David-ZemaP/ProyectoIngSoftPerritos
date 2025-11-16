// src/Register_Pet/register.spec.js

// NOTA: mockPetsService y el mock de pets.service.js son estrictamente necesarios 
// para la prueba '1. Debe devolver el mensaje de error y NO llamar al servicio...' 
// si la función registrar usara el servicio. Dado que validateAndCreatePet NO lo usa, 
// este mocking es redundante aquí, pero lo mantendremos por contexto.

const mockPetsService = {
    // Usamos 'createPet' para ser coherentes con el servicio real
    createPet: jest.fn(), 
};

// 2. Mockear la importación de pets.service.js
// La ruta correcta debe ser '../services/pets.service'.
jest.mock('../services/pets.service', () => ({
    // El servicio real exporta funciones nombradas (createPet)
    createPet: mockPetsService.createPet, 
}));

// Importamos la función con el nombre limpio.
// ¡Recuerda actualizar tu archivo 'register.js' para exportar 'validateAndCreatePet'!
import validateAndCreatePet from "./register"; 
import Pet from '../models/Pet'; 

beforeEach(() => {
    // Limpiamos el mock del servicio entre cada test
    mockPetsService.createPet.mockClear(); 
});

// --- Constantes de Ayuda ---
const DEFAULT_NAME = "TestPet";
const DEFAULT_SPECIES = 'perro';
const DEFAULT_GENDER = 'macho';
const ERROR_MESSAGE = 'Por favor, rellena los campos obligatorios (*): Nombre, Especie y Sexo.';


describe("Validación y Creación de Mascota (Unidad)", () => { // Renombrar la suite

    it("1. Debe devolver el mensaje de error si faltan campos obligatorios", () => {
        
        // Falta Nombre
        expect(validateAndCreatePet("", DEFAULT_SPECIES, DEFAULT_GENDER)).toEqual(ERROR_MESSAGE); 
        
        // Verifica que NO se llamó al servicio (Aunque validateAndCreatePet no lo hace)
        expect(mockPetsService.createPet).not.toHaveBeenCalled(); 
    });

    it("2. Debe crear una instancia de Pet válida (Mínimo requerido)", () => { // Simplificar nombre del test
        const petName = "Luna";
        
        const petInstance = validateAndCreatePet(petName, DEFAULT_SPECIES, DEFAULT_GENDER);
        
        // Aserciones
        expect(petInstance).toBeInstanceOf(Pet);
        expect(petInstance.name).toBe(petName);
        expect(petInstance.status).toBe('available'); 
    });

    it("3. Debe crear una instancia de Pet con todos los campos opcionales", () => {
        const petName = "Bella";
        const petAge = '3 años';
        const petBreed = "Beagle";
        const petPersonality = "Muy juguetona";

        const petInstance = validateAndCreatePet(petName, DEFAULT_SPECIES, DEFAULT_GENDER, petAge, petBreed, petPersonality);
        
        // Aserciones
        expect(petInstance).toBeInstanceOf(Pet);
        expect(petInstance.name).toBe(petName);
        expect(petInstance.age).toBe(petAge);
        expect(petInstance.breed).toBe(petBreed);
        expect(petInstance.personality).toBe(petPersonality);
        expect(petInstance.ownerId).toBe('guest'); 
    });

    it("4. Debe devolver un mensaje de error si se usan solo espacios en el nombre", () => {
        // Un nombre que solo contiene espacios ("   ") debe ser tratado como vacío (FALSY).
        expect(validateAndCreatePet("   ", DEFAULT_SPECIES, DEFAULT_GENDER)).toEqual(ERROR_MESSAGE);
    });

    it("5. Debe devolver error si falta solo la especie", () => {
        expect(validateAndCreatePet(DEFAULT_NAME, "", DEFAULT_GENDER)).toEqual(ERROR_MESSAGE);
    });

    it("6. Debe devolver error si falta solo el sexo", () => {
        // Probando con 'null' (el campo es obligatorio)
        expect(validateAndCreatePet(DEFAULT_NAME, DEFAULT_SPECIES, null)).toEqual(ERROR_MESSAGE); 
    });

    it("7. Debe manejar 'edad' con valor cero (0) si se proporciona (considerándolo como 'opcional válido')", () => {
        const petInstance = validateAndCreatePet(DEFAULT_NAME, DEFAULT_SPECIES, DEFAULT_GENDER, 0, undefined, undefined); // Usar undefined para los opcionales faltantes
        
        expect(petInstance).toBeInstanceOf(Pet);
        expect(petInstance.age).toBe(0); 
    });

    it("8. Debe asignar valores por defecto a los campos opcionales si no se pasan", () => {
        
        // Llama con solo los obligatorios. Los argumentos opcionales no pasados son 'undefined'.
        const petInstance = validateAndCreatePet(DEFAULT_NAME, DEFAULT_SPECIES, DEFAULT_GENDER); 
        
        expect(petInstance).toBeInstanceOf(Pet);
        // Verificamos los valores por defecto establecidos por la clase Pet:
        expect(petInstance.age).toBe(null); 
        expect(petInstance.breed).toBe(null);
        expect(petInstance.personality).toBe(''); 
    });
    
    it("9. Debe asegurar que la entidad Pet asigna correctamente el 'status' y 'ownerId' por defecto", () => {
        const petInstance = validateAndCreatePet(DEFAULT_NAME, DEFAULT_SPECIES, DEFAULT_GENDER);
        
        expect(petInstance).toBeInstanceOf(Pet);
        // Verificarlos aquí asegura la correcta integración con el constructor de Pet.
        expect(petInstance.status).toBe('available');
        expect(petInstance.ownerId).toBe('guest');
        expect(petInstance.createdAt).toBe(null);
    });
    
    it("10. Debe crear un objeto Pet listo para Firestore (uso de toFirestore)", () => {
        const petName = "Rocky";
        const petInstance = validateAndCreatePet(petName, 'gato', 'hembra', '2 años', 'siames', 'dormilon');
        
        // El objeto toFirestore no debe incluir 'id'.
        const firestoreData = petInstance.toFirestore();
        
        expect(firestoreData).toEqual({
            name: petName,
            species: 'gato',
            gender: 'hembra',
            age: '2 años',
            breed: 'siames',
            personality: 'dormilon',
            status: 'available', 
            ownerId: 'guest',    
            photoUrl: null,
            createdAt: null,
            updatedAt: null,
        });
    });
});