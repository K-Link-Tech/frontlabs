import "@/styles/globals.css";
import { IconoirProvider } from "iconoir-react";
import type { AppProps } from "next/app";
import { Space_Mono } from "next/font/google";

const spaceMono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <IconoirProvider
      iconProps={{
        strokeWidth: 2,
        width: "1.5em",
        height: "1.5em",
      }}
    >
      <div className={spaceMono.className}>
        <Component {...pageProps} />
      </div>
    </IconoirProvider>
  );
}
