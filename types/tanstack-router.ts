import type { getQueryClient } from "@/lib/query";
import type { Trpc } from "./trpc-tanstack";

declare type TQuery = ReturnType<typeof getQueryClient>

export interface RouterCtx {
	query: TQuery
	trpc: Trpc
}
