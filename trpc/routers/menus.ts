import { router, publicProcedure } from '..'; // must avoid path aliases
import { z } from 'zod/mini';

const zMenuName = z.string().check(z.trim(), z.toLowerCase(), z.minLength(2));

export const menuRouter = router({
	byName: publicProcedure
		.input(zMenuName)
		.query(async ({ input, ctx }) => {
			return await ctx.var.prisma.menu.findUniqueOrThrow({
				where: { name: input },
			});
		}),

	itemList: publicProcedure
		.input(zMenuName)
		.query(async ({ input, ctx }) => {
			return await ctx.var.prisma.menu.findUniqueOrThrow({
				where: { name: input }
			}).items()
		})
});
