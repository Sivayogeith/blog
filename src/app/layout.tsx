import type { Metadata } from "next";
import { Saira } from "next/font/google";
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
    <html lang="en" className={`${saira.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
