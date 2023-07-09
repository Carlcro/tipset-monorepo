import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { betSlipState, goalscorerState } from "../../recoil/bet-slip/atoms";
import { setFromBetslipState } from "../../recoil/bet-slip/selectors/selectors";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import { trpc } from "../../utils/trpc";
import { championshipState } from "../../recoil/championship/atoms";

const DynamicBetslip = dynamic(
  () => import("../../components/bet-slip/BetSlip"),
  {
    ssr: false,
  },
);

const AnswerSheet = () => {
  const setFromBetslip = useSetRecoilState(setFromBetslipState);
  const [password, setPassword] = useState("");
  const [goals, setGoals] = useState(0);
  const [betslip, setBetslip] = useRecoilState(betSlipState);
  const [goalScorer, setGoalscorer] = useRecoilState(goalscorerState);

  const setChampionship = useSetRecoilState(championshipState);

  const [finalsMatches, setFinalsMatches] = useState<any[]>([]);

  const [calculateAllPoints, setCalculateAllPoints] = useState(false);

  const handleChange = () => {
    setCalculateAllPoints(!calculateAllPoints);
  };

  const { data: betSlipData } = trpc.answerSheet.getAnswerSheet.useQuery();

  const { data: championshipData } =
    trpc.championship.getOneChampionship.useQuery();

  useEffect(() => {
    if (championshipData) {
      setChampionship(championshipData);
    }
  }, [championshipData, setChampionship]);

  useEffect(() => {
    if (betSlipData) {
      setFromBetslip({
        goalscorer: betSlipData.goalscorer
          ? betSlipData.goalscorer?.player
          : undefined,
        bets: [...betSlipData.results],
      });
      if (betSlipData.goalscorer) {
        setGoals(betSlipData.goalscorer.goals);
      }
    }
  }, [setFromBetslip, betSlipData]);

  const { mutate: saveAnswerSheet } =
    trpc.answerSheet.saveAnswerSheet.useMutation({
      onSuccess: () => {
        toast.success("Sparat!");
        updateBetSlips();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const { mutate: updatePoints } = trpc.answerSheet.updatePoints.useMutation({
    onSuccess: () => {
      toast.success("Poäng Uppdaterade!");
    },
  });

  const updateBetSlips = async () => {
    updatePoints({
      calculateAllPoints,
    });
  };

  const submitAnswer = async () => {
    const finalsNotPlayed = finalsMatches.filter((x) => x.id > betslip.length);

    saveAnswerSheet({
      bets: [...betslip, ...finalsNotPlayed].map((bet) => ({
        ...bet,
        team1Id: bet.team1.id,
        team2Id: bet.team2.id,
      })),
      goalScorer: goalScorer ? { id: goalScorer.id, goals } : undefined,
    });
  };

  return (
    <>
      <div className="mb-4 flex justify-center">
        <h1 className="text-3xl font-bold">Answer Sheet</h1>
      </div>
      <DynamicBetslip
        headerText="Admin"
        setFinalsMatches={setFinalsMatches}
        handleSave={submitAnswer}
        mode={"answerSheet"}
      ></DynamicBetslip>
      <div className="flex space-x-4 pb-10 pl-20 ">
        <input
          className="rounded-sm px-2 py-2"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="text"
        ></input>
        <input
          className="rounded-sm px-2 py-2 "
          type="number"
          placeholder="Number of goals"
          value={goals}
          onChange={(e) => setGoals(Number(e.target.value))}
        ></input>
        <label>
          <input type="checkbox" onChange={handleChange} />
          Räkna ut ALLA poäng
        </label>
      </div>
    </>
  );
};
export default AnswerSheet;
