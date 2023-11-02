import Link from "next/link";
import { motion } from "framer-motion";
import DiffIndicator from "../DiffIndicator";
import Container from "../Container";
import { trpc } from "../../utils/trpc";
import { useTranslation } from "next-i18next";
import KickMemberDialog from "./KickMemberDialog";

type Props = {
  userTournamentId: string;
};

const HighScoreTable = ({ userTournamentId }: Props) => {
  const { t } = useTranslation("user-tournament-page");

  const { data } = trpc.userTournament.getHighscore.useQuery({
    userTournamentId: userTournamentId,
  });

  if (!data) {
    return <div className="sm:w-[400px]"></div>;
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Container classNames="sm:w-[400px]">
        <h2 className="text-center text-xl font-semibold">
          {data.name === "main-tournament" ? t("highscore") : data.name}
        </h2>
        <table className="mx-1 w-full">
          <thead>
            <tr>
              <th>{t("rank")}</th>
              <th className="text-center md:text-left">{t("name")}</th>
              <th>{t("points")}</th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {data.highScoreData.map((betslip, index) => (
              <tr
                className={
                  index % 2 === 0
                    ? "border-b-2 border-polarNight bg-gray-100"
                    : "border-b-2 border-polarNight"
                }
                key={betslip.id}
              >
                {data.isOwner && (
                  <td className="cursor-pointer text-sm">
                    <KickMemberDialog
                      memberId={betslip.id}
                      memberName={betslip.fullName}
                    />
                  </td>
                )}
                <td className="text-center">{index + 1}</td>
                <td className="text-center md:text-left">
                  <Link href={`/placed-bets/${betslip.id}`}>
                    {betslip.fullName}
                  </Link>
                </td>
                <td className="text-center">{betslip.points || "-"}</td>
                <td className="text-center">
                  {false ? (
                    <div className="absolute my-2 justify-around">
                      <span
                        className={
                          betslip.difference < 0
                            ? "relative left-4 top-[-23px] text-xs"
                            : "relative left-4 top-[-17px] text-xs"
                        }
                      >
                        {Math.abs(betslip.difference)}
                      </span>
                      <div
                        className={
                          betslip.difference < 0
                            ? "relative left-[14px] top-[-34px]"
                            : "relative left-[18.5px] top-[-48px]"
                        }
                      >
                        <div
                          className={
                            betslip.difference < 0
                              ? "rotate-180 fill-red-600"
                              : "fill-green-600"
                          }
                        >
                          <DiffIndicator height={20} width={20} />
                        </div>
                      </div>
                    </div>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Container>
    </motion.div>
  );
};

export default HighScoreTable;
