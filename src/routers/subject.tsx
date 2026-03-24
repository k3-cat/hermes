import { Hono } from "hono";
import { cache } from "hono/cache";
import { HttpStatus } from "http-enums";

import { ResourcesMenu } from "../components/ResourceMenu";
import { LogicalError } from "../errors";
import { conditionalResponse } from "../middlewares/conditional-response";
import { rangeable } from "../middlewares/rangeable";
import { HonoCtx } from "../schemas/hono-ctx";
import { getManifest, getVer } from "../services/manifest";
import { r2_retrive } from "../services/r2";
import { getKeyOfLatestResourceFor, VERSION_PLACEHOLDER } from "../services/resource";

const app = new Hono<HonoCtx>();

// --- S1(I): initial req, to be redirect ---
app.get(
	"/:sub",
	cache({
		cacheName: "hrm-menu",
		cacheControl: "public, max-age=21600",
		cacheableStatusCodes: [
			HttpStatus.TEMPORARY_REDIRECT,
			HttpStatus.FOUND,
			HttpStatus.PERMANENT_REDIRECT,
			HttpStatus.MOVED_PERMANENTLY,
		],
	}),
	async (c) => {
		const { sub } = c.req.param();

		const ver = await getVer(c, sub);

		return c.redirect(`/${sub}/tag/${ver}`);
	},
);

// --- S1(F): redirect done, show the file list ---
app.get(
	`/:sub/tag/:ver`,
	cache({
		cacheName: "hrm-1f",
		cacheControl: "public, max-age=2629746, immutable",
	}),
	async (c) => {
		const { sub, ver } = c.req.param();

		const manifest = [...(await getManifest(c, sub))].map(([platform, name]): [string, string] => [
			platform.slice(sub.length + 3),
			`https://${c.env.PUBLIC_STATIC_DOMAIN}/${sub}/${name?.replace(VERSION_PLACEHOLDER, ver)}`,
		]);

		return c.render(<ResourcesMenu sub={sub} ver={ver} manifest={manifest} />, { title: `Resource Menu: ${sub}` });
	},
);

// --- S2: download ---
app.get(`/:sub/download/:ver/:name`, async (c) => {
	// sub-folder is not allowed for this service, so no escape
	const { sub, name } = c.req.param();

	return c.redirect(`https://${c.env.PUBLIC_STATIC_DOMAIN}/${sub}/${name}`, HttpStatus.MOVED_PERMANENTLY);
});

// = = = shortcuts for scripts = = =
app.get(
	`/:sub/ver`,
	cache({
		cacheName: "hrm-ver",
		cacheControl: "public, max-age=21600",
	}),
	async (c) => {
		const { sub } = c.req.param();

		const ver = await getVer(c, sub);

		return c.text(ver);
	},
);

app.get("/*", rangeable);
app.get("/*", conditionalResponse);

app.get(
	`/:sub/-/:platform`,
	cache({
		cacheName: "hrm-fd",
		cacheControl: "public, max-age=21600",
	}),
	async (c) => {
		const { sub, platform } = c.req.param();

		const key = await getKeyOfLatestResourceFor(c, sub, platform);
		const ret = await r2_retrive(c.env.R2_STATIC, key, { headers: c.req.raw.headers });
		if (!ret) {
			throw new LogicalError(HttpStatus.INTERNAL_SERVER_ERROR, {
				hrm: "r:x-d",
				msg: `'${key}' is not existed in bucket`,
			});
		}

		if (!ret.body) {
			return c.body(null, HttpStatus.NOT_MODIFIED, ret.getHeaderRecords());
		}
		return c.body(ret.body, ret.getStatusCode(), ret.getHeaderRecords());
	},
);

export default app;
