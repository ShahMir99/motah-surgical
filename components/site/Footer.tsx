"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import logo from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-8 md:grid-cols-4">
        <div className="md:col-span-1">
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-2xl font-extrabold tracking-tigh"
          >
            <Image src={logo} alt="NSCC Logo" width={310} height={310} />
          </Link>
          <h4 className="mt-6 text-sm font-semibold uppercase tracking-widest text-secondary">
            Stay Tuned With Us
          </h4>
          <p className="mt-3 text-sm text-primary-foreground/70">
            At NSCC (National Service & Contracting Company), we bring your
            architectural dreams to life. A leading general contracting company
            in Egypt and Saudi Arabia.
          </p>
        </div>

        <div className="pt-10">
          <h4 className="text-sm font-semibold uppercase tracking-widest text-secondary">
            Quick Links
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            <li>
              <Link href="/about" className="hover:text-secondary">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/projects" className="hover:text-secondary">
                Our Projects
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-secondary">
                Services
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-secondary">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-secondary">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        <div className="pt-10">
          <h4 className="text-sm font-semibold uppercase tracking-widest text-secondary">
            Services
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            <li>
              <Link href="/services/construction" className="hover:text-secondary">
                Construction
              </Link>
            </li>
            <li>
              <Link
                href="/services/commercial-industrial"
                className="hover:text-secondary"
              >
                Commercial & Industrial
              </Link>
            </li>
            <li>
              <Link href="/services/residential" className="hover:text-secondary">
                Residential
              </Link>
            </li>
            <li>
              <Link
                href="/services/infrastructure"
                className="hover:text-secondary"
              >
                Infrastructure
              </Link>
            </li>
            <li>
              <Link
                href="/services/mep-contracting"
                className="hover:text-secondary"
              >
                MEP Contracting
              </Link>
            </li>
            <li>
              <Link
                href="/services/finishing-decoration"
                className="hover:text-secondary"
              >
                Finishing & Decoration
              </Link>
            </li>
          </ul>
        </div>

        <div className="pt-10">
          <h4 className="text-sm font-semibold uppercase tracking-widest text-secondary">
            Head Office
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/80">
            <li className="flex gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-secondary" />
              Egypt and Saudi Arabia, Madinah Munawwarah, King Khalid Road,
              Waqran District
            </li>
            <li className="flex gap-2">
              <Mail className="h-4 w-4 shrink-0 text-secondary" />{" "}
              info@nscc-group.com
            </li>
            <li className="flex gap-2">
              <Phone className="h-4 w-4 shrink-0 text-secondary" /> (+966) 54 108
              4450
            </li>
            <li className="flex gap-2">
              <Phone className="h-4 w-4 shrink-0 text-secondary" /> 013 821 1753
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto max-w-7xl px-6 py-5 text-center text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} NSCC General Contracting. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
