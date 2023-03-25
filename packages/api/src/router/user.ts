import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const teamRouter = router({
  createUser: protectedProcedure
    .input(z.object({ name: z.string(), group: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.team.create({
        data: { name: input.name },
      });
    }),
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.team.findMany();
  }),
});
