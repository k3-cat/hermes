import type { Trpc } from "#/types/trpc-tanstack";
import type { FeatureFlags, ResolverDef, TRPCQueryOptions } from "@trpc/tanstack-react-query";

export class QueryOptionsHolder<TDef extends ResolverDef, TFeatureFlags extends FeatureFlags> {
	val!: ReturnType<typeof this.initPriv>;
	private initHandler

	constructor(mkQueryOptions: (trpc: Trpc) => TRPCQueryOptions<TDef, TFeatureFlags>, opts?: Parameters<ReturnType<typeof mkQueryOptions>>[1]) {
		this.initHandler = <TQueryFnData extends TDef['output'], TData = TQueryFnData>(
			trpc: Trpc, input: TDef["input"]
			// @ts-expect-error
		) => mkQueryOptions(trpc)<TQueryFnData, TData>(input, opts);
	}

	private initPriv(...args: Parameters<typeof this.initHandler>) {
		return this.initHandler<TDef["output"]>(...args);
	}

	init(...args: Parameters<typeof this.initHandler>) {
		this.val = this.initPriv(...args);
	}
}
