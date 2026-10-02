import { redirect } from "next/navigation";
import { ABOUT_SLUGS } from "@/types/about";

export default function AboutIndex() {
  redirect(`/admin/about/${ABOUT_SLUGS[0]}`);
}
