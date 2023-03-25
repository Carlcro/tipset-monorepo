import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const teamRouter = router({
  saveTeam: protectedProcedure
    .input(z.object({ name: z.string(), group: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.team.create({
        data: { name: input.name, group: input.group },
      });
    }),
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.team.findMany();
  }),
  getTeam: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.team.findUnique({
      where: {
        id: input,
      },
    });
  }),
});
