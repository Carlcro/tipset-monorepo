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
  getUserTournaments: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.userTournament.findMany({
      where: {
        members: {
          some: {
            userId: ctx.auth.userId,
          },
        },
      },
    });
  }),
  getUserTournament: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const userTournament =
          await ctx.prisma.userTournament.findUniqueOrThrow({
            where: {
              id: input,
            },
            include: {
              members: true,
            },
          });

        const isMember = userTournament.members.some(
          (member) => member.userId === ctx.auth.userId,
        );

        if (isMember) {
          return userTournament;
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
});
