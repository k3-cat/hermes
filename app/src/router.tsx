import { createHashHistory, createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";
import { getQueryClient } from "@/lib/query";
import { getTRPC } from "@/lib/trpc";
import { QueryClientProvider } from "@tanstack/react-query";
import { PendingIndicator } from "@/components/PendingIndicator";

const hashHistory = createHashHistory()

export function getRouter() {
	const query = getQueryClient();
	const trpc = getTRPC(query);

	const router = createTanStackRouter({
		routeTree,
		history: hashHistory,
		scrollRestoration: true,
		defaultStaleTime: 5_000,
		defaultPreload: "intent",
		context: {
			query,
			trpc,
		},
		defaultPendingComponent: PendingIndicator,
		Wrap: (props) => (
			<QueryClientProvider client={query}>
				{props.children}
			</QueryClientProvider>
		),
	});

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
