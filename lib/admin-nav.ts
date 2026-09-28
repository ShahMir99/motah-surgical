import { FileText, Package, type LucideIcon } from "lucide-react";

export type AdminNavItem = { label: string; href: string; icon: LucideIcon };

export const adminNav: AdminNavItem[] = [
  { label: "Blogs", href: "/admin/blogs", icon: FileText },
  { label: "Products", href: "/admin/products", icon: Package },
];
