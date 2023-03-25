import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const betslipRouter = router({
  createBetSlip: protectedProcedure
    .input(
      z.object({
        bets: z.array(
          z.object({
            matchId: z.number(),
            team1Score: z.number(),
            team2Score: z.number(),
            team1Id: z.string(),
            team2Id: z.string(),
            penaltyWinnerId: z.optional(z.string()),
          }),
        ),
        goalScorerId: z.optional(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const championship = await ctx.prisma.championship.findFirstOrThrow();
        const betslip = await ctx.prisma.betSlip.findUnique({
          where: {
            userId: ctx.auth.userId,
          },
        });

        if (betslip) {
          await ctx.prisma.bet.deleteMany({
            where: {
              betSlipId: betslip.id,
            },
          });

          await ctx.prisma.betSlip.delete({
            where: {
              userId: ctx.auth.userId,
            },
          });
        }

        const newBetslip = await ctx.prisma.betSlip.create({
          data: {
            userId: ctx.auth.userId,
            championshipId: championship.id,
            goalscorerId: input?.goalScorerId,
            points: 0,
          },
        });

        await ctx.prisma.bet.createMany({
          data: input.bets.map((bet) => ({
            matchId: bet.matchId,
            team1Id: bet.team1Id,
            team2Id: bet.team2Id,
            team1Score: bet.team1Score,
            team2Score: bet.team2Score,
            penaltyWinnerId: bet.penaltyWinnerId,
            betSlipId: newBetslip.id,
          })),
        });

        return ctx.prisma.betSlip.findUnique({
          where: {
            userId: ctx.auth.userId,
          },
          include: {
            bets: {
              include: {
                penaltyWinner: true,
                team1: true,
                team2: true,
              },
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  getBetSlip: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.betSlip.findUnique({
      where: {
        userId: ctx.auth.userId,
      },
      include: {
        bets: {
          include: {
            penaltyWinner: true,
            team1: true,
            team2: true,
          },
        },
      },
    });
  }),
  getPlacedBet: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.betSlip.findUnique({
        where: {
          userId: input.userId,
        },
        include: {
          goalscorer: true,
          bets: {
            include: {
              penaltyWinner: true,
              team1: true,
              team2: true,
            },
          },
        },
      });
    }),
});
