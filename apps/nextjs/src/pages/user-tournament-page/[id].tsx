import React, { useState } from "react";
import HighScoreTable from "../../components/user-tournament-page/HighScoreTable";
import KickMemberDialog from "../../components/user-tournament-page/KickMemberDialog";
import UserTournamentPanel from "../../components/user-tournament-page/UserTournamentPanel";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nConfig from "../../../next-i18next.config.mjs";
import { useRouter } from "next/router";

const UserTournamentPage = () => {

  const router = useRouter();

  const id = router.query.id as string;

  return (
    <div className="flex flex-col-reverse items-center px-5 md:flex-row md:items-start md:justify-center md:space-x-8">
      <UserTournamentPanel />
      <HighScoreTable userTournamentId={id} />
    </div>
  );
};

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(
      locale,
      ["user-tournament-page", "common"],
      nextI18nConfig,
      ["en", "sv"],
    )),
  },
});

export default UserTournamentPage;
