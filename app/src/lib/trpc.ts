import type { TrpcRouter } from '#/trpc/routers'
import { createTRPCContext, createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { createTRPCClient, httpBatchLink, httpBatchStreamLink } from '@trpc/client';
import type { QueryClient } from '@tanstack/react-query';

export const { TRPCProvider, useTRPC } = createTRPCContext<TrpcRouter>();

const trpcClient = createTRPCClient<TrpcRouter>({
	links: [
		httpBatchLink({ url: 'http://localhost:3000' }),
	],
});

function makeTRPC(queryClient: QueryClient) {
	return createTRPCOptionsProxy({
		client: trpcClient,
		queryClient,
	});
}

let trpc: ReturnType<typeof makeTRPC> | undefined = undefined;

export function getTRPC(queryClient: QueryClient) {
  if (typeof window === 'undefined') {
    return makeTRPC(queryClient);
	}

	if (!trpc) {
		trpc = makeTRPC(queryClient);
	}

	return trpc;
}
