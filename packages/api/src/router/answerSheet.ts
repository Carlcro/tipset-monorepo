import { hej } from "calculations";
import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const answerSheetRouter = router({
  saveAnswerSheet: protectedProcedure
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
        const answerSheet = await ctx.prisma.answerSheet.findUnique({
          where: {
            championshipId: championship.id,
          },
        });

        if (answerSheet) {
          await ctx.prisma.result.deleteMany({
            where: {
              answerSheetId: answerSheet.id,
            },
          });

          await ctx.prisma.answerSheet.delete({
            where: {
              championshipId: championship.id,
            },
          });
        }

        const newAnswerSheet = await ctx.prisma.answerSheet.create({
          data: {
            championshipId: championship.id,
            goalscorerId: input?.goalScorerId,
          },
        });

        await ctx.prisma.result.createMany({
          data: input.bets.map((bet) => ({
            matchId: bet.matchId,
            team1Id: bet.team1Id,
            team2Id: bet.team2Id,
            team1Score: bet.team1Score,
            team2Score: bet.team2Score,
            penaltyWinnerId: bet.penaltyWinnerId,
            answerSheetId: newAnswerSheet.id,
          })),
        });

        return ctx.prisma.answerSheet.findUnique({
          where: {
            championshipId: championship.id,
          },
          include: {
            results: {
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

  getAnswerSheet: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.answerSheet.findFirst({
      include: {
        results: {
          include: {
            penaltyWinner: true,
            team1: true,
            team2: true,
          },
        },
      },
    });
  }),
  updatePoints: protectedProcedure.query(async ({ ctx }) => {
    hej();
    return true;
    /*  const championship = await ctx.prisma.championship.findFirstOrThrow({
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
    const answerSheet = await ctx.prisma.answerSheet.findFirstOrThrow({
      include: {
        results: {
          include: {
            penaltyWinner: true,
            team1: true,
            team2: true,
          },
        },
      },
    });

    const gameNumber = answerSheet.results.length;

    const allBetSlips = await ctx.prisma.betSlip.findMany();

    const answerSheetGroupResult = calculateGroupResults(
      answerSheet.results,
      championship.matchGroups,
    ); */
  }),
});
