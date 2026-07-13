import { Context, Hono } from "hono";

import { HttpResponseHeader, HttpStatus } from "http-enums";

import { LogicalError } from "$/errors";
import type { HonoCtx } from "#/types/hono-ctx";
import { trpcServer } from '@hono/trpc-server'
import adminRoute from "./admin";
import {trpcRouter} from "$/trpc-routers"
import type { TrpcCtx } from "$/lib/trpc";

const app = new Hono<HonoCtx>();


app.route("/admin", adminRoute);

app.use("/trpc/*", trpcServer({
	router: trpcRouter,
	createContext: (_opts, c: Context<HonoCtx>) => ({
		get: c.get,
		env: c.env,
		var: c.var,
	} satisfies TrpcCtx ),
}))

app.get("*", async (c) => {
	c.header(
		HttpResponseHeader.CACHE_CONTROL,
		"public, max-age=864000, immutable",
	);
	throw new LogicalError(HttpStatus.NOT_FOUND, {
		hrm: "r:*",
		path: c.req.path,
	});
});

export default app;
