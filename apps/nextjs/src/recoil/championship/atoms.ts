import { atom } from "recoil";

export const championshipState = atom({
  key: "currentChampionship",
  default: null as any,
});
