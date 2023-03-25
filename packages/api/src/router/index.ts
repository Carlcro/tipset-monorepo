import { router } from "../trpc";
import { userTournamentRouter } from "./userTournaments";
import { authRouter } from "./auth";
import { teamRouter } from "./team";

export const appRouter = router({
  auth: authRouter,
  team: teamRouter,
  userTournament: userTournamentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
