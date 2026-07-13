import type { CountryCode }from "#/definitions/country_codes"

declare type Records = Readonly<Record<string, any>>

export declare type CfztJwtPayload<R extends Records = {}> = {
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

export interface CfztAuthVars<R extends Records = {}> {
	cfztJwt: CfztJwtPayload<R>;
}
