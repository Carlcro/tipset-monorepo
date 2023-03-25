import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const matchGroupRouter = router({
  createMatchGroup: protectedProcedure
    .input(z.object({ name: z.string(), teams: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      try {
        const championship = await ctx.prisma.championship.findFirstOrThrow();
        ctx.prisma.matchGroup.create({
          data: {
            name: input.name,
            championshipId: championship.id,
            teams: {
              connect: input.teams.map((id) => ({ id })),
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  createMatch: protectedProcedure
    .input(
      z.object({
        matchId: z.number(),
        team1: z.string(),
        team2: z.string(),
        matchGroupId: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      ctx.prisma.match.create({
        data: {
          matchId: input.matchId,
          team1: {
            connect: { id: input.team1 },
          },
          team2: {
            connect: { id: input.team2 },
          },
          matchGroup: {
            connect: {
              id: input.matchGroupId,
            },
          },
        },
      });
    }),
});
