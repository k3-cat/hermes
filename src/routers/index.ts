import { Hono } from "hono";
import { HttpResponseHeader, HttpStatus } from "http-enums";

import { LogicalError } from "../errors";
import { sentryTags } from "../middlewares/sentry_tags";
import { HonoCtx } from "../schemas/hono_ctx";
import adminRoute from "./admin";
import subjectRoute from "./subject";

const app = new Hono<HonoCtx>();

app.use("/*", sentryTags);

app.route("/admin", adminRoute);
app.route("/", subjectRoute);

app.get("*", async (c) => {
	c.header(HttpResponseHeader.CACHE_CONTROL, "public, max-age=864000, immutable");
	throw new LogicalError(HttpStatus.NOT_FOUND, { hrm: "r:*", path: c.req.path });
});

export default app;
