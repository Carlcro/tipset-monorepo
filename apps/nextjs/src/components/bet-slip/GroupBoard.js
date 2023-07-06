import React from "react";
import Group from "./Group";
import { useRecoilValue } from "recoil";
import { getSortedGroupResults } from "../../recoil/bet-slip/selectors/results";

export default function GroupBoard({ mode }) {
  const groupResults = useRecoilValue(getSortedGroupResults);

  return (
    <div className="flex flex-col gap-2">
      {groupResults.map((groupResult) => (
        <Group
          mode={mode}
          key={groupResult.name}
          points={groupResult.points}
          groupName={groupResult.name}
          groupResult={groupResult.results}
        />
      ))}
    </div>
  );
}
