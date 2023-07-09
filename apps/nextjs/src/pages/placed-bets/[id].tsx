import { useSetRecoilState } from "recoil";
import { setFromBetslipState } from "../../recoil/bet-slip/selectors/selectors";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import dynamic from "next/dynamic";
import Container from "../../components/Container";
import { trpc } from "../../utils/trpc";

const DynamicBetslip = dynamic(
  () => import("../../components/bet-slip/BetSlip"),
  {
    ssr: false,
  },
);

const PlacedBets = () => {
  const setFromBetslip = useSetRecoilState(setFromBetslipState);
  const [placedBet, setPlacedBet] = useState(true);
  const [name, setName] = useState("");
  const router = useRouter();
  const id = router.query.id as string;

  const { data: betSlipData, isLoading: placedBetLoading } =
    trpc.betslip.getPlacedBet.useQuery(
      {
        userId: id,
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
      <DynamicBetslip headerText={name} mode={"placedBet"}></DynamicBetslip>
    </div>
  );
};

export default PlacedBets;
