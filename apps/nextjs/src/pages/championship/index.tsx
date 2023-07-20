import { useSetRecoilState } from "recoil";
import { setFromBetslipState } from "../../recoil/bet-slip/selectors/selectors";
import { useEffect } from "react";
import { trpc } from "../../utils/trpc";
import BetSlip from "../../components/bet-slip/BetSlip";

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
      <BetSlip headerText={"Facit"} mode={"placedBet"} />;
    </div>
  );
};

export default Championship;
