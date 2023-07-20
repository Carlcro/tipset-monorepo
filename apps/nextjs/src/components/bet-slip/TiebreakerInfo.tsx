import React from "react";
import Container from "../Container";

function TiebreakerInfo() {
  const rules = [
    "Antal inspelade poäng sett till samtliga spelade gruppspelsmatcher",
    "Målskillnad sett till samtliga spelade gruppspelsmatcher",
    "Antal gjorda mål sett till samtliga spelade gruppspelsmatcher",
    "Antal inspelade poäng sett till matcherna mellan lagen i fråga",
    "Målskillnad sett till matcherna mellan lagen i fråga",
    "Antal gjorda mål sett till matcherna mellan lagen i fråga",
  ];

  return (
    <Container classNames="px-10 py-2 m-2">
      <h1 className="mb-2 -ml-5 text-lg font-bold ">
        Tiebreakers i gruppspelet
      </h1>
      <ol className="list-decimal space-y-2">
        {rules.map((rule, index) => (
          <li key={index}>{rule}</li>
        ))}
      </ol>
      <div className="-ml-5 mt-2 italic">
        OBS! Tipset tar inte hänsyn till rangordning utöver ovanstående
        kriterier. Vid tippning där lag fortfarande inte kan särskiljas efter
        kriterier 1-6 kommer alfabetisk ordning avgöra.
      </div>
    </Container>
  );
}

export default TiebreakerInfo;
