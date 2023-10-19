import React, { useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { useRecoilState, useSetRecoilState } from "recoil";
import { setFromBetslipState } from "../../recoil/bet-slip/selectors/selectors";
import {
  MatchBet,
  betSlipState,
  goalscorerState,
} from "../../recoil/bet-slip/atoms";
import { trpc } from "../../utils/trpc";
import { championshipState } from "../../recoil/championship/atoms";
import BetSlip from "../../components/bet-slip/BetSlip";
import Spinner from "../../components/Spinner";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nConfig from "../../../next-i18next.config.mjs";
import { useTranslation } from "next-i18next";

const BetSlipContainer = () => {
  const setFromBetslip = useSetRecoilState(setFromBetslipState);
  const setChampionship = useSetRecoilState(championshipState);
  const [goalscorer] = useRecoilState(goalscorerState);
  const [betslip] = useRecoilState(betSlipState);
  const { t } = useTranslation("bet-slip");

  const errorToast = useCallback((message: string) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }, []);

  const { isLoading, data: betSlipData } = trpc.betslip.getBetSlip.useQuery();
  const { data: championshipData } =
    trpc.championship.getOneChampionship.useQuery();

  useEffect(() => {
    if (betSlipData) {
      setFromBetslip(betSlipData);
    }
    if (championshipData) {
      setChampionship(championshipData);
    }
  }, [setFromBetslip, betSlipData, championshipData, setChampionship]);

  const { mutate } = trpc.betslip.createBetSlip.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const isMatchIncomplete = (bet: MatchBet | undefined, matchId: number) => {
    return (
      bet?.matchId === matchId &&
      bet?.team1Score === bet?.team2Score &&
      !bet?.penaltyWinner
    );
  };

  const isValidBet = useCallback(() => {
    const allMatchesFilled = betslip.every(
      (bet) => bet.team1Score !== null && bet.team2Score !== null,
    );

    if (!allMatchesFilled || betslip.length !== 64) {
      errorToast("Alla matcher måste vara ifyllda");
      return false;
    }

    const playoffMatches = [49, 50, 51, 52, 53, 54, 55, 56];
    const missingPenaltyWinner = betslip.some(
      (bet) =>
        playoffMatches.includes(bet.matchId) &&
        bet.team1Score === bet.team2Score &&
        !bet.penaltyWinner,
    );

    if (missingPenaltyWinner) {
      errorToast(
        "En match i slutspelet som slutar oavgjort saknar straffvinnare",
      );
      return false;
    }

    if (
      isMatchIncomplete(betslip[62], 62) ||
      isMatchIncomplete(betslip[63], 63)
    ) {
      errorToast("Alla matcher måste vara ifyllda");
      return false;
    }

    if (!goalscorer) {
      errorToast("Skyttekung saknas");
      return false;
    }

    return true;
  }, [betslip, goalscorer, errorToast]);

  const submitBet = useCallback(() => {
    if (isValidBet()) {
      mutate({
        bets: betslip.map((matchResult) => ({
          matchId: matchResult.matchId,
          team1Score: Number(matchResult.team1Score),
          team2Score: Number(matchResult.team2Score),
          team1Id: matchResult.team1.id,
          team2Id: matchResult.team2.id,
          penaltyWinnerId: matchResult.penaltyWinner?.id,
        })),
        goalScorerId: goalscorer?.id,
      });

      toast.success("Spel sparat!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }, [isValidBet, mutate, betslip, goalscorer]);

  if (isLoading) {
    return (
      <div className="mt-32 flex w-full items-center justify-center">
        <Spinner width={50} height={50} />
      </div>
    );
  }

  return (
    <BetSlip
      headerText={t("bet-slip-header")}
      handleSave={submitBet}
      mode={"betslip"}
    />
  );
};
export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(
      locale,
      ["countries", "bet-slip", "common"],
      nextI18nConfig,
      ["en", "sv"],
    )),
  },
});
export default BetSlipContainer;
