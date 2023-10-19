import React from "react";
import { useTranslation } from "next-i18next";
import Container from "../Container";

function TiebreakerInfo() {
  const { t } = useTranslation("bet-slip");

  const rules = [
    t("tiebreaker-1"),
    t("tiebreaker-2"),
    t("tiebreaker-3"),
    t("tiebreaker-4"),
    t("tiebreaker-5"),
    t("tiebreaker-6"),
  ];

  return (
    <Container classNames="px-10 py-2 m-2">
      <h1 className="mb-2 -ml-5 text-lg font-bold ">
        {t("tiebreaker-header")}
      </h1>
      <ol className="list-decimal space-y-2">
        {rules.map((rule, index) => (
          <li key={index}>{rule}</li>
        ))}
      </ol>
      <div className="-ml-5 mt-2 italic">{t("tiebreaker-obs")}</div>
    </Container>
  );
}

export default TiebreakerInfo;
