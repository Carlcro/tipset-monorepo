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

const PlacedBets = () => {
  const setFromBetslip = useSetRecoilState(setFromBetslipState);
  const setChampionship = useSetRecoilState(championshipState);

  const [placedBet, setPlacedBet] = useState(true);
  const [name, setName] = useState("");
  const router = useRouter();
  const id = router.query.id as string;

  const { data: betSlipData, isLoading: placedBetLoading } =
    trpc.betslip.getPlacedBet.useQuery(
      {
        id,
      },
      {
        enabled: Boolean(id),
        retry: false,
        onError: () => {
          setPlacedBet(false);
        },
      },
    );

  const { data: config, isLoading: configLoading } =
    trpc.config.getConfig.useQuery();

  useEffect(() => {
    if (betSlipData) {
      setFromBetslip(betSlipData);
      setName(betSlipData.user.fullName);
    }
  }, [setFromBetslip, betSlipData]);

  const { data: championshipData } =
    trpc.championship.getOneChampionship.useQuery();

  useEffect(() => {
    if (championshipData) {
      setChampionship(championshipData);
    }
  }, [championshipData, setChampionship]);

  if (!config || placedBetLoading || configLoading) {
    return null;
  }

  if (config.bettingAllowed) {
    return (
      <div className=" grid place-content-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Container classNames="p-6 mt-10 flex flex-col justify-center space-y-5">
            <h2>När VM startar kommer du kunna se andras tips</h2>
            <button className="font-bold" onClick={() => router.back()}>
              Gå tillbaka
            </button>
          </Container>
        </motion.div>
      </div>
    );
  }

  if (!placedBet) {
    return (
      <div className=" grid place-content-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Container classNames="p-6 mt-10 flex flex-col justify-center space-y-5">
            <h2>Användaren har inte lagt något tips</h2>
            <button className="font-bold" onClick={() => router.back()}>
              Gå tillbaka
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
