import { CloudflareZeroTrustPayload } from "./cfzt_jwt_payload";

export interface HonoVars {
	readonly cfztJwt?: CloudflareZeroTrustPayload;
}

export type HonoCtx = {
	Bindings: Cloudflare.Env;
	Variables: HonoVars;
};
