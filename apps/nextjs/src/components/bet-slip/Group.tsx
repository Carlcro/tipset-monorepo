import React from "react";
import { useRecoilValue } from "recoil";
import { getPointsFromGroup } from "../../recoil/bet-slip/selectors/selectors";
import { motion } from "framer-motion";
import Container from "../Container";
import { TeamResult } from "calculations/src/types/teamResult";
import { useTranslation } from "next-i18next";

type Props = {
  groupResult: TeamResult[];
  groupName: string;
  mode: string;
};

export default function Group({ groupResult, groupName, mode }: Props) {
  const points = useRecoilValue(getPointsFromGroup(groupName));
  const { t } = useTranslation(["bet-slip", "countries"]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Container>
        <table className="table-fixed">
          <thead>
            <tr>
              <th className="pl-2 text-left">{t("group", { groupName })}:</th>
              <th>{t("played-abbr")}</th>
              <th>{t("won-abbr")}</th>
              <th>{t("lost-abbr")}</th>
              <th>{t("draw-abbr")}</th>
              <th className="hidden md:table-cell">{t("goals-scored-abbr")}</th>
              <th className="hidden md:table-cell">
                {t("goals-conceded-abbr")}
              </th>
              <th>{t("difference-abbr")}</th>
              <th>{t("points-abbr")}</th>
            </tr>
          </thead>
          <tbody>
            {groupResult.map((gr) => (
              <tr key={gr.team.name}>
                <td className="w-full px-2">
                  {t(gr.team.name, { ns: "countries" })}
                </td>
                <td className="px-2">{gr.played}</td>
                <td className="px-2">{gr.won}</td>
                <td className="px-2">{gr.lost}</td>
                <td className="px-2">{gr.draw}</td>
                <td className="hidden px-2 md:table-cell">{gr.goals}</td>
                <td className="hidden px-2 md:table-cell">{gr.conceded}</td>
                <td className="px-2">{gr.diff}</td>
                <td className="px-2">{gr.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {points !== null && mode === "placedBet" ? (
          <div className="border-black mx-2 flex justify-between border-t">
            <span>{t("points-from-group")}</span>
            <span>{t("points")}</span>
          </div>
        ) : (
          <div />
        )}
      </Container>
    </motion.div>
  );
}
