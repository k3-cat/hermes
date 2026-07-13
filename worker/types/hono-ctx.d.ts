import type { CfztJwtPayload } from "./cfzt-auth";
import type { PrismaClient } from "@/prisma/.gen/client";

declare type VariableStore = Readonly<Record<string, any>>

interface HonoVars {
	prisma: PrismaClient
}

export declare type HonoCtx<AuthVars extends VariableStore = {}> = {
	Bindings: Cloudflare.Env;
	Variables: Readonly<HonoVars> & AuthVars;
};
