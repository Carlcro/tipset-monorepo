// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppType } from "next/app";
import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { RecoilRoot } from "recoil";
import { trpc } from "../utils/trpc";
import Navbar from "../components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { appWithTranslation } from "next-i18next";
import nextI18nConfig from "../../next-i18next.config.mjs";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <ClerkProvider {...pageProps}>
      <RecoilRoot>
        <Theme>
          <SignedIn>
            <Navbar />
            <Component {...pageProps} />
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
          <ToastContainer />
        </Theme>
      </RecoilRoot>
    </ClerkProvider>
  );
};

const I18nApp = appWithTranslation(MyApp, nextI18nConfig);
const TRPCApp = trpc.withTRPC(I18nApp);

export default TRPCApp;
