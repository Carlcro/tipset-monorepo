import React from "react";
import Group from "./Group";
import { useRecoilValue } from "recoil";
import { getSortedGroupResults } from "../../recoil/bet-slip/selectors/results";
import { Mode } from "../../types";

type Props = {
  mode: Mode;
};

export default function GroupBoard({ mode }: Props) {
  const groupResults = useRecoilValue(getSortedGroupResults);

  return (
    <div className="flex flex-col gap-2">
      {groupResults.map((groupResult) => (
        <Group
          mode={mode}
          key={groupResult.name}
          groupName={groupResult.name}
          groupResult={groupResult.results}
        />
      ))}
    </div>
  );
}
