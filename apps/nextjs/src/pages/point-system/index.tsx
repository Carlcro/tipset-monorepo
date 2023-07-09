import React, { useState } from "react";
import Container from "../../components/Container";

function PointSystem() {
  const [showGoalscorerRules, setShowGoalscorerRules] = useState(false);

  return (
    <div className="mx-auto mb-28 flex w-full max-w-[500px] justify-center">
      <Container classNames="flex flex-col mx-5 max-w-6xl space-y-1">
        <h1 className="font-bold">Poängsystem</h1>
        <div>
          <h2 className="font-semibold text-gray-500">Gruppspel:</h2>
          <ul>
            <li>{`Rätt resultat: 25 p`}</li>
            <li>{`Rätt segrare/oavgjort: 20 p minus antal mål fel för resp. lag`}</li>
            <li>{`Fel segrare/oavgjort: 10 p minus antal mål fel för resp.lag`}</li>
            <li>{`Rätt placering i gruppen (1-4): 5 p vardera`}</li>
            <li>
              {`Rätt lag vidare till slutspel (oavsett gruppspelsplats): 10 p var`}
            </li>
          </ul>
        </div>
        <div className="flex flex-col justify-items-center sm:flex-row sm:space-x-5">
          <table className="table-auto">
            <thead>
              <tr>
                <th></th>
                <th>RR</th>
                <th>RS/O</th>
                <th>RLV</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-semibold">Åttondelsfinal:</td>
                <td>15p</td>
                <td>15p</td>
                <td>25p</td>
              </tr>
              <tr>
                <td className="font-semibold">Kvartsfinal:</td>
                <td>15p</td>
                <td>15p</td>
                <td>25p</td>
              </tr>
              <tr>
                <td className="font-semibold">Semifinal:</td>
                <td>20p</td>
                <td>20p</td>
                <td>30p</td>
              </tr>
              <tr>
                <td className="font-semibold">Bronsmatch:</td>
                <td>20p</td>
                <td>20p</td>
                <td>30p</td>
              </tr>
              <tr>
                <td className="font-semibold">Final:</td>
                <td>25p</td>
                <td>25p</td>
                <td>35p</td>
              </tr>
            </tbody>
          </table>
          <div className="flex space-x-3 sm:flex-col sm:justify-end sm:space-x-0">
            <div>
              <span className="font-bold">RR</span> = Rätt resultat
            </div>
            <div>
              <span className="font-bold">RS/O</span> = Rätt 1/X/2
            </div>
            <div>
              <span className="font-bold">RLV</span> = Rätt lag vidare
            </div>
          </div>
        </div>

        <div className="flex space-x-1">
          <span className="font-bold">Rätt skyttekung</span>
          <span>
            Antal mål gjorda av honom x10
            <button
              onClick={() => setShowGoalscorerRules(!showGoalscorerRules)}
              className="text-white ml-4 rounded-full bg-gray-200 px-2"
            >
              ?
            </button>
          </span>
        </div>
        {showGoalscorerRules && <GoldenBootInfo />}
      </Container>
    </div>
  );
}

const GoldenBootInfo = () => {
  return (
    <div>
      <span className="font-bold">
        {`  Skyttekung blir den spelare som vinner 'The Golden Boot' enl. följande
        kriterier (hämtade från FIFA:s regelbok):`}
      </span>
      <br />
      <span className="italic">
        The Golden Boot will be awarded to the player who scores the most goals
        in the final competition. If two or more players score the same number
        of goals, the number of assists (as determined by the members of the
        FIFA Technical Study Group) shall be decisive. If two or more players
        are still equal after taking into account the number of assists, the
        total minutes played in the tournament will be taken into account, with
        the player playing fewer minutes ranked first
      </span>
    </div>
  );
};

export default PointSystem;
