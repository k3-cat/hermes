import { Buffer } from "node:buffer";
import * as Sentry from "@sentry/cloudflare";
import { Context } from "hono";
import { HttpStatus } from "http-enums";

import { LogicalError } from "../errors";
import { HonoCtx } from "../schemas/hono_ctx";
import { getManifest, getManifestItemFor, getVer, setVer } from "./manifest";
import { detectMimeFromName } from "./mime";
import { r2_upload } from "./r2";

export const VERSION_PLACEHOLDER = "%{ver}%";

const KV_ALMOST_IMMUTABLE_TTL = 86400;

export async function getKeyOfLatestResourceFor(c: Context<HonoCtx>, sub: string, platform: string) {
	const ver = await getVer(c, sub);
	const name = await getManifestItemFor(c, sub, platform);

	return `${sub}/${name.replace(VERSION_PLACEHOLDER, ver)}`;
}

export async function fetchResources(c: Context<HonoCtx>, sub: string, ver: string, tag: string) {
	const endpoint = await c.env.KV_UPDATE.get(`${sub}:endpoint`, { cacheTtl: KV_ALMOST_IMMUTABLE_TTL });
	if (!endpoint) {
		throw new LogicalError(HttpStatus.NOT_FOUND, {
			hrm: "s:r-fr",
			msg: `config 'endpoint' cannot be found for subject '${sub}'`,
		});
	}
	const manifest = await getManifest(c, sub);
	const result = await Promise.all(
		manifest.entries().map(async ([platform, nameTemplate]) => {
			const name = nameTemplate?.replace(VERSION_PLACEHOLDER, ver);
			if (!name) {
				Sentry.logger.error("missing manifest");
				return `!!! missing manifest item for '${platform}' !!!`;
			}
			const key = `${sub}/${name}`;
			const url = `${endpoint}/${tag}/${name}`;
			const fetchRes = await fetch(url, { redirect: "follow" });
			const uploadRet = await r2_upload(c.env.R2_STATIC, key, fetchRes.body, {
				httpMetadata: { contentType: detectMimeFromName(name) },
			});

			return uploadRet!;
		}),
	);

	await setVer(c, sub, ver);

	return result;
}

export async function uploadResource(
	c: Context<HonoCtx>,
	sub: string,
	ver: string,
	platform: string,
	data: ReadableStream | null,
	options?: { mime?: string; sha256?: string },
) {
	const name = (await getManifestItemFor(c, sub, platform))?.replace(VERSION_PLACEHOLDER, ver);
	const key = `${sub}/${name}`;
	const ret = await r2_upload(c.env.R2_STATIC, key, data, {
		httpMetadata: { contentType: options?.mime ?? detectMimeFromName(name) },
		sha256: options?.sha256 ? Buffer.from(options.sha256, "hex").buffer : undefined,
	});

	return ret!;
}
