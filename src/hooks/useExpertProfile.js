import { useQuery } from '@tanstack/react-query';
import { fetchMyExpertProfile } from '../services/expertService';

/**
 * Fetches the expert profile for the currently logged-in user.
 */
export const useMyExpertProfile = () => {
  return useQuery({
    queryKey: ['myExpertProfile'],
    queryFn: fetchMyExpertProfile,
  });
};
