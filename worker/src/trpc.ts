import { initTRPC } from '@trpc/server';
import type { TrpcCtx } from '../types/trpc-ctx';

const t = initTRPC.context<TrpcCtx>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
