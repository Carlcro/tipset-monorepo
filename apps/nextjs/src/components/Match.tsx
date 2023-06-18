import React, { ChangeEventHandler, useState } from "react";
import GoalInput from "./GoalInput";
import { format, addHours } from "date-fns";
import {
  Match,
  getMatchDrawState,
  getMatchState,
  setMatchState,
} from "../recoil/bet-slip/selectors/selectors";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { flags } from "../../utils/flags";
import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill";
import { MatchInfo } from "@acme/db";
import { boolean } from "zod";
import { MatchBet } from "../recoil/bet-slip/atoms";
import { Team } from "calculations/src/types/team";

polyfillCountryFlagEmojis();

const StatsRow = ({ stats }) => (
  <>
    <div className={`flex justify-between px-2 text-xs`}>
      <div className="flex items-center justify-center">
        {(stats.team1Percentage * 100).toFixed(0) + "%"}
      </div>
      <div className="flex items-center justify-center">
        {(stats.drawPercentage * 100).toFixed(0) + "%"}
      </div>
      <div className="flex items-center justify-center">
        {(stats.team2Percentage * 100).toFixed(0) + "%"}
      </div>
    </div>
  </>
);

type ResultRowProps = {
  finalsStage: boolean;
  draw: boolean;
  matchScore: MatchBet;
  team1: Team;
  team2: Team;
  handleTeam1Score: (score: number) => void;
  handleTeam2Score: (score: number) => void;
  handlePenaltyWinner: (team: Team) => ChangeEventHandler<HTMLInputElement>;
  mode: string;
};

const ResultRow = ({
  finalsStage,
  draw,
  matchScore,
  team1,
  team2,
  handleTeam1Score,
  handleTeam2Score,
  handlePenaltyWinner,
  mode,
}: ResultRowProps) => (
  <>
    <div className={`flex justify-center ${finalsStage && "col-span-2"}`}>
      <div
        className={`grid place-items-center ${
          finalsStage && draw ? "" : "invisible"
        }`}
      >
        <input
          checked={
            matchScore.penaltyWinner
              ? matchScore.penaltyWinner.id === team1.id
              : false
          }
          disabled={mode === "placedBet"}
          onChange={handlePenaltyWinner(team1)}
          type="checkbox"
        />
      </div>
      <div className="flex items-center justify-center">
        <GoalInput
          teamScore={matchScore.team1Score}
          setTeamScore={handleTeam1Score}
          mode={mode}
        />
      </div>
      <div className="flex items-center justify-center">-</div>
      <div className="flex items-center justify-center">
        <GoalInput
          teamScore={matchScore.team2Score}
          setTeamScore={handleTeam2Score}
          mode={mode}
        />
      </div>
      <div
        className={`grid place-items-center ${
          finalsStage && draw ? "" : "invisible"
        }`}
      >
        <input
          checked={
            matchScore.penaltyWinner
              ? matchScore.penaltyWinner.id === team2.id
              : false
          }
          disabled={mode === "placedBet"}
          onChange={handlePenaltyWinner(team2)}
          type="checkbox"
        />
      </div>
    </div>
  </>
);

const Match = ({
  match,
  matchInfo,
  finalsStage,
  mode,
}: {
  match: Match;
  matchInfo: MatchInfo;
  finalsStage: boolean;
  mode: string;
}) => {
  const { team1, team2, matchId } = match;
  const { arena, city, time } = matchInfo;

  const matchScore = useRecoilValue(getMatchState(matchId));
  const draw = useRecoilValue(getMatchDrawState(matchId));
  const setScore = useSetRecoilState(setMatchState);

  const handleTeam1Score = (score: string) => {
    setScore({
      matchId,
      team1Score: score === "" ? 0 : Number(score),
      team2Score:
        matchScore.team2Score === "" ? 0 : Number(matchScore.team2Score),
      team1: team1,
      team2: team2,
    });
  };

  const handleTeam2Score = (score: string) => {
    setScore({
      matchId,
      team1Score:
        matchScore.team1Score === "" ? 0 : Number(matchScore.team1Score),
      team2Score: score === "" ? 0 : Number(score),
      team1: team1,
      team2: team2,
    });
  };

  const handlePenaltyWinner =
    (team) =>
    ({ target }) => {
      setScore({
        matchId,
        team1Score: Number(matchScore.team1Score),
        team2Score: Number(matchScore.team2Score),
        team1: team1,
        team2: team2,
        penaltyWinner: team,
      });
    };

  const determineWinner = (team: 1 | 2) => {
    const { team1Score, team2Score } = matchScore;

    if (team1Score === "" || team2Score === "") {
      return null;
    }

    const score1 = Number(team1Score);
    const score2 = Number(team2Score);

    if (team === 1) {
      if (score1 > score2) {
        return "text-frost4 font-bold";
      } else if (score1 < score2) {
        return "text-auroraRed font-light";
      } else if (score1 === score2) {
        return "text-gray-600 italic";
      }
    } else if (team === 2) {
      if (score2 > score1) {
        return "text-frost4 font-bold";
      } else if (score2 < score1) {
        return "text-auroraRed font-light";
      } else if (score1 === score2) {
        return "text-gray-600 italic";
      }
    }
    return "";
  };
  const team1Style = determineWinner(1);
  const team2Style = determineWinner(2);
  return (
    <div
      className={
        mode === "placedBet"
          ? finalsStage
            ? "mb-1 grid grid-cols-[minmax(75px,_1fr)_90px_70px_minmax(70px,_1fr)_20px] md:grid-cols-[85px_110px_90px_110px_100px_15px] lg:grid-cols-[100px_150px_90px_90px_150px_50px_1fr]"
            : "mb-1 grid grid-cols-[minmax(90px,_1fr)_120px_minmax(90px,_1fr)_30px] md:grid-cols-[90px_minmax(110px,_1fr)_110px_minmax(110px,_1fr)_40px] lg:grid-cols-[100px_repeat(3,_130px)_80px_1fr]"
          : finalsStage
          ? "mb-1 grid grid-cols-4 md:grid-cols-5 lg:grid-cols-[100px_150px_90px_90px_150px_1fr]"
          : "mb-1 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-[100px_repeat(3,_160px)_1fr]"
      }
    >
      <div className="hidden items-center justify-center md:flex md:flex-col">
        <span>{format(addHours(new Date(time), -2), "dd/M H:mm")}</span>
      </div>
      <div
        className={`flex items-center justify-end truncate px-2 text-sm md:text-base`}
      >
        <span className={`truncate ${team1Style}`}>{team1.name}</span>
        <span className="ml-2 text-xl xs:flex">{flags[team1.name]}</span>
      </div>

      <ResultRow
        finalsStage={finalsStage}
        draw={draw}
        matchScore={matchScore}
        team1={team1}
        team2={team2}
        handleTeam1Score={handleTeam1Score}
        handleTeam2Score={handleTeam2Score}
        handlePenaltyWinner={handlePenaltyWinner}
        mode={mode}
      ></ResultRow>

      <div
        className={`flex items-center justify-start truncate px-2 text-sm md:text-base`}
      >
        <span className="mr-2 text-xl xs:flex">{flags[team2.name]}</span>

        <span className={`truncate ${team2Style}`}>{team2.name}</span>
      </div>
      {mode === "placedBet" && (
        <div className="text-center">{matchScore.points}</div>
      )}
      <div className="hidden flex-col truncate lg:flex">
        <span className="truncate">
          {city}, {arena}
        </span>
      </div>
    </div>
  );
};

export default Match;
