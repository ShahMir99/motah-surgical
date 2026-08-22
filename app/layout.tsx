import "./globals.css";
import type { Metadata } from "next";
import { Inter, Saira } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";

const saira = Saira({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"]
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
export const metadata: Metadata = {
  title: "Motah Surgical — Leading General Contracting Company in Egypt and Saudi Arabia",
  description:
    "From iconic commercial buildings to turnkey residential developments, Motah Surgical delivers construction, MEP and engineering excellence across Egypt and Saudi Arabia.",
  openGraph: {
    title: "Motah Surgical — General Contracting in Egypt and Saudi Arabia",
    description: "Building landmarks, shaping Egypt and Saudi Arabia's future.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${saira.className} h-full antialiased`}>
      <body cz-shortcut-listen="true" className="min-h-full flex flex-col">
        <TooltipProvider>
          <Header />
          {children}
          <Footer />
        </TooltipProvider>
      </body>
    </html>
  );
}
