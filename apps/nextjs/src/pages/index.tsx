import React from "react";
import UserTournamentForm from "../components/user-tournament/UserTournamentForm";
import UserTournamentsList from "../components/user-tournament/UserTournamentsList";
import { trpc } from "../utils/trpc";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nConfig from "../../next-i18next.config.mjs";
import HighScoreTable from "../components/user-tournament-page/HighScoreTable";

const Index = () => {
  const { data } = trpc.config.getConfig.useQuery();

  if (!data) {
    return null;
  }

  return (
    <div className="flex flex-col-reverse items-center px-5 md:flex-row md:items-start md:justify-center md:space-x-8">
      <div className="mt-5 w-full max-w-[400px] space-y-5 md:mt-0">
        <UserTournamentsList />
        <UserTournamentForm />
      </div>
      <div className="w-full max-w-[400px]">
        <HighScoreTable userTournamentId={data.mainTournament} />
      </div>
    </div>
  );
};

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(
      locale,
      ["user", "user-tournament", "common", "user-tournament-page"],
      nextI18nConfig,
      ["en", "sv"],
    )),
  },
});

export default Index;
