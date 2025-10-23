import registrar from './register.js'; // Ahora esto apunta al archivo register.js creado

const DEFAULT_SPECIES = 'perro';
const DEFAULT_GENDER = 'macho';
const DEFAULT_AGE = '';
const DEFAULT_BREED = '';
const DEFAULT_PERSONALITY = '';

describe("Registro de Mascota (ADAPTADO)", () => {

    it("debe registrar el nombre de una mascota (Mínimo requerido):", () => {
        const petName = "Luna";
        expect(registrar(petName, DEFAULT_SPECIES, DEFAULT_GENDER, DEFAULT_AGE, DEFAULT_BREED, DEFAULT_PERSONALITY)).toEqual({
            name: petName,
            species: DEFAULT_SPECIES,
            gender: DEFAULT_GENDER,
            age: DEFAULT_AGE,
            breed: DEFAULT_BREED,
            personality: DEFAULT_PERSONALITY
        });
    });

    it("debe registrar el nombre de una mascota diferente (Mínimo requerido):", () => {
        const petName = "Max";
        expect(registrar(petName, DEFAULT_SPECIES, DEFAULT_GENDER, DEFAULT_AGE, DEFAULT_BREED, DEFAULT_PERSONALITY)).toEqual({
            name: petName,
            species: DEFAULT_SPECIES,
            gender: DEFAULT_GENDER,
            age: DEFAULT_AGE,
            breed: DEFAULT_BREED,
            personality: DEFAULT_PERSONALITY
        });
    });

    it("debe registrar nombre, especie, sexo y edad:", () => {
        const petName = "Rocky";
        const petAge = '2 años';
        expect(registrar(petName, DEFAULT_SPECIES, DEFAULT_GENDER, petAge, DEFAULT_BREED, DEFAULT_PERSONALITY)).toEqual({
            name: petName,
            species: DEFAULT_SPECIES,
            gender: DEFAULT_GENDER,
            age: petAge,
            breed: DEFAULT_BREED,
            personality: DEFAULT_PERSONALITY
        });
    });

    it("debe registrar nombre, especie, sexo, raza y edad:", () => {
        const petName = "Mia";
        const petAge = '4 años';
        const petBreed = "Schnauzer";
        expect(registrar(petName, DEFAULT_SPECIES, DEFAULT_GENDER, petAge, petBreed, DEFAULT_PERSONALITY)).toEqual({
            name: petName,
            species: DEFAULT_SPECIES,
            gender: DEFAULT_GENDER,
            age: petAge,
            breed: petBreed,
            personality: DEFAULT_PERSONALITY
        });
    });

    it("debe registrar nombre, especie, sexo, raza, edad y personalidad:", () => {
        const petName = "Bella";
        const petAge = '3 años';
        const petBreed = "Beagle";
        const petPersonality = "Muy juguetona";
        expect(registrar(petName, DEFAULT_SPECIES, DEFAULT_GENDER, petAge, petBreed, petPersonality)).toEqual({
            name: petName,
            species: DEFAULT_SPECIES,
            gender: DEFAULT_GENDER,
            age: petAge,
            breed: petBreed,
            personality: petPersonality
        });
    });

    it("debe registrar con una especie y un sexo diferentes:", () => {
        const petName = "Tom";
        const newSpecies = 'gato';
        const newGender = 'hembra';
        expect(registrar(petName, newSpecies, newGender, DEFAULT_AGE, DEFAULT_BREED, DEFAULT_PERSONALITY)).toEqual({
            name: petName,
            species: newSpecies,
            gender: newGender,
            age: DEFAULT_AGE,
            breed: DEFAULT_BREED,
            personality: DEFAULT_PERSONALITY
        });
    });
});