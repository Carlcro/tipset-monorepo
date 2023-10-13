import type { Namespace } from "i18next";
import type { SSRConfig, UserConfig } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import i18n from "../../next-i18next.config.mjs"; // <- mjs

type ArrayElementOrSelf<T> = T extends Array<infer U> ? U[] : T[];

export const getServerTranslations = async (
  locale: string,
  namespacesRequired?: any,
  configOverride?: UserConfig,
  extraLocales?: string[] | false,
): Promise<SSRConfig> => {
  const config = configOverride ?? i18n;
  return serverSideTranslations(
    locale,
    namespacesRequired,
    config,
    extraLocales,
  );
};
