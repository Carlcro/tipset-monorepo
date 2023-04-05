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
  setConfig: protectedProcedure
    .input(
      z.object({
        bettingAllowed: z.boolean(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (process.env.ADMIN_PASSWORD === input.password) {
        const config = await ctx.prisma.config.findFirst();

        if (config) {
          await ctx.prisma.config.update({
            where: {
              id: config.id,
            },
            data: {
              bettingAllowed: input.bettingAllowed,
            },
          });
        } else {
          await ctx.prisma.config.create({
            data: {
              bettingAllowed: input.bettingAllowed,
            },
          });
        }

        return true;
      } else {
        throw new TRPCError({
          code: "FORBIDDEN",
        });
      }
    }),
  getConfig: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.config.findFirstOrThrow();
  }),
});
