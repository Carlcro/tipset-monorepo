import { motion } from "framer-motion";
import React from "react";
import { useRecoilValue } from "recoil";
import {
  MatchType,
  getPointsFromAdvancement,
} from "../../recoil/bet-slip/selectors/selectors";
import Container from "../Container";
import Match from "../Match";
import { MatchInfo, PointsFromAdvancement } from "@acme/db";
import { useTranslation } from "next-i18next";
import { Mode } from "../../types";

type MatchGroupProps = {
  group: {
    name: string;
    matches: MatchType[];
    finalsStage?: boolean;
  };
  matchInfos: MatchInfo[];
  mode: Mode;
  advancementPoints?: PointsFromAdvancement;
};

function MatchGroup({
  group,
  matchInfos,
  mode,
  advancementPoints,
}: MatchGroupProps) {
  const { t } = useTranslation("bet-slip");

  const LabelMap: { [key: string]: string } = {
    Bronsmatch: t("points-correct-bronze-winner"),
    final: t("points-correct-euro-champion"),
  };

  const matchIds = group?.matches?.map((m) => m.matchId);

  const matchInfosForGroup =
    matchIds &&
    matchInfos
      .filter((mi) => matchIds.includes(mi.matchId))
      .sort((a, b) => new Date(a.time).valueOf() - new Date(b.time).valueOf());

  if (!group?.matches?.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      key={group.name}
    >
      <Container classNames="lg:w-full">
        <div className="flex justify-between">
          <h2 className="pl-2 pb-1 text-xl font-semibold">{`${
            group.finalsStage
              ? t(group.name)
              : t("group", { groupName: group.name })
          }`}</h2>
        </div>
        {matchInfosForGroup.map((matchInfo) => {
          const match = group.matches.find(
            (match) => matchInfo.matchId === match.matchId,
          );

          if (match) {
            return (
              <Match
                key={match.team1.name + match.team2.name}
                match={match}
                matchInfo={matchInfo}
                finalsStage={group.finalsStage}
                mode={mode}
              />
            );
          }
        })}
        {advancementPoints?.points !== undefined && mode === "placedBet" && (
          <div className="border-black flex justify-end border-t pt-1 pr-1 ">
            {advancementPoints?.points > 0
              ? `${
                  LabelMap[group.name] || t("points-correct-team-advancing")
                }: ${advancementPoints?.points}`
              : ""}
          </div>
        )}
      </Container>
    </motion.div>
  );
}

export default MatchGroup;
