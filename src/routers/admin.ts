import { Hono } from "hono";
import { HttpRequestHeader, HttpStatus } from "http-enums";

import { H } from "../definitions";
import { cfztAuth } from "../middlewares/cfzt-auth";
import { HonoCtx } from "../schemas/hono-ctx";
import { fetchResources, uploadResource } from "../services/resource";

const app = new Hono<HonoCtx>();

app.use(`/*`, cfztAuth());

// = = = admin region = = =
app.post(`/:sub/:ver/`, async (c) => {
	const { sub, ver } = c.req.param();

	const tagReq = await c.req.text();
	const tag = tagReq !== "" ? tagReq : ver;
	const result = await fetchResources(c, sub, ver, tag);

	return c.json(result, HttpStatus.CREATED);
});

app.put(`/:sub/:ver/:platform`, async (c) => {
	const { sub, ver, platform } = c.req.param();

	const mime = c.req.header(HttpRequestHeader.CONTENT_TYPE);
	const result = await uploadResource(c, sub, ver, platform, c.req.raw.body, {
		mime: mime !== "application/octet-stream" ? mime : undefined,
		sha256: c.req.header(H.SHA256_HEADER),
	});

	return c.json(result, HttpStatus.CREATED);
});

export default app;
