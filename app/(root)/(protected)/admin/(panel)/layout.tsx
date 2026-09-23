import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { getCurrentAdmin } from "@/lib/apis/auth";

export default async function PanelLayout({ children }: { children: ReactNode }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/login");

  return <AdminShell admin={{ name: admin.name, email: admin.email }}>{children}</AdminShell>;
}
