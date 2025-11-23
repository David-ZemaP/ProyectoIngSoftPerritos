import { adoptPet } from './adoption.js';
import { userService } from '../services/user.service.js';
import { updatePet } from '../services/pets.service.js';

// Mock the services
jest.mock('../services/user.service.js', () => ({
  userService: {
    addAdoptedPet: jest.fn(),
  },
}));

jest.mock('../services/pets.service.js', () => ({
  updatePet: jest.fn(),
}));

describe('TDD: Adoption Logic', () => {
  const mockUserId = 'user-123';
  const mockPetId = 'pet-Luna';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should update the pet status to "adopted" and assign the owner', async () => {
    await adoptPet(mockUserId, mockPetId);

    expect(updatePet).toHaveBeenCalledWith(mockPetId, {
      status: 'adopted',
      ownerId: mockUserId,
    });
  });

  it('Should move the pet from user matches to adoptions', async () => {
    await adoptPet(mockUserId, mockPetId);

    expect(userService.addAdoptedPet).toHaveBeenCalledWith(mockUserId, mockPetId);
  });
});
