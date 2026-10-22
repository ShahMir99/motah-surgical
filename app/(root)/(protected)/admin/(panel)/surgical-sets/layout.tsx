import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = { title: "Surgical sets" };

export default function SurgicalSetsLayout({ children }: { children: ReactNode }) {
  return children;
}
