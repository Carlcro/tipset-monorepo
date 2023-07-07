import React from "react";
import UserTournamentForm from "../../components/user-tournament/UserTournamentForm";
import UserTournamentsList from "../../components/user-tournament/UserTournamentsList";
import { trpc } from "../../utils/trpc";

const UserTournamentContainer = () => {
  const utils = trpc.useContext();
  const { mutate, isLoading } =
    trpc.userTournament.createUserTournament.useMutation({
      onSuccess: () => utils.invalidate(),
    });
  return (
    <div className="flex flex-col-reverse items-center px-5 md:flex-row md:items-start md:justify-center md:space-x-8">
      <div className="mt-5  w-full max-w-[400px] space-y-5 md:mt-0">
        <UserTournamentsList addedLoading={isLoading} />
        <UserTournamentForm createUserTournament={mutate} />
      </div>
      {/*       <HighScoreTable highscoreData={highscoreData} />
       */}{" "}
    </div>
  );
};

export default UserTournamentContainer;
