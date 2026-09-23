import type { Metadata } from "next";
import { BlogForm } from "@/components/admin/blogs/BlogForm";

export const metadata: Metadata = { title: "New post" };

export default function NewBlogPage() {
  return <BlogForm />;
}
