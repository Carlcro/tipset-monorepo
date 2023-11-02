import { UserButton } from "@clerk/nextjs";
import { trpc } from "../../utils/trpc";
import { Flex, Switch, Text } from "@radix-ui/themes";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import nextI18nConfig from "../../../next-i18next.config.mjs";

const User = () => {
  const utils = trpc.useContext();
  const { t } = useTranslation("user");

  const { mutate } =
    trpc.userTournament.updateMainTournamentParticipation.useMutation({
      onMutate: async (newState) => {
        await utils.userTournament.isParticipationInMainTournament.cancel();

        utils.userTournament.isParticipationInMainTournament.setData(
          undefined,
          newState.join,
        );
        const previousData =
          utils.userTournament.isParticipationInMainTournament.getData();

        return { previousData, newState };
      },
      onError(err, newPost, ctx) {
        utils.userTournament.isParticipationInMainTournament.setData(
          undefined,
          ctx?.previousData,
        );
      },
      onSettled() {
        utils.userTournament.isParticipationInMainTournament.invalidate();
      },
    });
  const { data, isLoading } =
    trpc.userTournament.isParticipationInMainTournament.useQuery();

  const handleParticipateInMainTournament = (checked: boolean) => {
    mutate({
      join: checked,
    });
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="ml-10 flex flex-col justify-center space-y-9">
      <UserButton></UserButton>
      <Text as="label" size="2">
        <Flex gap="2">
          <Switch
            onCheckedChange={handleParticipateInMainTournament}
            checked={data}
          />
          {t("participateInMainTournament")}
        </Flex>
      </Text>
    </div>
  );
};

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(
      locale,
      ["user", "common"],
      nextI18nConfig,
      ["en", "sv"],
    )),
  },
});

export default User;
