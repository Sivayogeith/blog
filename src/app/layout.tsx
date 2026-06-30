import type { Metadata } from "next";
import { Saira } from "next/font/google";
import "./globals.css";
import Navbar from "@/src/components/Navbar";
import { ThemeProvider } from "@teispace/next-themes";

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
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
