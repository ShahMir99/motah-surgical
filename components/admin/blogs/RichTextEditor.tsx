"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { Placeholder } from "@tiptap/extensions";
import { toast } from "sonner";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Minus,
  Pilcrow,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
} from "lucide-react";
import { uploadImage } from "@/lib/apis/admin-api";
import { ACCEPTED_IMAGE_TYPES } from "@/lib/apis/upload-config";
import { Button, inputClass } from "@/components/admin/ui";

type Props = { value: string; onChange: (html: string) => void };

const imageFiles = (list?: FileList | null) => Array.from(list ?? []).filter((f) => f.type.startsWith("image/"));

export function RichTextEditor({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const insertImagesRef = useRef<(files: File[]) => void>(() => {});

  const editor = useEditor({
    immediatelyRender: false, // required with Next.js SSR
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] }, // the post title is the page's H1
        code: false,
        codeBlock: false,
        link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
      }),
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Start writing. Paste or drop images anywhere." }),
    ],
    content: value,
    editorProps: {
      attributes: { class: "tiptap-content", "aria-label": "Post content" },
      handlePaste: (_view, event) => {
        const files = imageFiles(event.clipboardData?.files);
        if (!files.length) return false;
        event.preventDefault();
        insertImagesRef.current(files);
        return true;
      },
      handleDrop: (_view, event, _slice, moved) => {
        if (moved) return false;
        const files = imageFiles((event as DragEvent).dataTransfer?.files);
        if (!files.length) return false;
        event.preventDefault();
        insertImagesRef.current(files);
        return true;
      },
    },
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? "" : editor.getHTML()),
  });

  useEffect(() => {
    insertImagesRef.current = async (files: File[]) => {
      if (!editor || !files.length) return;
      setUploading(true);
      try {
        for (const file of files) {
          const { url } = await uploadImage(file);
          const alt = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
          editor.chain().focus().setImage({ src: url, alt }).run();
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "The image couldn't be uploaded.");
      } finally {
        setUploading(false);
      }
    };
  }, [editor]);

  const words =
    useEditorState({
      editor,
      selector: ({ editor: e }) => (e ? e.getText().trim().split(/\s+/).filter(Boolean).length : 0),
    }) ?? 0;

  return (
    <div>
      {editor ? (
        <Toolbar editor={editor} uploading={uploading} onPickImage={() => fileRef.current?.click()} />
      ) : (
        <div className="h-[46px] border-y border-[#E6ECEA] bg-[#FAFBFB]" />
      )}

      <div className="px-6 pb-12 pt-6 sm:px-12">
        <EditorContent editor={editor} />
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-[#E6ECEA] px-6 py-2.5 text-xs text-[#5E716B] sm:px-12">
        <span className="tabular-nums">
          {words.toLocaleString()} {words === 1 ? "word" : "words"}, about {Math.max(1, Math.round(words / 200))} min read
        </span>
        {uploading && (
          <span className="inline-flex items-center gap-1.5" aria-live="polite">
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
            Uploading image
          </span>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        multiple
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => {
          const files = imageFiles(e.target.files);
          e.target.value = "";
          insertImagesRef.current(files);
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Toolbar({ editor, uploading, onPickImage }: { editor: Editor; uploading: boolean; onPickImage: () => void }) {
  const [linkOpen, setLinkOpen] = useState(false);
  const [href, setHref] = useState("");
  const linkInputRef = useRef<HTMLInputElement>(null);
  const mod = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘" : "Ctrl+";

  // Tiptap v3 doesn't re-render on every keystroke, so subscribe to just what the toolbar shows.
  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => {
      const center = e.isActive({ textAlign: "center" });
      const right = e.isActive({ textAlign: "right" });
      return {
        paragraph: e.isActive("paragraph"),
        h2: e.isActive("heading", { level: 2 }),
        h3: e.isActive("heading", { level: 3 }),
        bold: e.isActive("bold"),
        italic: e.isActive("italic"),
        underline: e.isActive("underline"),
        strike: e.isActive("strike"),
        bulletList: e.isActive("bulletList"),
        orderedList: e.isActive("orderedList"),
        blockquote: e.isActive("blockquote"),
        link: e.isActive("link"),
        alignCenter: center,
        alignRight: right,
        alignLeft: !center && !right,
        canUndo: e.can().undo(),
        canRedo: e.can().redo(),
      };
    },
  });

  const chain = () => editor.chain().focus();

  function openLink() {
    setHref((editor.getAttributes("link").href as string | undefined) ?? "");
    setLinkOpen(true);
    requestAnimationFrame(() => linkInputRef.current?.select());
  }

  function applyLink() {
    const raw = href.trim();
    if (!raw) {
      chain().extendMarkRange("link").unsetLink().run();
    } else {
      const url = /^(https?:|mailto:|\/|#)/i.test(raw) ? raw : `https://${raw}`;
      if (editor.state.selection.empty && !editor.isActive("link")) {
        chain().insertContent({ type: "text", text: raw, marks: [{ type: "link", attrs: { href: url } }] }).run();
      } else {
        chain().extendMarkRange("link").setLink({ href: url }).run();
      }
    }
    setLinkOpen(false);
  }

  return (
    <div className="sticky top-[7.5rem] z-10 border-y border-[#E6ECEA] bg-[#FAFBFB]/95 backdrop-blur lg:top-16">
      <div role="toolbar" aria-label="Formatting" className="flex items-center gap-0.5 overflow-x-auto px-3 py-1.5 sm:flex-wrap sm:overflow-visible sm:px-6">
        <TB label="Paragraph" active={s.paragraph} onClick={() => chain().setParagraph().run()}>
          <Pilcrow />
        </TB>
        <TB label="Heading" active={s.h2} onClick={() => chain().toggleHeading({ level: 2 }).run()}>
          <Heading2 />
        </TB>
        <TB label="Subheading" active={s.h3} onClick={() => chain().toggleHeading({ level: 3 }).run()}>
          <Heading3 />
        </TB>
        <Divider />
        <TB label="Bold" shortcut={`${mod}B`} active={s.bold} onClick={() => chain().toggleBold().run()}>
          <Bold />
        </TB>
        <TB label="Italic" shortcut={`${mod}I`} active={s.italic} onClick={() => chain().toggleItalic().run()}>
          <Italic />
        </TB>
        <TB label="Underline" shortcut={`${mod}U`} active={s.underline} onClick={() => chain().toggleUnderline().run()}>
          <Underline />
        </TB>
        <TB label="Strikethrough" active={s.strike} onClick={() => chain().toggleStrike().run()}>
          <Strikethrough />
        </TB>
        <TB label="Link" active={s.link || linkOpen} onClick={openLink}>
          <Link2 />
        </TB>
        <Divider />
        <TB label="Bulleted list" active={s.bulletList} onClick={() => chain().toggleBulletList().run()}>
          <List />
        </TB>
        <TB label="Numbered list" active={s.orderedList} onClick={() => chain().toggleOrderedList().run()}>
          <ListOrdered />
        </TB>
        <TB label="Quote" active={s.blockquote} onClick={() => chain().toggleBlockquote().run()}>
          <Quote />
        </TB>
        <TB label="Divider line" onClick={() => chain().setHorizontalRule().run()}>
          <Minus />
        </TB>
        <TB label={uploading ? "Uploading image" : "Insert image"} disabled={uploading} onClick={onPickImage}>
          {uploading ? <Loader2 className="animate-spin" /> : <ImagePlus />}
        </TB>
        <Divider />
        <TB label="Align left" active={s.alignLeft} onClick={() => chain().setTextAlign("left").run()}>
          <AlignLeft />
        </TB>
        <TB label="Align center" active={s.alignCenter} onClick={() => chain().setTextAlign("center").run()}>
          <AlignCenter />
        </TB>
        <TB label="Align right" active={s.alignRight} onClick={() => chain().setTextAlign("right").run()}>
          <AlignRight />
        </TB>
        <div className="ml-auto flex gap-0.5">
          <TB label="Undo" shortcut={`${mod}Z`} disabled={!s.canUndo} onClick={() => chain().undo().run()}>
            <Undo2 />
          </TB>
          <TB label="Redo" shortcut={`${mod}Shift+Z`} disabled={!s.canRedo} onClick={() => chain().redo().run()}>
            <Redo2 />
          </TB>
        </div>
      </div>

      {linkOpen && (
        <div className="flex flex-wrap items-center gap-2 border-t border-[#E6ECEA] px-3 py-2 sm:px-6">
          <input
            ref={linkInputRef}
            type="url"
            value={href}
            onChange={(e) => setHref(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                applyLink();
              } else if (e.key === "Escape") {
                setLinkOpen(false);
                editor.commands.focus();
              }
            }}
            placeholder="https://… or /products"
            aria-label="Link address"
            className={`${inputClass} h-8 max-w-sm flex-1`}
          />
          <Button size="sm" variant="primary" onClick={applyLink}>
            Apply link
          </Button>
          {s.link && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                chain().extendMarkRange("link").unsetLink().run();
                setLinkOpen(false);
              }}
            >
              Remove link
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => setLinkOpen(false)}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}

function TB({
  label,
  shortcut,
  active = false,
  disabled = false,
  onClick,
  children,
}: {
  label: string;
  shortcut?: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={shortcut ? `${label} (${shortcut})` : label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()} // keep the text selection
      onClick={onClick}
      className={`grid h-8 w-8 shrink-0 place-items-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18B27F]/60 disabled:opacity-35 [&_svg]:h-4 [&_svg]:w-4 ${
        active ? "bg-[#DCF2E9] text-[#0B6A4B]" : "text-[#3E534C] hover:bg-[#EDF1EF] hover:text-[#10261F]"
      }`}
    >
      {children}
    </button>
  );
}

const Divider = () => <span className="mx-1 h-5 w-px shrink-0 bg-[#DCE3E0]" aria-hidden />;
