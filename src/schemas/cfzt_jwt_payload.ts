export type CloudflareZeroTrustPayload = {
	type: string;
	iat: number;
	exp: number;
	iss: string;
	sub: string;
	aud: string;
	device_id?: string;
	email?: string;
	common_name?: string;
};
