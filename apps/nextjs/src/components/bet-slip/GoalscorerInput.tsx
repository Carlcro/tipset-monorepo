import React from "react";
import { useRecoilValue } from "recoil";
import { pointsFromGoalscorerState } from "../../recoil/bet-slip/atoms";
import Container from "../Container";
import AutoComplete from "./AutoComplete";
import { Player } from "@acme/db";
import { Mode } from "../../types";
import { useTranslation } from "next-i18next";

type Props = {
  goalscorer: Player | null;
  handleSetGoalscorer: (goalscorer: Player) => void;
  mode: Mode;
};

function GoalscorerInput({ goalscorer, handleSetGoalscorer, mode }: Props) {
  const points = useRecoilValue(pointsFromGoalscorerState);
  const { t } = useTranslation("bet-slip");

  return (
    <Container>
      <h2 className="mb-1 font-semibold">{t("goal-scorer")}</h2>
      {mode !== "placedBet" && mode !== "facit" ? (
        <AutoComplete
          goalscorer={goalscorer}
          handleSetGoalscorer={handleSetGoalscorer}
        />
      ) : (
        <div className="flex justify-between">
          <span>{goalscorer?.name}</span>
          {points && points > 0 ? (
            <span>{`${t("points")}: ${points}`}</span>
          ) : (
            ""
          )}
        </div>
      )}
    </Container>
  );
}

export default GoalscorerInput;
