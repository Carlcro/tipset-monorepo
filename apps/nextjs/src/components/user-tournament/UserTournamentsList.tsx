import { motion } from "framer-motion";
import Link from "next/link";
import Container from "../Container";
import { trpc } from "../../utils/trpc";
import Spinner from "../Spinner";
import { useTranslation } from "next-i18next";
import { Link as RadixLink, Switch } from "@radix-ui/themes";

const UserTournamentsList = () => {
  const { t } = useTranslation("user-tournament");
  const utils = trpc.useContext();

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
  const {
    data: isInMainTournamentData,
    isLoading: isLoadingIsinMainTournament,
  } = trpc.userTournament.isParticipationInMainTournament.useQuery();

  const handleParticipateInMainTournament = (checked: boolean) => {
    mutate({
      join: checked,
    });
  };

  const { data, isLoading } = trpc.userTournament.getUserTournaments.useQuery();
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Container>
        <div className="font-bold">{t("your-groups")}</div>
        {isLoading || isLoadingIsinMainTournament ? (
          <div className="flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <ul>
            {data?.map((tournament) => (
              <li key={tournament.id}>
                <Link href={`/user-tournament-page/${tournament.id}`}>
                  <RadixLink>{tournament.name}</RadixLink>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-5 flex flex-col text-sm font-bold">
          <span>{t("participateInMainTournament")}</span>
          <Switch
            color="cyan"
            onCheckedChange={handleParticipateInMainTournament}
            checked={isInMainTournamentData}
          />
          <span className="mt-2 text-xs font-light">
            {t("main-tournament-explanation")}
          </span>
        </div>
      </Container>
    </motion.div>
  );
};

export default UserTournamentsList;
