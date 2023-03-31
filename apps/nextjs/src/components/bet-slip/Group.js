import React from "react";
import { useRecoilValue } from "recoil";
import { getPointsFromGroup } from "../../recoil/bet-slip/selectors/selectors";
import { motion } from "framer-motion";
import Container from "../Container";

export default function Group({ groupResult, groupName, mode }) {
  const points = useRecoilValue(getPointsFromGroup(groupName));

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Container classNames="m-2">
        <table className="table-fixed">
          <thead>
            <tr>
              <th className="text-left pl-2">{groupName}</th>
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
                <td className="w-40 px-2">{gr.team.name}</td>
                <td className="px-2">{gr.played}</td>
                <td className="px-2">{gr.won}</td>
                <td className="px-2">{gr.lost}</td>
                <td className="px-2">{gr.draw}</td>
                <td className="px-2 hidden md:table-cell">{gr.goals}</td>
                <td className="px-2 hidden md:table-cell">{gr.conceded}</td>
                <td className="px-2">{gr.diff}</td>
                <td className="px-2">{gr.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {points !== null && mode === "placedBet" ? (
          <div className="border-t border-black mx-2 flex justify-between">
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
