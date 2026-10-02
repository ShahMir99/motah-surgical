import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = { title: "Home Page" };

export default function HomeAdminLayout({ children }: { children: ReactNode }) {
  return children;
}
