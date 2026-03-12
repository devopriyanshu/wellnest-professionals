import { useQuery } from '@tanstack/react-query';
import { fetchMyCenterProfile } from '../services/centerService';

/**
 * Fetches the center profile for the currently logged-in user.
 */
export const useMyCenterProfile = () => {
  return useQuery({
    queryKey: ['myCenterProfile'],
    queryFn: fetchMyCenterProfile,
  });
};
