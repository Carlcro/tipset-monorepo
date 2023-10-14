import React from "react";
import UserTournamentForm from "../../components/user-tournament/UserTournamentForm";
import UserTournamentsList from "../../components/user-tournament/UserTournamentsList";
import { trpc } from "../../utils/trpc";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nConfig from "../../../next-i18next.config.mjs";
import { Flex, Text, Button } from "@radix-ui/themes";

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

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(
      locale,
      ["user-tournament", "common"],
      nextI18nConfig,
      ["en", "sv"],
    )),
  },
});

export default UserTournamentContainer;
