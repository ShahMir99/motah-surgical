"use client";

import { useEffect, useState } from "react";

const iconClass = "h-[18px] w-[18px]";

const icons = {
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass} aria-hidden>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.83v1.5h.05c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.66 4.8 6.13v5.93h-4v-5.26c0-1.25-.02-2.87-1.75-2.87-1.75 0-2.02 1.37-2.02 2.78v5.35h-4v-11Z" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass} aria-hidden>
      <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.98L2 22l5.17-1.5A9.93 9.93 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.2-1.16l-.3-.18-3.07.9.92-2.99-.2-.31a8.18 8.18 0 1 1 6.85 3.74Zm4.5-6.13c-.25-.12-1.46-.72-1.69-.8-.22-.08-.39-.12-.55.13-.17.24-.64.8-.78.96-.14.17-.29.19-.54.06a6.7 6.7 0 0 1-3.32-2.9c-.25-.43.25-.4.72-1.33.08-.16.04-.3-.02-.43l-.76-1.83c-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 0 0-.65.3 2.74 2.74 0 0 0-.86 2.04c0 1.2.88 2.37 1 2.53.12.17 1.73 2.64 4.2 3.7 1.56.67 2.17.73 2.95.62.48-.07 1.46-.6 1.67-1.18.2-.58.2-1.08.14-1.18-.06-.1-.22-.17-.47-.29Z" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass} aria-hidden>
      <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.78L17.75 3Zm-1.08 16.2h1.7L7.4 4.73H5.58L16.67 19.2Z" />
    </svg>
  ),
  link: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconClass} aria-hidden>
      <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5" />
      <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5" />
    </svg>
  ),
};

const buttonClass =
  "inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#D6E9E2] text-[#4A5560] transition-colors hover:border-[#18B27F] hover:bg-[#18B27F] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18B27F]";

export default function ShareButtons({ title }: { title: string }) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => setUrl(window.location.href), []);

  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);

  const links = [
    { name: "LinkedIn", icon: icons.linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { name: "WhatsApp", icon: icons.whatsapp, href: `https://wa.me/?text=${t}%20${u}` },
    { name: "X", icon: icons.x, href: `https://x.com/intent/post?url=${u}&text=${t}` },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked (e.g. non-https); nothing else to do
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="mr-1 text-[15px] font-semibold text-[#1E2A33]">Share this article</span>
      {links.map((l) => (
        <a
          key={l.name}
          href={url ? l.href : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${l.name}`}
          className={buttonClass}
        >
          {l.icon}
        </a>
      ))}
      <button type="button" onClick={copyLink} aria-label="Copy link" className={buttonClass}>
        {icons.link}
      </button>
      <span role="status" className="text-[14px] text-[#18B27F]">
        {copied ? "Link copied" : ""}
      </span>
    </div>
  );
}