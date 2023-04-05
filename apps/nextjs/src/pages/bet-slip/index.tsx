import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { setFromBetslipState } from "../../recoil/bet-slip/selectors/selectors";
import { betSlipState, goalscorerState } from "../../recoil/bet-slip/atoms";
import dynamic from "next/dynamic";
import { trpc } from "../../utils/trpc";
import { championshipState } from "../../recoil/championship/atoms";

const DynamicBetslip = dynamic(
  () => import("../../components/bet-slip/BetSlip"),
  {
    ssr: false,
  },
);

const BetSlipContainer = () => {
  const setFromBetslip = useSetRecoilState(setFromBetslipState);
  const setChampionship = useSetRecoilState(championshipState);
  const [goalscorer, setGoalscorer] = useRecoilState(goalscorerState);
  const [betslip, setBetslip] = useRecoilState(betSlipState);

  const errorToast = (message: string) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  /*

    retry: false,
    refetchOnWindowFocus: false,
    onError: () => {
      setBetslip([]);
      setGoalscorer(null);
    },
  }

*/

  const { isLoading, data } = trpc.betslip.getBetSlip.useQuery();
  const { data: championshipData } =
    trpc.championship.getOneChampionship.useQuery();

  useEffect(() => {
    if (data) {
      setFromBetslip(data);
    }
  }, [setFromBetslip, data]);

  useEffect(() => {
    if (championshipData) {
      setChampionship(championshipData);
    }
  }, [championshipData, setChampionship]);

  const { mutate } = trpc.betslip.createBetSlip.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const isValidBet = () => {
    if (betslip.length !== 64) {
      errorToast("Alla matcher måste vara ifyllda");
      return false;
    }

    if (betslip.some((bet) => bet.team1Score === "" || bet.team2Score === "")) {
      errorToast("Alla matcher måste vara ifyllda");
      return false;
    }

    if (
      betslip.some((bet) => {
        if (
          bet.team1Score === bet.team2Score &&
          bet.matchId > 48 &&
          !bet.penaltyWinner
        )
          return true;
      })
    ) {
      errorToast(
        "En match i slutspelet som slutar oavgjort saknar straffvinnare",
      );
      return false;
    }

    if (
      betslip[62].team1Score === betslip[62].team2Score &&
      !betslip[62].penaltyWinner
    ) {
      errorToast("Alla matcher måste vara ifyllda");
      return false;
    }

    if (
      betslip[63].team1Score === betslip[63].team2Score &&
      !betslip[63].penaltyWinner
    ) {
      errorToast("Alla matcher måste vara ifyllda");
      return false;
    }

    if (!goalscorer) {
      errorToast("Skyttekung saknas");
      return false;
    }
    return true;
  };

  const submitBet = () => {
    if (isValidBet()) {
      mutate({
        bets: betslip.map((matchResult) => {
          return {
            matchId: matchResult.matchId,
            team1Score: Number(matchResult.team1Score),
            team2Score: Number(matchResult.team2Score),
            team1Id: matchResult.team1.id,
            team2Id: matchResult.team2.id,
            penaltyWinnerId: matchResult.penaltyWinner
              ? matchResult.penaltyWinner.id
              : undefined,
          };
        }),
        goalScorerId: goalscorer ? goalscorer.playerId : undefined,
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
  };

  if (isLoading) {
    return null;
  }

  return (
    <DynamicBetslip
      headerText={"Lägg ditt tips för Bröderna Duhlins VM-tips 2022"}
      handleSave={submitBet}
      mode={"betslip"}
    />
  );
};

export default BetSlipContainer;
