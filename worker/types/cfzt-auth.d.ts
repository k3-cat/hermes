import type { CountryCode }from "@/definitions/country_codes"
import type { HonoCtx } from "./hono-ctx";

export declare type CfztJwtPayload<R extends Record = {}> = {
	iss: string;
	aud: string;
	sub: string;

	iat: number;
	nbf: number;
	exp: number;

	identity_nonce: string;
} & ({
	type: "app";

	email: string;
	custom: R;
	country: CountryCode,
} | {
	type: "service";

	device_id: string;
	common_name: string;
});

interface CfztAuthVars {
	cfztJwt: CfztJwtPayload;
}

export declare type HonoCtxWithAuth<R extends Record = {}> = HonoCtx<CfztAuthVars<R>>;
