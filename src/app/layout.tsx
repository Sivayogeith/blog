import type { Metadata } from "next";
import { Saira } from "next/font/google";
import { ThemeProvider } from "@teispace/next-themes";
import NextTopLoader from 'nextjs-toploader';
import "./globals.css";

import Navbar from "@/src/components/Navbar";

const saira = Saira({
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sage's Blog",
  description: "Blog of Sage",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${saira.className} h-full antialiased`} suppressHydrationWarning >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="data-theme">
          <NextTopLoader showSpinner={false} color={'#62229d'}/>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
