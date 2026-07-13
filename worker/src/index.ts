import { HttpStatus } from "http-enums";

import { LogicalError } from "./errors";
import app from "./routers";
import { z } from "zod/mini";

export default app;

app.onError((err, c) => {
	const ray = c.req.header("Cf-Ray");

	if (err instanceof z.core.$ZodError) {
		console.error("zod validation failed", { err });
		err = new LogicalError(HttpStatus.INTERNAL_SERVER_ERROR, {
			hrm: "e:*",
			msg: "invalid record",
			err: z.flattenError(err),
		});
	}

	if (err instanceof LogicalError) {
		const payload = err.payload;
		payload.ray = ray;
		if (!payload.msg) {
			payload.msg = HttpStatus[err.resInit.status];
		}

		return c.json(payload, err.resInit);
	}

	console.error(err);
	return c.json(
		{
			hrm: "e:*",
			ray,
			msg: "unhandled error",
			err: err.message,
		},
		HttpStatus.INTERNAL_SERVER_ERROR,
	);
});
