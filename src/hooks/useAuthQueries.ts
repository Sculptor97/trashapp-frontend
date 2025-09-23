import { useQuery } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { authKeys } from '../API/queryKeys';

// Auth Query Hooks
export const useAuthQueries = () => {
  const profile = useQuery({
    queryKey: authKeys.profile(),
    queryFn: () => authService.getProfile(),
    enabled: authService.isAuthenticated(), // Only fetch if user is logged in
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    profile,
  };
};
