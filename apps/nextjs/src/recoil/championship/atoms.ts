import { RouterOutputs } from "./../../utils/trpc";
import { atom } from "recoil";

export const championshipState = atom({
  key: "currentChampionship",
  default: null as RouterOutputs["championship"]["getOneChampionship"],
});
