import React from "react";
import { useRecoilValue } from "recoil";
import { pointsFromGoalscorerState } from "../../recoil/bet-slip/atoms";
import Container from "../Container";
import Auto from "./Auto";
import { GoalScorer } from "calculations/src/types/goalScorer";

type Props = {
  goalscorer: GoalScorer | null;
  handleSetGoalscorer: (goalscorer: GoalScorer) => void;
  mode: string;
};

function GoalscorerInput({ goalscorer, handleSetGoalscorer, mode }: Props) {
  const points = useRecoilValue(pointsFromGoalscorerState);

  return (
    <Container>
      <h2 className="mb-1 font-semibold">Skyttekung</h2>
      {mode !== "placedBet" ? (
        <Auto
          mode={mode}
          goalscorer={goalscorer}
          setGoalscorer={handleSetGoalscorer}
        />
      ) : (
        <div className="flex justify-between">
          <span>{goalscorer?.name}</span>
          {points !== undefined && <span>{`Poäng: ${points}`}</span>}
        </div>
      )}
    </Container>
  );
}

export default GoalscorerInput;
