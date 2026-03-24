import * as Sentry from "@sentry/cloudflare";

import { H } from "../../definitions";
import { digestMessage } from "../../utils/digest-message";
import { R2GetRet } from "./r2-get-ret";
import { R2Metadata } from "./r2-metadata";

// -- retrive --
export async function r2_retrive(
	bucket: R2Bucket,
	key: string,
	options?: { headers?: Headers; conditions?: R2Conditional; range?: R2Range },
): Promise<R2GetRet | null> {
	const object = await bucket.get(key, {
		onlyIf: options?.conditions ?? options?.headers,
		range: options?.range ?? options?.headers,
		ssecKey: options?.headers?.get(H.SSEC_KEY) ?? undefined,
	});

	if (object === null) {
		return null;
	}
	return new R2GetRet(object);
}

// -- upload --
export async function r2_upload(
	bucket: R2Bucket,
	key: string,
	data: ReadableStream | string | null,
	options?: { headers?: Headers; conditions?: R2Conditional; httpMetadata?: R2HTTPMetadata; sha256?: ArrayBuffer },
): Promise<R2Metadata | null> {
	let sha256 = options?.sha256;
	let theData = data;
	if (!sha256) {
		if (data instanceof ReadableStream) {
			Sentry.logger.debug("S:r2 - calculate sha256 for stream");
			const dataCopies = data.tee();
			const digestStream = new crypto.DigestStream("SHA-256");
			dataCopies[1].pipeTo(digestStream);
			sha256 = await digestStream.digest;
			theData = dataCopies[0];
		}
		// string
		else if (typeof data === "string") {
			Sentry.logger.debug("S:r2 - calculate sha256 for string");
			sha256 = await digestMessage(data);
		}
	}

	const result = await bucket.put(key, theData, {
		onlyIf: options?.conditions ?? options?.headers,
		httpMetadata: options?.httpMetadata ?? options?.headers,
		ssecKey: options?.headers?.get(H.SSEC_KEY) ?? undefined,
		sha256,
	});

	if (result === null) {
		return null;
	}
	return new R2Metadata(result);
}
