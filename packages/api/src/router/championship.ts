import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const championshipRouter = router({
  createChampionship: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.championship.create({
        data: {
          name: input.name,
        },
      });
    }),

  getOneChampionship: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.championship.findFirst({
      include: {
        matchGroups: {
          include: {
            matches: {
              include: {
                team1: true,
                team2: true,
              },
            },
          },
        },
      },
    });
  }),
});
