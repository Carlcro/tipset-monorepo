import { motion } from "framer-motion";
import React from "react";
import { useRecoilValue } from "recoil";
import { getPointsFromAdvancement } from "../../recoil/bet-slip/selectors/selectors";
import Container from "../Container";
import Match from "../Match";

const LabelMap = {
  Bronsmatch: "Poäng rätt bronsmedaljör",
  Final: "Poäng rätt världsmästare",
};

function MatchGroup({
  group,
  matchInfos,
  mode,
  matchStatistics,
  showStatistics,
}) {
  // För många "?"" i den här filen. Kan snyggas till

  const points = useRecoilValue(getPointsFromAdvancement(group.name));

  const matchIds = group?.matches?.map((m) => m.matchId);

  const matchInfosForGroup =
    matchIds &&
    matchInfos
      ?.filter((mi) => matchIds.includes(mi.matchId))
      .sort((a, b) => b.time - a.time);

  if (!group?.matches?.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      key={group.name}
    >
      <Container classNames="lg:w-ful my-2">
        <div className="flex justify-between">
          <h2 className="font-semibold text-xl pl-2 pb-1">{`${
            group.finalsStage ? "" : "Grupp"
          } ${group.name}`}</h2>
        </div>
        {matchInfosForGroup.map((matchInfo) => {
          const match = group.matches.find(
            (match) => matchInfo.matchId === match.matchId
          );

          const stats = matchStatistics?.find(
            (x) => x.matchId === match.matchId
          );
          return (
            <Match
              key={match.team1.name + match.team2.name}
              match={match}
              matchInfo={matchInfo}
              finalsStage={group.finalsStage}
              mode={mode}
              matchStatistic={stats}
              showStatistics={showStatistics}
            />
          );
        })}
        {points !== null && mode === "placedBet" && (
          <div className="flex border-t justify-end border-black pt-1 pr-1 ">
            {points > 0
              ? `${LabelMap[group.name] || "Poäng rätt lag vidare"}: ${points}`
              : ""}
          </div>
        )}
      </Container>
    </motion.div>
  );
}

export default MatchGroup;
