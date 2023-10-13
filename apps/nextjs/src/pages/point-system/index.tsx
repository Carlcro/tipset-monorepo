import React, { useState } from "react";
import Container from "../../components/Container";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nConfig from "../../../next-i18next.config.mjs";

function PointSystem() {
  const [showGoalscorerRules, setShowGoalscorerRules] = useState(false);
  const { t } = useTranslation("point-system");

  return (
    <div className="mx-auto mb-28 flex w-full max-w-[500px] justify-center">
      <Container classNames="flex flex-col mx-5 max-w-6xl space-y-1">
        <h1 className="font-bold">{t("point-system")}</h1>
        <div>
          <h2 className="font-semibold text-gray-500">{t("group-stage")}:</h2>
          <ul>
            <li>{t("correct-result")}</li>
            <li>{t("correct-winner-draw")}</li>
            <li>{t("wrong-winner-draw")}</li>
            <li>{t("correct-placement")}</li>
            <li>{t("correct-team-advancing")}</li>
          </ul>
        </div>
        <div className="flex flex-col justify-items-center sm:flex-row sm:space-x-5">
          <table className="table-auto">
            <thead>
              <tr>
                <th></th>
                <th>{t("correct-result-abb")}</th>
                <th>{t("correct-winner-draw-abb")}</th>
                <th>{t("correct-team-advancing-abb")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-semibold">{t("round-of-16")}:</td>
                <td>15p</td>
                <td>15p</td>
                <td>25p</td>
              </tr>
              <tr>
                <td className="font-semibold">{t("quarter-finals")}:</td>
                <td>15p</td>
                <td>15p</td>
                <td>25p</td>
              </tr>
              <tr>
                <td className="font-semibold">{t("semi-final")}:</td>
                <td>20p</td>
                <td>20p</td>
                <td>30p</td>
              </tr>
              <tr>
                <td className="font-semibold">{t("bronze-match")}:</td>
                <td>20p</td>
                <td>20p</td>
                <td>30p</td>
              </tr>
              <tr>
                <td className="font-semibold">{t("final")}:</td>
                <td>25p</td>
                <td>25p</td>
                <td>35p</td>
              </tr>
            </tbody>
          </table>
          <div className="flex space-x-3 sm:flex-col sm:justify-end sm:space-x-0">
            <div>
              <span className="font-bold">{t("correct-result-abb")}</span> ={" "}
              {t("correct-result-explanation")}
            </div>
            <div>
              <span className="font-bold">{t("correct-winner-draw-abb")}</span>={" "}
              {t("correct-winner-draw-explanation")}
            </div>
            <div>
              <span className="font-bold">
                {t("correct-team-advancing-abb")}
              </span>{" "}
              ={t("correct-team-advancing-explanation")}
            </div>
          </div>
        </div>

        <div className="flex space-x-1">
          <span className="font-bold">{t("correct-goalscorer")}</span>
          <span>
            {t("number-of-goals")}
            <button
              onClick={() => setShowGoalscorerRules(!showGoalscorerRules)}
              className="text-white ml-4 cursor-pointer rounded-full bg-gray-200 px-2"
            >
              ?
            </button>
          </span>
        </div>
        {showGoalscorerRules && <GoldenBootInfo t={t} />}
      </Container>
    </div>
  );
}

const GoldenBootInfo = ({ t }: { t: (param: string) => string }) => {
  return (
    <div>
      <span className="font-bold">{t("extra-info-header")}:</span>
      <br />
      <span className="italic">{t("extra-info-content")}</span>
    </div>
  );
};

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(
      locale,
      ["point-system", "common"],
      nextI18nConfig,
      ["en", "sv"],
    )),
  },
});

export default PointSystem;
