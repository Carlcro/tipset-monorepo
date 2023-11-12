import {
  calculateGroupResults,
  calculatePointsFromGroup,
  getMatchPoint,
  calculateCorrectAdvanceTeam,
} from "calculations";
import { calculateGoalScorer } from "calculations/src/points/common";
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
        goalScorer: z.optional(
          z.object({
            id: z.string(),
            goals: z.number(),
          }),
        ),
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

          await ctx.prisma.goalScorer.deleteMany();
        }

        let newGoalScorer;
        if (input.goalScorer) {
          newGoalScorer = await ctx.prisma.goalScorer.create({
            data: {
              playerId: input.goalScorer.id,
              goals: input.goalScorer.goals,
            },
          });
        }

        const newAnswerSheet = await ctx.prisma.answerSheet.create({
          data: {
            championshipId: championship.id,
            goalscorerId: newGoalScorer ? newGoalScorer.id : undefined,
          },
        });

        if (newGoalScorer) {
          await ctx.prisma.goalScorer.update({
            where: {
              id: newGoalScorer.id,
            },
            data: {
              goals: input.goalScorer?.goals,
            },
          });
        }

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
            bets: {
              include: {
                penaltyWinner: true,
                team1: true,
                team2: true,
              },
            },
            goalscorer: {
              include: {
                player: true,
              },
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  lastUpdated: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.answerSheet.findFirstOrThrow({
      select: {
        timeUpdated: true,
      },
    });
  }),

  getAnswerSheet: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.answerSheet.findFirst({
      include: {
        bets: {
          include: {
            penaltyWinner: true,
            team1: true,
            team2: true,
          },
        },
        goalscorer: {
          include: {
            player: true,
          },
        },
      },
    });
  }),
  updatePoints: protectedProcedure
    .input(z.object({ calculateAllPoints: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const championship = await ctx.prisma.championship.findFirstOrThrow({
        include: {
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
      const answerSheet = await ctx.prisma.answerSheet.findFirstOrThrow({
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

      const matchNumber = answerSheet.bets.length;

      const allBetSlips = await ctx.prisma.betSlip.findMany({
        include: {
          goalscorer: true,
          pointsHistory: true,
          bets: {
            include: {
              penaltyWinner: true,
              team1: true,
              team2: true,
            },
          },
        },
      });

      const answerSheetGroupResult = calculateGroupResults(
        answerSheet.bets,
        championship.matchGroups,
      );

      allBetSlips.forEach(async (betSlip) => {
        const betSlipGroupResult = calculateGroupResults(
          betSlip.bets,
          championship.matchGroups,
        );

        let totalPointsFromMatches = 0;

        betSlip.bets.forEach(async (bet) => {
          const outcomeResult = answerSheet.bets.find(
            (x) => x.matchId === bet.matchId,
          );

          if (
            outcomeResult &&
            !isNaN(outcomeResult.team1Score) &&
            !isNaN(outcomeResult.team2Score)
          ) {
            if (!Number.isInteger(bet.points) || input.calculateAllPoints) {
              const matchPoint = getMatchPoint(outcomeResult, bet);
              totalPointsFromMatches += matchPoint;
              await ctx.prisma.bet.update({
                where: {
                  id: bet.id,
                },
                data: {
                  points: matchPoint,
                },
              });
            } else {
              totalPointsFromMatches += bet.points || 0;
            }
          } else {
            await ctx.prisma.bet.update({
              where: {
                id: bet.id,
              },
              data: {
                points: null,
              },
            });
          }
        });

        const pointsFromGroup = betSlipGroupResult.map((groupResult, i) => {
          const oneAnswerSheet = answerSheetGroupResult[i];
          if (oneAnswerSheet) {
            return {
              group: groupResult.name,
              points: calculatePointsFromGroup(
                groupResult,
                oneAnswerSheet,
                betSlip.bets,
                answerSheet.bets,
              ),
            };
          }
          return {
            group: "",
            points: 0,
          };
        });

        const pointsFromAdvancement = calculateCorrectAdvanceTeam(
          betSlip.bets,
          answerSheet.bets,
        );

        const goalScorerPoints = calculateGoalScorer(
          betSlip.goalscorerId,
          answerSheet.goalscorer,
        );

        const totalPointsFromGroup = pointsFromGroup.reduce(
          (acc, x) => acc + x?.points || 0,
          0,
        );

        const totalPointsFromAdvancement = pointsFromAdvancement.reduce(
          (acc, x) => acc + x.points,
          0,
        );

        const points =
          totalPointsFromMatches +
          totalPointsFromGroup +
          totalPointsFromAdvancement +
          goalScorerPoints;

        await ctx.prisma.betSlip.update({
          where: {
            id: betSlip.id,
          },
          data: {
            points: points,
            pointsFromGoalscorer: goalScorerPoints,
            pointsHistory: {
              upsert: {
                where: {
                  matchNumber: matchNumber,
                },
                create: {
                  points: points,
                  matchNumber: matchNumber,
                },
                update: {
                  points: points,
                },
              },
            },
          },
        });

        await ctx.prisma.pointsFromGroup.deleteMany({
          where: {
            betSlipId: betSlip.id,
          },
        });

        for await (const pg of pointsFromGroup) {
          await ctx.prisma.pointsFromGroup.create({
            data: {
              group: pg.group,
              points: pg.points,
            },
          });
        }

        await ctx.prisma.pointsFromAdvancement.deleteMany({
          where: {
            betSlipId: betSlip.id,
          },
        });

        await ctx.prisma.pointsFromAdvancement.deleteMany({
          where: {
            betSlipId: betSlip.id,
          },
        });

        for await (const pa of pointsFromAdvancement) {
          await ctx.prisma.pointsFromAdvancement.create({
            data: {
              final: pa.final,
              points: pa.points,
            },
          });
        }
      });

      return true;
    }),
});
