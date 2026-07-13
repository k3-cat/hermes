import { router, publicProcedure } from '$/trpc';
import { z } from 'zod/mini';

export const menuRouter = router({
	byName: publicProcedure
		.input(z.string().check(z.trim(), z.toLowerCase(), z.minLength(2))) // name
		.query(async ({ input, ctx }) => {
			return await ctx.var.prisma.menu.findUniqueOrThrow({
				where: { name: input },
			});
		}),

	itemList: publicProcedure
		.input(z.string().check(z.uuid()))
		.query(async ({ input, ctx }) => {
			return await ctx.var.prisma.menu.findUniqueOrThrow({
				where: { id: input }
			}).items()
		})
});
