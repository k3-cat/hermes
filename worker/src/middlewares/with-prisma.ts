import type { HonoCtx } from "#/types/hono-ctx";
import { createMiddleware } from "hono/factory";
import prismaClients from '@/src/lib/prisma'

export const withPrisma = createMiddleware<HonoCtx>(async (c, next) => {
	if (!c.get("prisma")) {
		c.set("prisma", await prismaClients.create());
	}

	await next();

	return;
});
