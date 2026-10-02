"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalLink, FileText, Plus, Upload, X } from "lucide-react";
import type {
  AboutFile,
  AboutHero,
  AboutImage,
  ComplianceContent,
  CompanyIntroContent,
  DownloadsContent,
  FaqsContent,
  MissionVisionContent,
  TextBlock,
} from "@/types/about";
import { uploadCatalog } from "@/lib/apis/admin-api";
import { ACCEPTED_CATALOG_TYPES, MAX_CATALOG_MB } from "@/lib/apis/upload-config";
import { Button, Field } from "@/components/admin/ui";
import { RichTextEditor } from "@/components/admin/blogs/RichTextEditor";
import { CoverImageField } from "@/components/admin/blogs/CoverImageField";
import { BOLD_HINT, LINK_HINT, Section, TextField, TextListField } from "@/components/admin/content-parts";

type Editor<T> = { form: T; onChange: (next: T) => void };

function ImageField({
  id,
  noun,
  hint,
  value,
  onChange,
}: {
  id: string;
  noun: string;
  hint: string;
  value: AboutImage | null;
  onChange: (v: AboutImage | null) => void;
}) {
  return (
    <Field label="Image" hint="Leave empty to keep the original image.">
      <CoverImageField id={id} noun={noun} hint={hint} value={value} onChange={onChange} />
    </Field>
  );
}

function HeroSection({ value, onChange }: { value: AboutHero; onChange: (v: AboutHero) => void }) {
  const set = (patch: Partial<AboutHero>) => onChange({ ...value, ...patch });
  return (
    <Section title="Banner" description="The green box at the top of the page.">
      <TextField id="hero-eyebrow" label="Small label" value={value.eyebrow} max={80} onChange={(v) => set({ eyebrow: v })} />
      <TextField id="hero-title" label="Title" value={value.title} max={120} onChange={(v) => set({ title: v })} />
      <TextField
        id="hero-subtitle"
        label="Subtitle"
        multiline
        rows={2}
        value={value.subtitle}
        max={200}
        hint="A new line breaks the subtitle into two lines."
        onChange={(v) => set({ subtitle: v })}
      />
    </Section>
  );
}

function BlockSection({
  title,
  description,
  idPrefix,
  hint,
  value,
  onChange,
}: {
  title: string;
  description: string;
  idPrefix: string;
  hint: string;
  value: TextBlock;
  onChange: (v: TextBlock) => void;
}) {
  const set = (patch: Partial<TextBlock>) => onChange({ ...value, ...patch });
  return (
    <Section title={title} description={description}>
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-5">
          <TextField id={`${idPrefix}-heading`} label="Heading" value={value.heading} max={100} onChange={(v) => set({ heading: v })} />
          <TextField id={`${idPrefix}-text`} label="Text" multiline value={value.text} max={800} onChange={(v) => set({ text: v })} />
        </div>
        <ImageField id={`${idPrefix}-image`} noun="image" hint={hint} value={value.image} onChange={(image) => set({ image })} />
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------------- Company introduction */

export function CompanyIntroFields({ form, onChange }: Editor<CompanyIntroContent>) {
  const set = (patch: Partial<CompanyIntroContent>) => onChange({ ...form, ...patch });
  return (
    <>
      <HeroSection value={form.hero} onChange={(hero) => set({ hero })} />

      <Section title="Feature image" description="The wide picture above the letter.">
        <div className="max-w-sm">
          <ImageField id="intro-image" noun="feature image" hint="Wide images (1200×420) work best." value={form.image} onChange={(image) => set({ image })} />
        </div>
      </Section>

      <Section title="Letter" description="The letter from the company.">
        <TextField id="intro-greeting" label="Greeting" value={form.greeting} max={120} onChange={(v) => set({ greeting: v })} />
        <Field label="Letter text" hint="Write and format the letter here. Alignment is justified unless you change it.">
          <RichTextEditor value={form.letter} onChange={(letter) => set({ letter })} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField id="intro-signoff" label="Closing line" value={form.signoff} max={60} onChange={(v) => set({ signoff: v })} />
          <TextField id="intro-signature" label="Signature" value={form.signature} max={80} onChange={(v) => set({ signature: v })} />
        </div>
      </Section>
    </>
  );
}

/* ---------------------------------------------------------------- Mission & vision */

export function MissionVisionFields({ form, onChange }: Editor<MissionVisionContent>) {
  const set = (patch: Partial<MissionVisionContent>) => onChange({ ...form, ...patch });
  const setItem = (i: number, patch: Partial<MissionVisionContent["achievements"]["items"][number]>) =>
    set({
      achievements: {
        ...form.achievements,
        items: form.achievements.items.map((it, j) => (j === i ? { ...it, ...patch } : it)),
      },
    });

  return (
    <>
      <HeroSection value={form.hero} onChange={(hero) => set({ hero })} />

      <Section title="Introduction" description="The centred text under the banner.">
        <TextField id="mv-eyebrow" label="Small label" value={form.intro.eyebrow} max={80} onChange={(v) => set({ intro: { ...form.intro, eyebrow: v } })} />
        <TextField id="mv-heading" label="Heading" value={form.intro.heading} max={120} onChange={(v) => set({ intro: { ...form.intro, heading: v } })} />
        <TextField id="mv-text" label="Text" multiline rows={2} value={form.intro.text} max={300} onChange={(v) => set({ intro: { ...form.intro, text: v } })} />
      </Section>

      <BlockSection
        title="First block"
        description="White background, picture on the left."
        idPrefix="mv-one"
        hint="Wide images (1200×760) work best."
        value={form.blockOne}
        onChange={(blockOne) => set({ blockOne })}
      />
      <BlockSection
        title="Second block"
        description="Grey background, picture on the right."
        idPrefix="mv-two"
        hint="Wide images (1200×840) work best."
        value={form.blockTwo}
        onChange={(blockTwo) => set({ blockTwo })}
      />

      <Section title="Global reach" description="The dark section with a background picture.">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-5">
            <TextField id="mv-global-heading" label="Heading" value={form.global.heading} max={120} onChange={(v) => set({ global: { ...form.global, heading: v } })} />
            <TextListField
              idPrefix="mv-global-p"
              label="Paragraph"
              items={form.global.paragraphs}
              max={1500}
              maxItems={6}
              multiline
              hint={BOLD_HINT}
              addLabel="Add paragraph"
              onChange={(paragraphs) => set({ global: { ...form.global, paragraphs } })}
            />
          </div>
          <ImageField
            id="mv-global-image"
            noun="background image"
            hint="1920×800 works best."
            value={form.global.image}
            onChange={(image) => set({ global: { ...form.global, image } })}
          />
        </div>
      </Section>

      <Section title="How we achieve our mission" description="The numbered list. Numbers are added automatically.">
        <TextField id="mv-ach-heading" label="Heading" value={form.achievements.heading} max={120} onChange={(v) => set({ achievements: { ...form.achievements, heading: v } })} />
        <div className="space-y-4">
          {form.achievements.items.map((item, i) => (
            <div key={i} className="space-y-4 rounded-md border border-[#E6ECEA] p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#10261F]">Item {i + 1}</p>
                <Button
                  size="sm"
                  variant="ghost"
                  aria-label={`Remove item ${i + 1}`}
                  onClick={() => set({ achievements: { ...form.achievements, items: form.achievements.items.filter((_, j) => j !== i) } })}
                >
                  <X /> Remove
                </Button>
              </div>
              <TextField id={`mv-item-t-${i}`} label="Title" value={item.title} max={120} onChange={(v) => setItem(i, { title: v })} />
              <TextField id={`mv-item-d-${i}`} label="Description" multiline rows={3} value={item.description} max={500} onChange={(v) => setItem(i, { description: v })} />
            </div>
          ))}
          {form.achievements.items.length < 12 && (
            <Button
              size="sm"
              onClick={() =>
                set({
                  achievements: {
                    ...form.achievements,
                    items: [...form.achievements.items, { title: "", description: "" }],
                  },
                })
              }
            >
              <Plus /> Add item
            </Button>
          )}
        </div>
        <TextField id="mv-closing" label="Closing paragraph" multiline value={form.achievements.closing} max={800} onChange={(v) => set({ achievements: { ...form.achievements, closing: v } })} />
      </Section>
    </>
  );
}

/* ---------------------------------------------------------------- Compliance */

export function ComplianceFields({ form, onChange }: Editor<ComplianceContent>) {
  const set = (patch: Partial<ComplianceContent>) => onChange({ ...form, ...patch });
  const setCred = (i: number, patch: Partial<ComplianceContent["credentials"][number]>) =>
    set({ credentials: form.credentials.map((c, j) => (j === i ? { ...c, ...patch } : c)) });

  return (
    <>
      <HeroSection value={form.hero} onChange={(hero) => set({ hero })} />

      <Section title="Text">
        <TextField id="comp-lead" label="Highlighted sentence" multiline rows={2} value={form.lead} max={400} onChange={(v) => set({ lead: v })} />
        <TextField id="comp-body" label="Paragraph" multiline value={form.body} max={1500} hint={BOLD_HINT} onChange={(v) => set({ body: v })} />
      </Section>

      <Section
        title="Licences and certificates"
        description="The images shown at the bottom. An empty image keeps the original certificate in that position."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {form.credentials.map((c, i) => (
            <div key={i} className="space-y-4 rounded-md border border-[#E6ECEA] p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#10261F]">Certificate {i + 1}</p>
                <Button
                  size="sm"
                  variant="ghost"
                  aria-label={`Remove certificate ${i + 1}`}
                  onClick={() => set({ credentials: form.credentials.filter((_, j) => j !== i) })}
                >
                  <X /> Remove
                </Button>
              </div>
              <CoverImageField id={`comp-image-${i}`} noun="certificate image" hint="A portrait or landscape scan works." value={c.image} onChange={(image) => setCred(i, { image })} />
              <TextField id={`comp-label-${i}`} label="Name" value={c.label} max={120} onChange={(v) => setCred(i, { label: v })} />
            </div>
          ))}
        </div>
        {form.credentials.length < 12 && (
          <Button size="sm" onClick={() => set({ credentials: [...form.credentials, { label: "", image: null }] })}>
            <Plus /> Add certificate
          </Button>
        )}
      </Section>
    </>
  );
}

/* ---------------------------------------------------------------- Downloads */

function PdfField({ value, onChange }: { value: AboutFile | null; onChange: (v: AboutFile | null) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const uploading = progress !== null;

  async function handleFile(file?: File | null) {
    if (!file || uploading) return;
    setProgress(0);
    try {
      const { url, key } = await uploadCatalog(file, setProgress);
      onChange({ url, key, fileName: file.name, size: file.size });
      toast.success("PDF uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "The PDF couldn't be uploaded.");
    } finally {
      setProgress(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_CATALOG_TYPES.join(",")}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {value ? (
        <div className="flex items-center gap-3 rounded-md border border-[#E6ECEA] bg-[#F6F8F7] p-3">
          <FileText className="h-5 w-5 shrink-0 text-[#B42318]" aria-hidden />
          <p className="min-w-0 flex-1 truncate text-sm font-medium text-[#10261F]" title={value.fileName}>
            {uploading ? `Uploading ${progress}%` : value.fileName}
          </p>
          <a
            href={value.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open PDF in a new tab"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-[#5E716B] hover:bg-[#E9EFED] hover:text-[#10261F]"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
          </a>
          <Button size="sm" onClick={() => inputRef.current?.click()} disabled={uploading}>
            Replace
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onChange(null)} disabled={uploading}>
            Remove
          </Button>
        </div>
      ) : (
        <Button size="sm" onClick={() => inputRef.current?.click()} loading={uploading}>
          <Upload /> {uploading ? `Uploading ${progress}%` : "Upload PDF"}
        </Button>
      )}
      <p className="mt-1.5 text-xs text-[#5E716B]">PDF up to {MAX_CATALOG_MB} MB. An uploaded file is used instead of the link above.</p>
    </div>
  );
}

export function DownloadsFields({ form, onChange }: Editor<DownloadsContent>) {
  const set = (patch: Partial<DownloadsContent>) => onChange({ ...form, ...patch });
  const setRes = (i: number, patch: Partial<DownloadsContent["resources"][number]>) =>
    set({ resources: form.resources.map((r, j) => (j === i ? { ...r, ...patch } : r)) });

  return (
    <>
      <HeroSection value={form.hero} onChange={(hero) => set({ hero })} />

      <Section title="Resource list">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField id="dl-heading" label="Heading" value={form.heading} max={120} onChange={(v) => set({ heading: v })} />
          <TextField id="dl-link" label="Link text" value={form.linkLabel} max={40} onChange={(v) => set({ linkLabel: v })} />
        </div>
        <div className="space-y-4">
          {form.resources.map((r, i) => (
            <div key={i} className="space-y-4 rounded-md border border-[#E6ECEA] p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#10261F]">Resource {i + 1}</p>
                <Button
                  size="sm"
                  variant="ghost"
                  aria-label={`Remove resource ${i + 1}`}
                  onClick={() => set({ resources: form.resources.filter((_, j) => j !== i) })}
                >
                  <X /> Remove
                </Button>
              </div>
              <TextField id={`dl-title-${i}`} label="Title" value={r.title} max={140} onChange={(v) => setRes(i, { title: v })} />
              <TextField id={`dl-href-${i}`} label="Link" hint={LINK_HINT} value={r.href} max={300} onChange={(v) => setRes(i, { href: v })} />
              <PdfField value={r.file} onChange={(file) => setRes(i, { file })} />
            </div>
          ))}
          {form.resources.length < 40 && (
            <Button size="sm" onClick={() => set({ resources: [...form.resources, { title: "", href: "", file: null }] })}>
              <Plus /> Add resource
            </Button>
          )}
        </div>
      </Section>
    </>
  );
}

/* ---------------------------------------------------------------- FAQs */

export function FaqsFields({ form, onChange }: Editor<FaqsContent>) {
  const set = (patch: Partial<FaqsContent>) => onChange({ ...form, ...patch });
  const setItem = (i: number, patch: Partial<FaqsContent["items"][number]>) =>
    set({ items: form.items.map((it, j) => (j === i ? { ...it, ...patch } : it)) });

  return (
    <>
      <HeroSection value={form.hero} onChange={(hero) => set({ hero })} />

      <Section title="Questions" description="The first question is open when the page loads.">
        <div className="space-y-4">
          {form.items.map((item, i) => (
            <div key={i} className="space-y-4 rounded-md border border-[#E6ECEA] p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#10261F]">Question {i + 1}</p>
                <Button
                  size="sm"
                  variant="ghost"
                  aria-label={`Remove question ${i + 1}`}
                  onClick={() => set({ items: form.items.filter((_, j) => j !== i) })}
                >
                  <X /> Remove
                </Button>
              </div>
              <TextField id={`faq-q-${i}`} label="Question" value={item.question} max={240} onChange={(v) => setItem(i, { question: v })} />
              <TextField id={`faq-a-${i}`} label="Answer" multiline rows={3} value={item.answer} max={1500} onChange={(v) => setItem(i, { answer: v })} />
            </div>
          ))}
          {form.items.length < 60 && (
            <Button size="sm" onClick={() => set({ items: [...form.items, { question: "", answer: "" }] })}>
              <Plus /> Add question
            </Button>
          )}
        </div>
      </Section>
    </>
  );
}
