import type { PrismaHonoVar } from "./prisma-hono";

export declare type HonoCtx<AuthVars extends Readonly<Record<string, any>> = {}> = {
	Bindings: Cloudflare.Env;
	Variables: Readonly<{} & PrismaHonoVar & AuthVars>;
};
