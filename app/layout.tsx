import type { Metadata } from "next";
import Footer from "@/components/site/Footer";
import Header from "@/components/site/Header";
import { Poppins } from "next/font/google";

import "./globals.css";


const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: "Motah Surgical — Precision Surgical Instrumentation, Saudi Arabia",
  description:
    "Certified, locally finished surgical instrumentation for hospitals and healthcare networks across Saudi Arabia. SFDA licensed, ISO 13485:2016, LCGPA certified.",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body  cz-shortcut-listen="true" className={`${poppins.className} antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
