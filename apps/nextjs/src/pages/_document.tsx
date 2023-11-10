import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html className="bg-frost2 ">
      <Head>
        <link
          rel="manifest"
          href="https://progressier.app/L7xB2G3V3NFfpbLbC2al/progressier.json"
        />
        <script
          defer
          src="https://progressier.app/L7xB2G3V3NFfpbLbC2al/script.js"
        ></script>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </Head>
      <body className="bg-frost2 text-polarNight">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
