import { useSetRecoilState } from "recoil";
import { setFromBetslipState } from "../../recoil/bet-slip/selectors/selectors";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import Container from "../../components/Container";
import { trpc } from "../../utils/trpc";
import BetSlip from "../../components/bet-slip/BetSlip";
import { championshipState } from "../../recoil/championship/atoms";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nConfig from "../../../next-i18next.config.mjs";
import { useTranslation } from "react-i18next";

const PlacedBets = () => {
  const { t } = useTranslation("bet-slip");

  const setFromBetslip = useSetRecoilState(setFromBetslipState);
  const setChampionship = useSetRecoilState(championshipState);

  const [placedBet, setPlacedBet] = useState(true);
  const [name, setName] = useState("");
  const router = useRouter();
  const id = router.query.id as string;
  const { data: config, isLoading: configLoading } =
    trpc.config.getConfig.useQuery();

  const { data: betSlipData, isLoading: placedBetLoading } =
    trpc.betslip.getPlacedBet.useQuery(
      {
        id,
      },
      {
        enabled: Boolean(id) && !config?.bettingAllowed,
        retry: false,
        onError: () => {
          setPlacedBet(false);
        },
      },
    );

  const { data: championshipData } =
    trpc.championship.getOneChampionship.useQuery();
  const { data: user } = trpc.user.getUser.useQuery();

  useEffect(() => {
    if (championshipData) {
      setChampionship(championshipData);
    }
  }, [championshipData, setChampionship]);

  useEffect(() => {
    if (betSlipData && !config?.bettingAllowed) {
      setFromBetslip(betSlipData);
      setName(betSlipData.user.fullName);
    }
  }, [setFromBetslip, betSlipData]);

  if (!config || configLoading) {
    return null;
  }

  if (config.bettingAllowed && !user?.isAdmin) {
    return (
      <div className=" grid place-content-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Container classNames="p-6 mt-10 flex flex-col justify-center space-y-5">
            <h2>{t("when-tournament-starts-you-can-see")}</h2>
            <button className="font-bold" onClick={() => router.back()}>
              {t("go-back")}
            </button>
          </Container>
        </motion.div>
      </div>
    );
  }

  if (!placedBet || id === "undefined") {
    return (
      <div className=" grid place-content-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Container classNames="p-6 mt-10 flex flex-col justify-center space-y-5">
            <h2>{t("user-not-placed-bet")}</h2>
            <button className="font-bold" onClick={() => router.back()}>
              {t("go-back")}
            </button>
          </Container>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <BetSlip headerText={name} mode={"placedBet"} />
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

export default PlacedBets;
