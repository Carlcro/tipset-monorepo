/** @type {import("next-i18next").UserConfig} */
const config = {
  i18n: {
    locales: ["en", "sv"],
    defaultLocale: "en",
  },
  localePath: path.resolve("./public/locales"),
};
export default config;
