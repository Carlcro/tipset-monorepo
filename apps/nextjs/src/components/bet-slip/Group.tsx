import React from "react";
import { useRecoilValue } from "recoil";
import { getPointsFromGroup } from "../../recoil/bet-slip/selectors/selectors";
import { motion } from "framer-motion";
import Container from "../Container";
import { TeamResult } from "calculations/src/types/teamResult";

type Props = {
  groupResult: TeamResult[];
  groupName: string;
  mode: string;
};

export default function Group({ groupResult, groupName, mode }: Props) {
  const points = useRecoilValue(getPointsFromGroup(groupName));

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
              <th className="pl-2 text-left">{groupName}</th>
              <th>S</th>
              <th>V</th>
              <th>F</th>
              <th>O</th>
              <th className="hidden md:table-cell">GM</th>
              <th className="hidden md:table-cell">IM</th>
              <th>Diff</th>
              <th>P</th>
            </tr>
          </thead>
          <tbody>
            {groupResult.map((gr) => (
              <tr key={gr.team.name}>
                <td className="w-full px-2">{gr.team.name}</td>
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
            <span>Poäng från grupp</span>
            <span>{points}</span>
          </div>
        ) : (
          <div />
        )}
      </Container>
    </motion.div>
  );
}
