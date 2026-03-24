import { CfztJwtPayload } from "./cfzt-jwt-payload";

export interface HonoVars {
	readonly cfztJwt?: CfztJwtPayload;
	readonly title: string;
}

export type HonoCtx = {
	Bindings: Cloudflare.Env;
	Variables: HonoVars;
};
