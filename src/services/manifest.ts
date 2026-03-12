import { Context } from "hono";
import { HttpStatus } from "http-enums";

import { LogicalError } from "../errors";
import { HonoCtx } from "../schemas/hono_ctx";

const KV_TEMP_TTL = 3600;
const KV_ALMOST_IMMUTABLE_TTL = 86400;

function verKey(sub: string) {
	return `${sub}:ver`;
}

function manifestKey(sub: string, platform: string) {
	return `${sub}:m:${platform}`;
}

export async function getVer(c: Context<HonoCtx>, sub: string) {
	const ver = await c.env.KV_UPDATE.get(verKey(sub), { cacheTtl: KV_TEMP_TTL });
	if (!ver) {
		throw new LogicalError(HttpStatus.NOT_FOUND, {
			hrm: "s:m-gv",
			msg: `config 'ver' cannot be found for subject '${sub}'`,
		});
	}

	return ver;
}

export async function setVer(c: Context<HonoCtx>, sub: string, ver: string) {
	return await c.env.KV_UPDATE.put(verKey(sub), ver);
}

export async function getManifest(c: Context<HonoCtx>, sub: string) {
	const index = await c.env.KV_UPDATE.list({ prefix: manifestKey(sub, "") });

	return await c.env.KV_UPDATE.get(
		index.keys.map((item) => item.name),
		{ cacheTtl: KV_ALMOST_IMMUTABLE_TTL },
	);
}

export async function getManifestItemFor(c: Context<HonoCtx>, sub: string, platform: string) {
	const name = await c.env.KV_UPDATE.get(manifestKey(sub, platform), { cacheTtl: KV_ALMOST_IMMUTABLE_TTL });
	if (!name) {
		throw new LogicalError(HttpStatus.NOT_FOUND, {
			hrm: "s:m-gif",
			msg: `manifest for platform '${platform}' cannot be found for subject '${sub}'`,
		});
	}

	return name;
}
