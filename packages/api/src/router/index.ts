import { betslipRouter } from "./betslip";
import { championshipRouter } from "./championship";
import { router } from "../trpc";
import { userTournamentRouter } from "./userTournaments";
import { authRouter } from "./auth";
import { teamRouter } from "./team";
import { answerSheetRouter } from "./answerSheet";

export const appRouter = router({
  auth: authRouter,
  team: teamRouter,
  userTournament: userTournamentRouter,
  championship: championshipRouter,
  betslip: betslipRouter,
  answerSheet: answerSheetRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
