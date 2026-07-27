import type { Metadata } from "next";
import { Saira } from "next/font/google";
import { ThemeProvider } from "@teispace/next-themes";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

import Navbar from "@/src/components/Navbar";
import { getTheme } from "@teispace/next-themes/server";
import Toaster  from "../components/Toaster";
import { cookies } from "next/headers";

const saira = Saira({
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sage's Blog",
  description: "Blog of Sage",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialTheme = await getTheme() as ("light" | "dark");
  const cookieStore = await cookies()
  const toastCookie = cookieStore.get("toast")?.value

  return (
    <html
      lang="en"
      className={`${saira.className} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="data-theme"
          initialTheme={initialTheme ?? undefined}
          transition="fade"
          themes={["light", "dark"]}
        >
          <NextTopLoader showSpinner={false} color={"#62229d"} />
          <Navbar />
          {children}
          <Toaster toastCookie={toastCookie}/>
        </ThemeProvider>
      </body>
    </html>
  );
}
