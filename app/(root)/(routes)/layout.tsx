import type { Metadata } from "next";
import Footer from "@/components/site/Footer";
import Header from "@/components/site/Header";
import { AdminBar } from "@/components/admin/AdminBar";

export const metadata: Metadata = {
  title: "Motah Surgical — Precision Surgical Instrumentation, Saudi Arabia",
  description:
    "Certified, locally finished surgical instrumentation for hospitals and healthcare networks across Saudi Arabia. SFDA licensed, ISO 13485:2016, LCGPA certified.",
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminBar />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
