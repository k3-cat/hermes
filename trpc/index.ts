import { initTRPC } from '@trpc/server';
import type { HonoCtx } from "#/types/hono-ctx";

export declare type TrpcCtx<AuthVar extends Record<string, any> = {}> = {
	env: HonoCtx<AuthVar>["Bindings"]
	var: HonoCtx<AuthVar>["Variables"]
};

const t = initTRPC.context<TrpcCtx>().create({
	jsonl: { pingMs: 15_000 }
});

export const router = t.router;
export const publicProcedure = t.procedure;
