import { router, protectedProcedure } from "../trpc";

export const userRouter = router({
  getUser: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUniqueOrThrow({
      where: {
        userId: ctx.auth.userId,
      },
      include: {
        betSlip: true,
      },
    });
  }),
});
