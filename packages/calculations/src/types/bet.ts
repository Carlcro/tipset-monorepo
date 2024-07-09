export type Bet = {
  id: string;
  matchId: number;
  team1Score: number;
  team2Score: number;
  team1Id: string;
  team2Id: string;
  penaltyWinnerId: string | null;
  points: number | null;
  betSlipId?: string | null;
};
