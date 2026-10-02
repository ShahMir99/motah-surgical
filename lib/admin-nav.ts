import { FileText, House, Info, Package, type LucideIcon } from "lucide-react";
import { ABOUT_PAGE_LABELS, ABOUT_SLUGS } from "@/types/about";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Sub-pages shown nested under this item. */
  children?: { label: string; href: string }[];
};

export const adminNav: AdminNavItem[] = [
  { label: "Home Page", href: "/admin/home", icon: House },
  {
    label: "About",
    href: "/admin/about",
    icon: Info,
    children: ABOUT_SLUGS.map((slug) => ({ label: ABOUT_PAGE_LABELS[slug], href: `/admin/about/${slug}` })),
  },
  { label: "Blogs", href: "/admin/blogs", icon: FileText },
  { label: "Products", href: "/admin/products", icon: Package },
];
