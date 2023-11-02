import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { router, protectedProcedure, publicProcedure } from "../trpc";

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

  getOneChampionship: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.championship.findFirst({
      include: {
        matchInfos: true,
        matchGroups: {
          include: {
            teams: true,
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
  getConfig: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.config.findFirstOrThrow();
  }),
});
