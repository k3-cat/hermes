import { QueryClient } from '@tanstack/react-query';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 180_000,
      },
    },
  });
}

let queryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (typeof window === 'undefined') {
    return makeQueryClient();
	}

	if (!queryClient) {
		queryClient = makeQueryClient();
	}

	return queryClient;
}
