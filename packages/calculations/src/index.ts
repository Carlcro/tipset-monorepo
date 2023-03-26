import {
  calculateFinal,
  calculateGroupOf16,
  calculateGroupOf8,
  calculateSemiFinals,
  calculateTeamRanking,
} from "./matchGroup/World/calculations";
import {
  getBestOfThirds,
  calculateTopFourThirdPlaces,
} from "./matchGroup/Euro/thirdPlacements";
import {
  calculateGroupOf16Results,
  calculateGroupOf8Results,
  calculateGroupResults,
  calculateSemiFinalsResults,
  calculateSemiFinalsLosers,
} from "./results/World/results";
import {
  calculatePoints,
  calculatePointsFromGroup,
  getMatchPoint,
  calculateCorrectAdvanceTeam,
} from "./points/World/pointCalculation";

const hej = () => {
  console.log("hejhejhej");
};

export {
  calculateGroupOf16,
  calculateFinal,
  calculateGroupOf8,
  calculateSemiFinals,
  calculateTeamRanking,
  getBestOfThirds,
  calculateTopFourThirdPlaces,
  calculateGroupOf16Results,
  calculateGroupOf8Results,
  calculateGroupResults,
  calculateSemiFinalsResults,
  calculatePoints,
  calculatePointsFromGroup,
  getMatchPoint,
  calculateCorrectAdvanceTeam,
  calculateSemiFinalsLosers,
  hej,
};
