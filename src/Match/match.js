export const checkMatch = (petId) => {
  return petId === 'pet-3';
};

const MOCK_PETS = [
  {
    id: 'pet-1',
    name: 'Max',
    breed: 'Golden Retriever',
    age: 3,
    description: 'Juguetón y familiar.',
  },
  {
    id: 'pet-2',
    name: 'Bella',
    breed: 'Siamés',
    age: 5,
    description: 'Reservada, ama las siestas.',
  },
  {
    id: 'pet-3',
    name: 'Luna',
    breed: 'Pastor Alemán',
    age: 2,
    description: '¡La elegida! Energía y lealtad.',
  }, // This one is configured to match
  {
    id: 'pet-4',
    name: 'Chispa',
    breed: 'Conejo',
    age: 1,
    description: 'Necesita espacio para saltar.',
  },
  {
    id: 'pet-5',
    name: 'Rocky',
    breed: 'Labrador',
    age: 4,
    description: 'Un gran amigo para correr.',
  },
];
