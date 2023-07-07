import { motion } from "framer-motion";
import Link from "next/link";
import Container from "../Container";
import { trpc } from "../../utils/trpc";
import Spinner from "../Spinner";

const UserTournamentsList = ({ addedLoading }: { addedLoading: boolean }) => {
  const { data, isLoading } = trpc.userTournament.getUserTournaments.useQuery();
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Container>
        <div className="font-bold">Dina grupper</div>
        {isLoading || addedLoading ? (
          <Spinner />
        ) : (
          <ul>
            {data?.map((tournament) => (
              <li key={tournament.id}>
                <Link href={`/user-tournament-page/${tournament.id}`}>
                  {tournament.name}
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
