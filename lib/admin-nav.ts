import { FileText, type LucideIcon } from "lucide-react";

export type AdminNavItem = { label: string; href: string; icon: LucideIcon };

export const adminNav: AdminNavItem[] = [{ label: "Blogs", href: "/admin/blogs", icon: FileText }];
