import { router } from ".." // must avoid path aliases
import { menuRouter } from "./menus"

export const trpcRouter = router({
	menu: menuRouter,
});

export declare type TrpcRouter = typeof trpcRouter;
