import Path from "path";

/** @type {import("next-i18next").UserConfig} */
const config = {
  i18n: {
    locales: ["en", "sv"],
    defaultLocale: "en",
  },
  localePath: Path.resolve("./public/locales"),
};
export default config;
