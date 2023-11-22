import { motion } from "framer-motion";
import Link from "next/link";
import Container from "../Container";
import { trpc } from "../../utils/trpc";
import Spinner from "../Spinner";
import { useTranslation } from "next-i18next";
import { Link as RadixLink } from "@radix-ui/themes";

const UserTournamentsList = () => {
  const { t } = useTranslation("user-tournament");

  const { data, isLoading } = trpc.userTournament.getUserTournaments.useQuery();
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Container>
        <div className="font-bold">{t("your-groups")}</div>
        {isLoading ? (
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
      </Container>
    </motion.div>
  );
};

export default UserTournamentsList;
