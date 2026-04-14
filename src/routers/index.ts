import { Hono } from "hono";
import { HttpResponseHeader, HttpStatus } from "http-enums";

import { renderer } from "../components/renderer";
import { LogicalError } from "../errors";
import { HonoCtx } from "../schemas/hono-ctx";
import adminRoute from "./admin";
import subjectRoute from "./subject";

const app = new Hono<HonoCtx>();

app.use(renderer);

app.route("/admin", adminRoute);
app.route("/", subjectRoute);

app.get("*", async (c) => {
	c.header(HttpResponseHeader.CACHE_CONTROL, "public, max-age=864000, immutable");
	throw new LogicalError(HttpStatus.NOT_FOUND, { hrm: "r:*", path: c.req.path });
});

export default app;
