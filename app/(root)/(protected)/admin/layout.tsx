import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import "./admin.css";


export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Motah Surgical Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`admin-root`}>
      {children}
      <Toaster position="bottom-right" richColors closeButton toastOptions={{ style: { fontFamily: "var(--font-admin-sans)" } }} />
    </div>
  );
}
