import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html className="bg-frost2 ">
      <Head>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </Head>
      <body className="text-polarNight">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
