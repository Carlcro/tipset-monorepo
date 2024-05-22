import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { getMatchExplanationText } from "calculations/src/points/World/pointCalculation";
import { TRPCError } from "@trpc/server";

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
      const championship = await ctx.prisma.championship.findFirstOrThrow();
      const config = await ctx.prisma.config.findFirstOrThrow();

      if (!config.bettingAllowed) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You cannot update your betslip after tournament has begun",
        });
      }
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
      const newBetSlip = {
        userId: ctx.auth.userId,
        championshipId: championship.id,
        goalscorerId: input?.goalScorerId || undefined,
        pointsFromGoalscorer: 0,
        points: 0,
      };

      const createdBetslip = await ctx.prisma.betSlip.create({
        data: newBetSlip,
      });

      await ctx.prisma.bet.createMany({
        data: input.bets.map((bet) => ({
          matchId: bet.matchId,
          team1Id: bet.team1Id,
          team2Id: bet.team2Id,
          team1Score: bet.team1Score,
          team2Score: bet.team2Score,
          penaltyWinnerId: bet?.penaltyWinnerId,
          betSlipId: createdBetslip.id,
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
        goalscorer: true,
      },
    });
  }),
  getPointsExplanation: protectedProcedure
    .input(
      z.object({
        betslipId: z.string(),
        matchId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const outcome = await ctx.prisma.result.findFirst({
        where: {
          matchId: input.matchId,
        },
        include: {
          team1: true,
          team2: true,
        },
      });

      const bet = await ctx.prisma.bet.findFirst({
        where: {
          betSlipId: input.betslipId,
          matchId: input.matchId,
        },
        include: {
          team1: true,
          team2: true,
        },
      });

      // TODO fix type
      if (outcome && bet) {
        const explanation = getMatchExplanationText(outcome, bet);

        return explanation;
      } else {
        return new TRPCError({
          code: "NOT_FOUND",
          message: "Something failed",
        });
      }
    }),
  getPlacedBet: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.betSlip.findUnique({
        where: {
          id: input.id,
        },
        include: {
          user: true,
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
  getNumberOfBetSlips: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.betSlip.count();
  }),
});
