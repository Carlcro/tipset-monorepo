import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const configRouter = router({
  createConfig: protectedProcedure.mutation(({ ctx }) => {
    return ctx.prisma.config.create({
      data: {
        bettingAllowed: true,
      },
    });
  }),
  getConfig: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.config.findFirstOrThrow();
  }),
  bettingAllowed: protectedProcedure
    .input(z.boolean())
    .mutation(async ({ ctx, input }) => {
      const config = await ctx.prisma.config.findFirstOrThrow();
      return ctx.prisma.config.update({
        where: {
          id: config.id,
        },
        data: {
          bettingAllowed: input,
        },
      });
    }),
});
