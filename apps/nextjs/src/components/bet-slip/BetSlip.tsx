import React, { useMemo, useState } from "react";
import { trpc } from "../../utils/trpc";
import MatchGroup from "./MatchGroup";
import GroupBoard from "./GroupBoard";
import GoalscorerInput from "./GoalscorerInput";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import TiebreakerInfo from "./TiebreakerInfo";
import { goalscorerState } from "../../recoil/bet-slip/atoms";
import {
  resetAllBets,
  setAllMatchesState,
} from "../../recoil/bet-slip/selectors/selectors";
import {
  getGroupOf16,
  getGroupOf8,
  getSemifinals,
  getFinal,
} from "../../recoil/bet-slip/selectors/matches";
import { championshipState } from "../../recoil/championship/atoms";
import Container from "../Container";
import SubmitButton from "../SubmitButton";
import Spinner from "../Spinner";
import { Player, PointsFromAdvancement } from "@acme/db";
import { Mode } from "../../types";
import { useTranslation } from "next-i18next";

type Props = {
  mode: Mode;
  handleSave?: () => void;
  setFinalsMatches?: (matches: any[]) => void;
  headerText: string;
  placingBetLoading?: boolean;
  advancementFromGroup?: PointsFromAdvancement[];
};

const BetSlip = ({
  mode,
  handleSave,
  setFinalsMatches,
  headerText,
  placingBetLoading,
}: Props) => {
  const championship = useRecoilValue(championshipState);
  const bestOfThirds = useRecoilValue(getGroupOf16);

  const groupOf16 = useRecoilValue(getGroupOf16);
  const groupOf8 = useRecoilValue(getGroupOf8);
  const semiFinals = useRecoilValue(getSemifinals);
  const final = useRecoilValue(getFinal);
  const [goalscorer, setGoalscorer] = useRecoilState(goalscorerState);
  const { t } = useTranslation("bet-slip");
  const [showStatistics, setShowStatistics] = useState(false);

  const { data: config, isLoading: configLoading } =
    trpc.config.getConfig.useQuery();
  const { data: user, isLoading: loadingUser } = trpc.user.getUser.useQuery();

  /*  const { data: matchStats, isLoading: matchStatisticsLoading } = useQuery(
    ["matchStatistics"],
    getMatchStatistics,
    { enabled: config && !config.bettingAllowed },
  ); */

  useMemo(() => {
    if (setFinalsMatches) {
      setFinalsMatches([
        ...groupOf16.matches,
        ...groupOf8.matches,
        ...semiFinals.matches,
        ...final.matches,
      ]);
    }
  }, [
    final.matches,
    groupOf16.matches,
    groupOf8.matches,
    semiFinals.matches,
    setFinalsMatches,
  ]);

  const setAllMatches = useSetRecoilState(setAllMatchesState);
  const resetAllMatches = useSetRecoilState(resetAllBets);

  const handleSetAllMatches = () => {
    const matches = championship?.matchGroups.flatMap((group) => group.matches);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setAllMatches(matches);
  };

  const reset = () => {
    resetAllMatches();
  };

  const handleSetGoalscorer = (goalscorer: Player) => {
    setGoalscorer(goalscorer);
  };
  if (configLoading || loadingUser) {
    return null;
  }

  if (championship) {
    return (
      <div>
        <div className=" flex flex-col-reverse items-center space-y-3 px-8 sm:space-y-0 md:flex-row">
          <div className="flex-1">
            <Container classNames="mx-auto w-[300px] md:w-[500px] flex flex-col space-y-3 items-center ">
              <h1 className="text-center text-xl">{headerText} </h1>
              {user?.isAdmin && (
                <button onClick={() => handleSetAllMatches()}>
                  Set all matches
                </button>
              )}
            </Container>
          </div>
        </div>

        <div className="mx-1 mt-2 grid grid-cols-1 gap-2 md:grid-cols-[2fr_1fr] lg:flex lg:justify-center">
          <div className="flex flex-col gap-2 lg:justify-end">
            {championship?.matchGroups?.map((group) => (
              <MatchGroup
                group={group}
                key={group.name}
                matchInfos={championship.matchInfos}
                mode={mode}
              />
            ))}
            <MatchGroup
              group={groupOf16}
              matchInfos={championship.matchInfos}
              mode={mode}
            />
            <MatchGroup
              group={groupOf8}
              matchInfos={championship.matchInfos}
              mode={mode}
            />
            <MatchGroup
              group={semiFinals}
              matchInfos={championship.matchInfos}
              mode={mode}
            />

            <MatchGroup
              group={final}
              matchInfos={championship.matchInfos}
              mode={mode}
            />
            <GoalscorerInput
              mode={mode}
              goalscorer={goalscorer}
              handleSetGoalscorer={handleSetGoalscorer}
            />
            {(mode === "betslip" || mode === "answerSheet") && (
              <div className="mb-10 flex">
                {config?.bettingAllowed || mode === "answerSheet" ? (
                  <SubmitButton
                    isLoading={placingBetLoading}
                    type="button"
                    onClick={handleSave}
                  >
                    {t("save-bet")}
                  </SubmitButton>
                ) : (
                  <div className="my-3 ml-3 rounded-lg py-1 px-2  font-bold text-red-500">
                    {t("not-allowed-to-place-bet")}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex max-w-[500px] flex-col gap-2 lg:max-w-[450px] lg:justify-start">
            <GroupBoard mode={mode} />
            {mode === "betslip" && <TiebreakerInfo />}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
};

export default BetSlip;
