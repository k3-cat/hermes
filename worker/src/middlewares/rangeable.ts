import type { Context } from "hono";
import { createMiddleware } from "hono/factory";

import { HttpRequestHeader, HttpResponseHeader, HttpStatus } from "http-enums";

import { LogicalError } from "$/errors";
import type { HonoCtx } from "../../types/hono-ctx";

import { newSlicedStream } from "../utils/sliced-stream";

const RANGE_PATTERN = /^bytes=([0-9]+)?-([0-9]+)?$/im;

function fixHeaders(
	c: Context<HonoCtx, string>,
	start: number,
	end: number,
	newLength: number,
	length: number,
) {
	c.res.headers.delete(HttpResponseHeader.TRANSFER_ENCODING);
	c.header(HttpResponseHeader.CONTENT_LENGTH, newLength.toString());
	c.header(HttpResponseHeader.CONTENT_RANGE, `bytes ${start}-${end}/${length}`);
}

export const rangeable = createMiddleware<HonoCtx>(async (c, next) => {
	const range = c.req.header(HttpRequestHeader.RANGE);

	await next();

	const resContentSize = c.res.headers.get(HttpResponseHeader.CONTENT_LENGTH);
	if (
		!range ||
		!resContentSize ||
		c.res.status !== HttpStatus.OK ||
		c.res.headers.get(HttpResponseHeader.ACCEPT_RANGES) !== "bytes"
	) {
		return;
	}

	const match = RANGE_PATTERN.exec(range);
	if (!match) {
		throw new LogicalError(HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE, {
			hrm: "M:r-1",
			msg: `range '${range}' is not satisfiable`,
		});
	}

	const [_, startAt, endAt] = match;
	const size = parseInt(resContentSize, 10);
	const start = startAt
		? parseInt(startAt, 10)
		: size - parseInt(endAt ?? "1", 10);
	const end =
		startAt && endAt ? Math.min(size - 1, parseInt(endAt, 10)) : size - 1;
	if (start >= end) {
		throw new LogicalError(HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE, {
			hrm: "M:r-2",
			msg: `range '${range}' is not satisfiable (content length: ${size})`,
		});
	}

	const length = end - start + 1;
	if (length === size) {
		console.debug(`M:r - full length reached (${size}), fix headers only`);
		fixHeaders(c, start, end, size, size);
		return;
	}

	console.debug(`M:r - slice response (${start}-${end}/${size})`);
	const slicedStream = newSlicedStream(start, end);
	const fixedlengthStream = new FixedLengthStream(length);
	const res = c.res.clone();
	c.res = undefined;
	c.res = new Response(
		res.body!.pipeThrough(slicedStream).pipeThrough(fixedlengthStream),
		{
			status: HttpStatus.PARTIAL_CONTENT,
			headers: res.headers,
		},
	);
	fixHeaders(c, start, end, length, size);
});
