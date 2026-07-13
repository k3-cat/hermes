import { router } from "$/trpc"
import { menuRouter } from "./menus"


export const trpcRouter = router({
	menu: menuRouter,
});

export type TrpcRouter = typeof trpcRouter
