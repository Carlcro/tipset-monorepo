import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const teamRouter = router({
  savePlayer: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.player.create({
        data: { name: input.name },
      });
    }),
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.player.findMany();
  }),
});
