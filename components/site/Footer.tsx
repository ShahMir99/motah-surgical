import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { Phone, Mail, MapPin, ChevronRight, Check } from "lucide-react";

type IconProps = { size?: number; className?: string };

const FacebookIcon = ({ size = 17, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z" />
  </svg>
);

const LinkedinIcon = ({ size = 17, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm6 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.6c0-1.34-.03-3.07-1.9-3.07-1.9 0-2.2 1.46-2.2 2.97V21H9V9z" />
  </svg>
);

const InstagramIcon = ({ size = 17, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const MailIcon = ({ size = 17, className }: IconProps) => (
  <Mail size={size} className={className} />
);

const siteLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/products", label: "Product Categories" },
  { to: "/news", label: "News" },
  { to: "/downloads", label: "Downloads" },
  { to: "/faq", label: "FAQ" },
];

const legalLinks = [
  { to: "/privacy-policy", label: "Privacy Policy" },
  { to: "/terms", label: "Terms & Conditions" },
];

const socials = [
  { href: "https://facebook.com", label: "Facebook", Icon: FacebookIcon },
  { href: "https://linkedin.com", label: "LinkedIn", Icon: LinkedinIcon },
  { href: "https://instagram.com", label: "Instagram", Icon: InstagramIcon },
  { href: "mailto:sales@phfworld.com", label: "Email", Icon: MailIcon },
];

const inputClass =
  "w-full rounded-lg bg-white px-5 py-4 text-base text-primary-dark placeholder:text-neutral-400 outline-none ring-0 focus:ring-2 focus:ring-primary-dark/30";

export default function Footer() {
  return (
    <footer className="text-accent-foreground">
      {/* ---------- Contact section ---------- */}
      <section className="bg-primary py-16 lg:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: heading + contact details */}
          <div className="grid gap-10 sm:grid-cols-2 sm:items-start">
            <h2 className="text-4xl font-extrabold text-white sm:text-5xl">
              Contact Us
            </h2>

            <ul className="space-y-10 text-center text-white">
              <li>
                <Phone size={30} className="mx-auto" strokeWidth={1.75} />
                <a
                  href="tel:+966543000010"
                  className="mt-4 block text-lg transition-opacity hover:opacity-80"
                >
                  (+966) 54 300 0010
                </a>
              </li>
              <li>
                <Mail size={30} className="mx-auto" strokeWidth={1.75} />
                <a
                  href="mailto:sales@phfworld.com"
                  className="mt-4 block text-lg transition-opacity hover:opacity-80"
                >
                  info@motah-surgical.com
                </a>
              </li>
              <li>
                <MapPin size={30} className="mx-auto" strokeWidth={1.75} />
                <p className="mt-4 text-lg leading-relaxed">
                  Head Office
                  <br />
                  5208 Al Amir Bandar Ibn Abdul Aziz, Al Khalij, Riyadh 13224
                </p>
              </li>
            </ul>
          </div>

          {/* Right: form */}
          <form className="space-y-4">
            <input
              type="text"
              name="fullName"
              required
              placeholder="Full Name*"
              className={inputClass}
            />
            <input
              type="text"
              name="organization"
              placeholder="Organization/Hospital/ Institution"
              className={inputClass}
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              className={inputClass}
            />
            <input
              type="email"
              name="email"
              required
              placeholder="Business Email*"
              className={inputClass}
            />
            <input
              type="tel"
              name="phone"
              required
              placeholder="Phone Number*"
              className={inputClass}
            />
            <textarea
              name="message"
              rows={5}
              placeholder="Your Message"
              className={`${inputClass} resize-y`}
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-md bg-primary-dark px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90"
              >
                Submit
              </button>
            </div>

            <p className="text-sm leading-relaxed text-white/85">
              This site is protected by reCAPTCHA and the Google{" "}
              <a
                href="https://policies.google.com/privacy"
                className="font-bold hover:underline"
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="https://policies.google.com/terms"
                className="font-bold hover:underline"
              >
                Terms of Service
              </a>{" "}
              apply.
            </p>
          </form>
        </div>
      </section>

      {/* ---------- Main footer ---------- */}
      <div className="bg-primary-dark">
        <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:py-20">
          <div>
            <Link href="/" className="inline-block">
              <Image
                src={logo}
                alt="Professional Hospital Furnishers"
                width={300}
                height={100}
                className="h-auto w-60 lg:w-72"
              />
            </Link>
          </div>

          <nav>
            <ul className="space-y-3.5 text-base text-accent-foreground/85">
              {siteLinks.map((l) => (
                <li key={l.to} className="flex items-center gap-2">
                  <ChevronRight size={16} className="shrink-0 text-primary" />
                  <Link
                    href={l.to}
                    className="transition-colors hover:text-primary"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <ul className="space-y-3.5 text-base text-accent-foreground/85">
              {legalLinks.map((l) => (
                <li key={l.to} className="flex items-center gap-2">
                  <ChevronRight size={16} className="shrink-0 text-primary" />
                  <Link
                    href={l.to}
                    className="transition-colors hover:text-primary"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <ul className="mt-8 space-y-4 text-base font-semibold text-primary">
              <li className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 shrink-0" />
                <a href="tel:+923248610315" className="hover:underline">
                  (+966) 54 300 0010
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 shrink-0" />
                <a href="mailto:info@motah-surgical.com" className="hover:underline">
                  info@motah-surgical.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0" />
                <span className="leading-relaxed">
                  5208 Al Amir Bandar Ibn Abdul Aziz, Al Khalij, Riyadh 13224
                </span>
              </li>
            </ul>
          </div>

          <div className="lg:text-right">
            <a
              href="/company-profile.pdf"
              className="inline-block rounded-md bg-primary px-7 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90"
            >
              Company Profile
            </a>
          </div>
        </div>

        {/* ---------- Bottom bar ---------- */}
        <div className="border-t border-white/10">
          <div className="container-page flex flex-col gap-8 py-7 text-base text-accent-foreground/80 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
            <p>© Motah Surgical. Improving Lives!</p>

            <div className="flex items-center gap-3">
              <span>Follow us:</span>
              <ul className="flex items-center gap-2">
                {socials.map(({ href, label, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      aria-label={label}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-md border border-primary text-primary transition-colors hover:bg-primary hover:text-primary-dark"
                    >
                      <Icon size={17} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
              <p className="leading-tight">
                Subscribe
                <br className="hidden sm:block" />{" "}
                <span className="sm:hidden"> </span>to our Newsletter
              </p>

              <form className="relative w-full sm:w-72">
                <input
                  type="email"
                  name="newsletterEmail"
                  required
                  placeholder="Your Email Address"
                  className="w-full rounded-md bg-white py-3.5 pl-4 pr-12 text-base text-primary-dark placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-white transition-opacity hover:opacity-90"
                >
                  <Check size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
