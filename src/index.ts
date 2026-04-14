import { HttpStatus } from "http-enums";

import { LogicalError } from "./errors";
import app from "./routers";

export default app;

app.onError((err, c) => {
	const ray = c.req.header("Cf-Ray");

	if (err instanceof LogicalError) {
		const payload = err.payload;
		payload.ray = ray;
		if (!payload.msg) {
			payload.msg = HttpStatus[err.resInit.status];
		}

		return c.json(payload, err.resInit);
	}

	// faro.api.pushError(err);
	return c.json(
		{
			ray: ray,
			hrm: "e:*",
			msg: "unhandled error",
			err: err.message,
		},
		HttpStatus.INTERNAL_SERVER_ERROR,
	);
});
