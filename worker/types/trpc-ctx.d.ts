import type { IsAny } from "hono/utils/types";
import type { HonoCtx } from "./hono-ctx";
import type { Context } from "hono";
import type { HonoCtxWithAuth } from "./cfzt-auth";

export declare type TrpcCtx = Pick<Context<HonoCtx>, "get" | "env" | "var">;

export declare type TrpcCtxWithAuth<R extends Record = {}> = Pick<Context<HonoCtxWithAuth<R>>, "get" | "env" | "var">;
