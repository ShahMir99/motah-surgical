import type { Metadata } from "next";
import Footer from "@/components/site/Footer";
import Header from "@/components/site/Header";
import { AdminBar } from "@/components/admin/AdminBar";
import { getProductMenu } from "@/lib/apis/product-queries";

export const metadata: Metadata = {
  title: "Motah Surgical — Precision Surgical Instrumentation, Saudi Arabia",
  description:
    "Certified, locally finished surgical instrumentation for hospitals and healthcare networks across Saudi Arabia. SFDA licensed, ISO 13485:2016, LCGPA certified.",
};

// The product menu comes from the database. Admin changes refresh it right
// away (see revalidateProductPages); this is a fallback refresh interval.
export const revalidate = 60;

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const products = await getProductMenu();

  return (
    <>
      <AdminBar />
      <Header products={products} />
      <main className="site-content">{children}</main>
      <Footer />
    </>
  );
}
