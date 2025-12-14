import { QueryClient } from '@tanstack/react-query';
import clientErrorHandler from '@/utils/handlers/clientError.handler';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 10_000,
    },
    mutations: {
      onError: (error) => clientErrorHandler(error),
      retry: 1,
    },
  },
});
