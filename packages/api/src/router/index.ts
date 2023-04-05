import { betslipRouter } from "./betslip";
import { championshipRouter } from "./championship";
import { router } from "../trpc";
import { userTournamentRouter } from "./userTournaments";
import { authRouter } from "./auth";
import { teamRouter } from "./team";
import { answerSheetRouter } from "./answerSheet";
import { userRouter } from "./user";
import { playerRouter } from "./player";

export const appRouter = router({
  auth: authRouter,
  team: teamRouter,
  userTournament: userTournamentRouter,
  championship: championshipRouter,
  betslip: betslipRouter,
  answerSheet: answerSheetRouter,
  user: userRouter,
  player: playerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
