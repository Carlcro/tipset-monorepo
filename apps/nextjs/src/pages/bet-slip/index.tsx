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

  const { mutate, isLoading: placingBetLoading } =
    trpc.betslip.createBetSlip.useMutation({
      onSuccess: () => {
        toast.success(t("bet-saved"), {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      },
      onError: () => {
        toast.error(t("error-saving"), {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
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

    if (!allMatchesFilled || betslip.length !== 51) {
      errorToast(t("all-games-must-be-filled-in"));
      return false;
    }

    const playoffMatches = [
      37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51,
    ];
    const missingPenaltyWinner = betslip.some(
      (bet) =>
        playoffMatches.includes(bet.matchId) &&
        bet.team1Score === bet.team2Score &&
        !bet.penaltyWinner,
    );

    if (missingPenaltyWinner) {
      errorToast(t("missing-penalty-winner"));
      return false;
    }

    if (isMatchIncomplete(betslip[51], 51)) {
      errorToast(t("all-games-must-be-filled-in"));
      return false;
    }

    if (!goalscorer) {
      errorToast(t("goal-scorer-missing"));
      return false;
    }

    return true;
  }, [betslip, goalscorer, errorToast, t]);

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
      placingBetLoading={placingBetLoading}
    />
  );
};
export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(
      locale,
      ["countries", "bet-slip", "common", "cities"],
      nextI18nConfig,
      ["en", "sv"],
    )),
  },
});
export default BetSlipContainer;
