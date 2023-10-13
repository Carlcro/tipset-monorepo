// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { RecoilRoot } from "recoil";
import { trpc } from "../utils/trpc";
import Navbar from "../components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { appWithTranslation, useTranslation } from "next-i18next";
import nextI18nConfig from "../../next-i18next.config.mjs";

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <ClerkProvider {...pageProps}>
      <RecoilRoot>
        <Navbar />
        <Component {...pageProps} />
        <ToastContainer />
      </RecoilRoot>
    </ClerkProvider>
  );
};

const I18nApp = appWithTranslation(MyApp, nextI18nConfig);
const TRPCApp = trpc.withTRPC(I18nApp);

export default TRPCApp;
