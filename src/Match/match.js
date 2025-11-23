import { auth } from '../firebase.js';
import { userService } from '../services/user.service.js';

export const checkMatch = (petId) => {
  return true;
};

export const addMatchToUser = async (petId) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Delegate to the service
  await userService.addMatchedPet(user.uid, petId);
};
