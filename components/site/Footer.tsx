import Link from "next/link";
import logo from "@/assets/logo.png"
import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-accent-foreground">
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4 lg:py-20">
        <div>
         <Link href="/" className="group flex items-center gap-3">
          <Image src={logo} alt="logo" width={300} height={300} />
        </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-accent-foreground/65">
            Precision surgical instruments engineered in Sialkot and trusted by clinicians in more
            than 50 countries.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Company</h3>
          <ul className="mt-5 space-y-3 text-sm text-accent-foreground/70">
            {[
              { to: "/about", label: "About us" },
              { to: "/products", label: "Products" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <li key={l.to}>
                <Link href={l.to} className="transition-colors hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Specialties</h3>
          <ul className="mt-5 space-y-3 text-sm text-accent-foreground/70">
            {["General surgery", "Cardiovascular", "Dental", "Microsurgery"].map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Get in touch</h3>
          <ul className="mt-5 space-y-4 text-sm text-accent-foreground/70">
            <li className="flex items-start gap-3">
              <Phone size={16} className="mt-0.5 shrink-0 text-primary" />
              <a href="tel:+923248610315" className="transition-colors hover:text-primary">
                +92 324 8610315
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Mail size={16} className="mt-0.5 shrink-0 text-primary" />
              <a href="mailto:sales@phfworld.com" className="transition-colors hover:text-primary">
                sales@phfworld.com
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-primary" />
              19-A(N), Industrial Estate, Sialkot 51310, Pakistan
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-accent-foreground/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-accent-foreground/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Professional Hospital Furnishers. All rights reserved.</p>
          <p>ISO 13485 · CE Marked · EU-MDR compliant</p>
        </div>
      </div>
    </footer>
  );
}
