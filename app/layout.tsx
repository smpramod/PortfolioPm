import type { Metadata } from "next";
import Script from "next/script";
import { Instrument_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { ExtensionErrorGuard } from "@/components/shared/ExtensionErrorGuard";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-code",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Abhishek Farande — Software Developer",
  description:
    "Software Developer at Seratek Systems building multi-tenant College ERP modules with Next.js, NestJS, and MongoDB.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased" suppressHydrationWarning>
        <Script id="theme-init" strategy="beforeInteractive">
          {`try{if(localStorage.getItem("theme")==="light")document.documentElement.setAttribute("data-theme","light")}catch(e){}`}
        </Script>
        <ExtensionErrorGuard />
        {children}
      </body>
    </html>
  );
}
