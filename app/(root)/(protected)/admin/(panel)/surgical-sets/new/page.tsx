import type { Metadata } from "next";
import { SurgicalSetForm } from "@/components/admin/surgical-sets/SurgicalSetForm";

export const metadata: Metadata = { title: "New surgical set" };

export default function NewSurgicalSetPage() {
  return <SurgicalSetForm />;
}
