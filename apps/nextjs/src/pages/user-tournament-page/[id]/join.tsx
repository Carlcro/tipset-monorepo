// TODO this file

import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Container from "../../../components/Container";
import { trpc } from "../../../utils/trpc";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nConfig from "../../../../next-i18next.config.mjs";
import { useTranslation } from "react-i18next";

export default function Join() {
  const router = useRouter();
  const { t } = useTranslation("user-tournament");

  const id = router.query.id as string;

  const { mutate } = trpc.userTournament.addMember.useMutation({
    onSuccess: () => router.push(`/user-tournament-page/${id}`),
  });
  const { data: user } = trpc.user.getUser.useQuery();

  useEffect(() => {
    if (user) {
      mutate({
        userTournamentId: id,
        email: user.email,
      });
    }
  }, [id, user, mutate]);

  return (
    <div className="flex justify-center">
      <Container classNames="px-12 py-5 flex flex-col">
        <span>{t("you-are-being-sent-to-group")}</span>
      </Container>
    </div>
  );
}

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(
      locale,
      ["common", "user-tournament"],
      nextI18nConfig,
      ["en", "sv"],
    )),
  },
});
