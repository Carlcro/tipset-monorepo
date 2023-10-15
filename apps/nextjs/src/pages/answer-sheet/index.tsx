import { ChangeEvent,  useEffect, useState } from "react";
import {  useRecoilValue, useSetRecoilState } from "recoil";
import { betSlipState, goalscorerState } from "../../recoil/bet-slip/atoms";
import { setFromBetslipState } from "../../recoil/bet-slip/selectors/selectors";
import { toast } from "react-toastify";
import { trpc } from "../../utils/trpc";
import { championshipState } from "../../recoil/championship/atoms";
import BetSlip from "../../components/bet-slip/BetSlip";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nConfig from "../../../next-i18next.config.mjs";

const AnswerSheet = () => {
  const utils = trpc.useContext();

  const setFromBetslip = useSetRecoilState(setFromBetslipState);
  const [password, setPassword] = useState("");
  const [goals, setGoals] = useState(0);
  const betslip = useRecoilValue(betSlipState);
  const goalScorer = useRecoilValue(goalscorerState);

  const setChampionship = useSetRecoilState(championshipState);

  const [finalsMatches, setFinalsMatches] = useState<any[]>([]);

  const [calculateAllPoints, setCalculateAllPoints] = useState(false);

  const handleChange = () => {
    setCalculateAllPoints(!calculateAllPoints);
  };

  const { data: betSlipData } = trpc.answerSheet.getAnswerSheet.useQuery();

  const { mutate: createConfig } = trpc.config.createConfig.useMutation();
  const { mutate: setBettingAllowed } = trpc.config.bettingAllowed.useMutation({
    onSuccess: () => {
      utils.invalidate();
    },
  });

  const { data: config, isError } = trpc.config.getConfig.useQuery();

  useEffect(() => {
    if (isError) {
      toast("Config not found, creating one");
      createConfig();
    }
  }, [createConfig, isError]);

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
        bets: [...betSlipData.bets],
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
      <div>
        <h1>Config</h1>
        <div>
          <label>Allow Betting</label>
          <input
            type="checkbox"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setBettingAllowed(e.target.checked)
            }
            checked={config ? config.bettingAllowed : false}
          />
        </div>
      </div>
      <BetSlip
        headerText="Admin"
        setFinalsMatches={setFinalsMatches}
        handleSave={submitAnswer}
        mode={"answerSheet"}
      />
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
export default AnswerSheet;
