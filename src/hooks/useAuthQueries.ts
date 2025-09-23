import { useQuery } from '@tanstack/react-query';
import { authService } from '../services/authService';

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
};

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
