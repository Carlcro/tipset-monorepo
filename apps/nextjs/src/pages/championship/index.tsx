import { useSetRecoilState } from "recoil";
import { setFromBetslipState } from "../../recoil/bet-slip/selectors/selectors";
import { useEffect } from "react";
import { trpc } from "../../utils/trpc";
import BetSlip from "../../components/bet-slip/BetSlip";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nConfig from "../../../next-i18next.config.mjs";
import Spinner from "../../components/Spinner";
import { championshipState } from "../../recoil/championship/atoms";
import { useTranslation } from "react-i18next";

const Championship = () => {
  const setFromBetslip = useSetRecoilState(setFromBetslipState);
  const setChampionship = useSetRecoilState(championshipState);

  const { t } = useTranslation("common");

  const { data: betSlipData, isLoading } =
    trpc.answerSheet.getAnswerSheet.useQuery();
  const { data: championshipData } =
    trpc.championship.getOneChampionship.useQuery();

  useEffect(() => {
    if (championshipData) {
      setChampionship(championshipData);
    }
  }, [championshipData, setChampionship]);

  useEffect(() => {
    if (betSlipData) {
      setFromBetslip(betSlipData);
    }
  }, [setFromBetslip, betSlipData]);

  if (isLoading) {
    return (
      <div className="mt-32 flex w-full items-center justify-center">
        <Spinner width={50} height={50} />
      </div>
    );
  }

  return (
    <div className="pb-10">
      <BetSlip headerText={t("facit")} mode={"facit"} />;
    </div>
  );
};

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(
      locale,
      ["countries", "bet-slip", "common"],
      nextI18nConfig,
      ["en", "sv"],
    )),
  },
});

export default Championship;
