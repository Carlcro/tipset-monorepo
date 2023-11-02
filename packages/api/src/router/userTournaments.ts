import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";

export const userTournamentRouter = router({
  createUserTournament: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const newTournament = await ctx.prisma.userTournament.create({
          data: {
            name: input.name,
            ownerId: ctx.auth.userId,
            members: {
              connect: {
                userId: ctx.auth.userId,
              },
            },
          },
          include: {
            members: true,
          },
        });

        return newTournament;
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Could not user.",
          cause: error,
        });
      }
    }),
  getUserTournaments: protectedProcedure.query(async ({ ctx }) => {
    const config = await ctx.prisma.config.findFirstOrThrow();

    return ctx.prisma.userTournament.findMany({
      where: {
        NOT: [
          {
            id: config.mainTournament,
          },
        ],
        members: {
          some: {
            userId: ctx.auth.userId,
          },
        },
      },
    });
  }),
  getUserTournament: protectedProcedure
    .input(z.object({ userTournamentId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const userTournament =
          await ctx.prisma.userTournament.findUniqueOrThrow({
            where: {
              id: input.userTournamentId,
            },
            include: {
              members: true,
            },
          });

        const isMember = userTournament.members.some(
          (member) => member.userId === ctx.auth.userId,
        );
        const isOwner = userTournament.ownerId === ctx.auth.userId;

        if (isMember) {
          return { userTournament, isOwner };
        } else {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You are not authorized",
          });
        }
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Could not find.",
          cause: error,
        });
      }
    }),

  leaveUserTournament: protectedProcedure
    .input(
      z.object({
        userTournamentId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userTournament = await ctx.prisma.userTournament.findUniqueOrThrow({
        where: {
          id: input.userTournamentId,
        },
      });

      if (userTournament.ownerId === ctx.auth.userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You cannot leave when you are the owner",
        });
      }
      await ctx.prisma.userTournament.update({
        where: {
          id: input.userTournamentId,
        },
        data: {
          members: {
            disconnect: { userId: ctx.auth.userId },
          },
        },
      });

      return true;
    }),
  deleteUserTournament: protectedProcedure
    .input(
      z.object({
        userTournamentId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userTournament = await ctx.prisma.userTournament.findUniqueOrThrow({
        where: {
          id: input.userTournamentId,
        },
      });

      if (userTournament.ownerId !== ctx.auth.userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You cannot delete if you are not the owner",
        });
      }

      await ctx.prisma.userTournament.delete({
        where: {
          id: input.userTournamentId,
        },
      });
      return true;
    }),
  addMember: protectedProcedure
    .input(
      z.object({
        userTournamentId: z.string(),
        email: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.userTournament.update({
        where: {
          id: input.userTournamentId,
        },
        data: {
          members: {
            connect: {
              email: input.email,
            },
          },
        },
        include: {
          members: true,
        },
      });
    }),
  kickMember: protectedProcedure
    .input(
      z.object({
        userTournamentId: z.string(),
        userIdToKick: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userTournament = await ctx.prisma.userTournament.findFirstOrThrow({
        where: {
          id: input.userTournamentId,
        },
        select: {
          ownerId: true,
        },
      });

      if (userTournament.ownerId !== ctx.auth.userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized",
        });
      }

      if (input.userIdToKick === ctx.auth.userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You cannot kick yourself",
        });
      }

      const updatedUserTournament = await ctx.prisma.userTournament.update({
        where: {
          id: input.userTournamentId,
        },
        data: {
          members: {
            disconnect: {
              userId: input.userIdToKick,
            },
          },
        },
      });

      return updatedUserTournament;
    }),
  getHighscore: protectedProcedure
    .input(
      z.object({
        userTournamentId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userTournament = await ctx.prisma.userTournament.findUniqueOrThrow({
        where: {
          id: input.userTournamentId,
        },
        include: {
          members: true,
        },
      });

      const betSlips = await ctx.prisma.betSlip.findMany({
        where: {
          userId: { in: userTournament.members.map((user) => user.userId) },
        },
        include: {
          user: true,
        },
      });

      return {
        isOwner: userTournament.ownerId === ctx.auth.userId,
        name: userTournament.name,
        highScoreData: betSlips.map((betSlip) => ({
          id: betSlip.id,
          points: betSlip.points,
          fullName: betSlip.user.fullName,
          email: betSlip.user.email,
          difference: 0,
        })),
      };
    }),
});
