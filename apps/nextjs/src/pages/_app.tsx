// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { RecoilRoot } from "recoil";
import { trpc } from "../utils/trpc";
import Navbar from "../components/Navbar";

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <ClerkProvider {...pageProps}>
      <RecoilRoot>
        <Navbar />
        <Component {...pageProps} />
      </RecoilRoot>
    </ClerkProvider>
  );
};

export default trpc.withTRPC(MyApp);
