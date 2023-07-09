import { useSetRecoilState } from "recoil";
import { setFromBetslipState } from "../../recoil/bet-slip/selectors/selectors";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { trpc } from "../../utils/trpc";

const DynamicBetslip = dynamic(
  () => import("../../components/bet-slip/BetSlip"),
  {
    ssr: false,
  },
);
const Championship = () => {
  const setFromBetslip = useSetRecoilState(setFromBetslipState);

  const { data: betSlipData } = trpc.answerSheet.getAnswerSheet.useQuery();

  useEffect(() => {
    if (betSlipData) {
      setFromBetslip(betSlipData);
    }
  }, [setFromBetslip, betSlipData]);

  return (
    <div className="pb-10">
      <DynamicBetslip headerText={"Facit"} mode={"placedBet"}></DynamicBetslip>;
    </div>
  );
};

export default Championship;
