import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = { title: "Products" };

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return children;
}
