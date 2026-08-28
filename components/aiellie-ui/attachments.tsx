"use client"

import * as React from "react"
import {
  Alert01Icon,
  Cancel01Icon,
  Csv01Icon,
  Doc01Icon,
  File01Icon,
  Image01Icon,
  MusicNote01Icon,
  Pdf01Icon,
  Ppt01Icon,
  Txt01Icon,
  Video01Icon,
  Xls01Icon,
  Zip01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import {
  field,
  ghostButton,
  paper,
  ShimmerLabel,
} from "@/components/aiellie-ui/actions"
import {
  BRAND_ICONS,
  CodeIcon,
  LANGUAGE_ICONS,
  type CodeIconSet,
} from "@/components/icons/code-icons"
import { cn } from "@/lib/utils"

/**
 * What a message carries besides its words: the files picked in the composer
 * before it is sent, and the same files hanging off it afterwards.
 *
 * One element for both moments rather than an editable chip and a read-only
 * twin, because the only thing that changes between them is whether the file
 * can still be taken off — which is what `onRemove` says. Two components would
 * have drifted the first time either was touched.
 */

export type AttachmentStatus = "uploading" | "ready" | "error"

/* ------------------------------------------------------------------------- *
 * Reading a file off its name
 * ------------------------------------------------------------------------- */

/**
 * The badge for anything the code catalogue does not name. Deliberately keyed
 * by what you would *do* with the file rather than by what wrote it: a reader
 * scanning a row of chips is looking for the spreadsheet, not for Excel.
 */
const KIND_ICONS: Record<string, IconSvgElement> = {
  pdf: Pdf01Icon,
  doc: Doc01Icon,
  docx: Doc01Icon,
  odt: Doc01Icon,
  rtf: Doc01Icon,
  pages: Doc01Icon,
  xls: Xls01Icon,
  xlsx: Xls01Icon,
  ods: Xls01Icon,
  numbers: Xls01Icon,
  csv: Csv01Icon,
  tsv: Csv01Icon,
  ppt: Ppt01Icon,
  pptx: Ppt01Icon,
  odp: Ppt01Icon,
  txt: Txt01Icon,
  log: Txt01Icon,
  zip: Zip01Icon,
  gz: Zip01Icon,
  tgz: Zip01Icon,
  tar: Zip01Icon,
  rar: Zip01Icon,
  "7z": Zip01Icon,
  png: Image01Icon,
  jpg: Image01Icon,
  jpeg: Image01Icon,
  gif: Image01Icon,
  webp: Image01Icon,
  avif: Image01Icon,
  heic: Image01Icon,
  bmp: Image01Icon,
  tiff: Image01Icon,
  mp4: Video01Icon,
  mov: Video01Icon,
  webm: Video01Icon,
  mkv: Video01Icon,
  avi: Video01Icon,
  mp3: MusicNote01Icon,
  wav: MusicNote01Icon,
  m4a: MusicNote01Icon,
  aac: MusicNote01Icon,
  flac: MusicNote01Icon,
  ogg: MusicNote01Icon,
}

/**
 * The same question asked of a MIME type, for the files that arrive without a
 * usable name at all — a screenshot off the clipboard is `image/png` and
 * nothing else.
 */
const MIME_ICONS: Record<string, IconSvgElement> = {
  image: Image01Icon,
  video: Video01Icon,
  audio: MusicNote01Icon,
  text: Txt01Icon,
}

/** The extension, lowercased. A leading dot is a name, so `.env` has none. */
function extensionOf(name: string): string {
  const dot = name.lastIndexOf(".")
  return dot > 0 ? name.slice(dot + 1).toLowerCase() : ""
}

/**
 * The name split where it is safe to cut it.
 *
 * A filename truncated from the end loses its extension, which is the half a
 * reader is actually checking — `quarterly-report-final-v3.pdf` cut to
 * `quarterly-report-fin…` has thrown away the only word that said it was a
 * PDF. So the stem gets the ellipsis and the extension is held at its natural
 * width beside it, giving `quarterly-repo….pdf`.
 */
function splitName(name: string): [stem: string, extension: string] {
  const dot = name.lastIndexOf(".")
  return dot > 0 ? [name.slice(0, dot), name.slice(dot)] : [name, ""]
}

/** `PDF`, `PNG`, `TS` — the extension, or the MIME subtype where there is none. */
function kindLabel(name: string, type?: string): string {
  const extension = extensionOf(name)
  if (extension) return extension.toUpperCase()

  const subtype = type?.split("/")[1]?.split(/[+;]/)[0]
  return subtype ? subtype.toUpperCase() : ""
}

/**
 * A file size the way a file manager writes one: powers of a thousand, not of
 * 1024. The binary units are the honest ones and nobody wants them — a reader
 * comparing a chip against what their operating system told them the file
 * weighed is better served by agreeing with it.
 *
 * One decimal only while the decimal says something. 1.2 MB and 1.9 MB are
 * different sizes; 24.3 MB and 24 MB are the same size to anyone reading a
 * chip in a composer.
 */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return ""
  if (bytes < 1000) return `${Math.round(bytes)} B`

  const units = ["KB", "MB", "GB", "TB"]
  let value = bytes / 1000
  let unit = 0

  /* 999.5 rather than 1000, so a size that would *print* as `1000 KB` steps up
     to `1.0 MB` instead of showing a unit's worth of digits it should not. */
  while (value >= 999.5 && unit < units.length - 1) {
    value /= 1000
    unit += 1
  }

  return `${value < 10 ? value.toFixed(1) : Math.round(value)} ${units[unit]}`
}

export interface AttachmentIconProps {
  /** The filename to read the badge off. */
  name: string
  /** MIME type, consulted only when the name has no extension to go on. */
  type?: string
  /** `brand` draws the languages in their own colours, as the code parts do. */
  set?: CodeIconSet
  className?: string
}

/**
 * The badge a file wears.
 *
 * The code catalogue is asked first and wins outright: a `.ts` hung off a
 * message should carry the same mark it carries in a code block header, or the
 * two halves of the same interface disagree about what TypeScript looks like.
 * Only what that catalogue has never heard of — the PDFs, the spreadsheets,
 * the archives — falls through to the kinds above.
 */
export function AttachmentIcon({
  name,
  type,
  set = "mono",
  className,
}: AttachmentIconProps) {
  const extension = extensionOf(name)

  if (extension in LANGUAGE_ICONS || extension in BRAND_ICONS) {
    return <CodeIcon name={name} set={set} className={className} />
  }

  const icon =
    KIND_ICONS[extension] ?? MIME_ICONS[type?.split("/")[0] ?? ""] ?? File01Icon

  return (
    <HugeiconsIcon
      aria-hidden
      icon={icon}
      strokeWidth={2}
      className={cn("shrink-0", className)}
    />
  )
}

/* ------------------------------------------------------------------------- *
 * The row
 * ------------------------------------------------------------------------- */

/**
 * The files on one message, as a row that wraps.
 *
 * Wrapping rather than scrolling, which is the opposite of what `suggestions`
 * does and for the opposite reason: a prompt scrolled off the end is one offer
 * among many and losing it costs nothing, whereas a file scrolled out of sight
 * is a file about to be sent by someone who has forgotten it is there. The
 * composer growing a line taller is the cheaper of the two.
 */
export function Attachments({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachments"
      className={cn("flex w-full flex-wrap items-start gap-2", className)}
      {...props}
    />
  )
}

/* ------------------------------------------------------------------------- *
 * The chip
 * ------------------------------------------------------------------------- */

export interface AttachmentProps extends Omit<
  React.ComponentProps<"div">,
  "children"
> {
  /** The filename. Decides the badge, the kind label, and where the name is cut. */
  name: string
  /** Size in bytes. */
  size?: number
  /** MIME type, for a file whose name has no extension to read. */
  type?: string
  /**
   * A thumbnail. Anything with one is drawn as the picture rather than as a
   * glyph — an object URL, a data URL, a remote preview, whichever. Revoking an
   * object URL once the attachment is gone is the caller's job; this element
   * has no idea when the file it was made from stops mattering.
   */
  src?: string
  status?: AttachmentStatus
  /**
   * How far along, 0 to 1, while `status` is `uploading`. Left out, the chip
   * says an upload is happening without claiming to know how far — which is the
   * honest state for anything streaming to a host that reports no progress.
   */
  progress?: number
  /**
   * Replaces the derived `PDF · 1.2 MB` line, whatever the status: page count,
   * pixel dimensions, or why the upload failed.
   */
  meta?: React.ReactNode
  /**
   * `mono` or `brand` derive the badge from the name; anything else renderable
   * is used as it stands; `null` drops the badge altogether. Mirrors what the
   * code parts do with theirs.
   */
  icon?: React.ReactNode | CodeIconSet | null
  /**
   * `chip` is the row form and reads the name; `tile` is the square one and
   * leads with the picture. Pick `tile` where the files are images and the
   * thumbnail is the thing being scanned for.
   */
  variant?: "chip" | "tile"
  /** Offered where the file can still be taken off — a composer, mainly. */
  onRemove?: () => void
  /** Offered on a failed upload, where the state is a question, not a report. */
  onRetry?: () => void
  /** Opens the file. Renders as a button covering the chip. */
  onOpen?: () => void
  /** Opens the file as a link instead — a download URL, a preview route. */
  href?: string
}

/**
 * One file: what it is, what it weighs, how far along it got, and the way off.
 *
 * The whole chip is not itself a button, though it behaves like one when
 * `onOpen` or `href` is given. It cannot be: the remove control lives inside
 * it, and a button inside a button is not something a browser will honour. So
 * the openable case lays a transparent control over the chip and lets the
 * remove button sit above that — both real controls, both in the tab order,
 * neither nested in the other.
 */
export function Attachment({
  name,
  size,
  type,
  src,
  status = "ready",
  progress,
  meta,
  icon,
  variant = "chip",
  onRemove,
  onRetry,
  onOpen,
  href,
  className,
  ...props
}: AttachmentProps) {
  const tile = variant === "tile"
  const failed = status === "error"
  const uploading = status === "uploading"
  const openable = Boolean(onOpen || href)

  const [stem, extension] = splitName(name)
  const percent =
    progress === undefined
      ? undefined
      : Math.round(Math.min(1, Math.max(0, progress)) * 100)

  const badge = failed ? (
    <HugeiconsIcon
      aria-hidden
      icon={Alert01Icon}
      strokeWidth={2}
      className="size-4 shrink-0"
    />
  ) : icon === null ? null : icon === undefined ||
    icon === "mono" ||
    icon === "brand" ? (
    <AttachmentIcon
      name={name}
      type={type}
      set={icon === "brand" ? "brand" : "mono"}
      className="size-4"
    />
  ) : (
    icon
  )

  /* The one line under the name, in priority order: what the caller said, then
     what went wrong, then how far along, then what the file is. */
  const kind = kindLabel(name, type)
  const weight = size === undefined ? "" : formatBytes(size)
  const description =
    meta ??
    (failed ? (
      "Upload failed"
    ) : uploading ? (
      percent === undefined ? (
        <ShimmerLabel>Uploading…</ShimmerLabel>
      ) : weight ? (
        `${percent}% of ${weight}`
      ) : (
        `${percent}%`
      )
    ) : (
      [kind, weight].filter(Boolean).join(" · ")
    ))

  const track =
    uploading && percent !== undefined ? (
      <div
        role="progressbar"
        aria-label={`Uploading ${name}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className={cn(
          // Pinned into the chip's own bottom padding rather than added as a
          // row of its own, so nothing moves when the upload finishes and the
          // bar goes away.
          "absolute bottom-1 h-[3px] overflow-hidden rounded-full bg-foreground/10",
          tile ? "inset-x-1.5" : "inset-x-2.5"
        )}
      >
        <div
          style={{ width: `${percent}%` }}
          className="h-full rounded-full bg-foreground/70 transition-[width] duration-300 ease-out motion-reduce:transition-none"
        />
      </div>
    ) : null

  const remove = onRemove ? (
    <button
      type="button"
      aria-label={`Remove ${name}`}
      onClick={onRemove}
      className={cn(
        ghostButton,
        // Always drawn, never revealed on hover. A control that only exists
        // under a pointer does not exist on a touchscreen at all, and an
        // attachment you cannot take back off is the worst thing in this
        // element to have to discover.
        "relative z-20 size-5 shrink-0",
        tile &&
          "absolute end-1 top-1 bg-background/70 text-foreground/70 backdrop-blur-sm hover:bg-background/90"
      )}
    >
      <HugeiconsIcon
        aria-hidden
        icon={Cancel01Icon}
        strokeWidth={2.5}
        className="size-3"
      />
    </button>
  ) : null

  /* The stretched control. It carries the label, because it is the thing being
     activated and the visible name is decoration as far as it is concerned.

     The z-indices are the whole trick and they have to be explicit: the badge
     and the tile's scrim are positioned too, and a positioned sibling later in
     the source paints over an earlier one whatever the order they were written
     in — so left on `auto` this would end up under the very thing it is meant
     to make clickable, and a click on the badge would do nothing. It is put on
     10, and the controls that must stay above it on 20. */
  const overlay = openable
    ? React.createElement(href ? "a" : "button", {
        ...(href ? { href } : { type: "button", onClick: onOpen }),
        "aria-label": `Open ${name}`,
        className: cn(
          "absolute inset-0 z-10 rounded-[inherit] outline-none",
          "focus-visible:ring-2 focus-visible:ring-ring/50"
        ),
      })
    : null

  if (tile) {
    return (
      <div
        data-slot="attachment"
        data-variant="tile"
        data-status={status}
        title={name}
        className={cn(
          paper,
          "relative size-20 shrink-0 overflow-hidden rounded-xl",
          openable &&
            "transition-transform hover:-translate-y-px motion-reduce:transition-none",
          failed && "border-destructive/40 text-destructive",
          className
        )}
        {...props}
      >
        {overlay}

        {src && !failed ? (
          // A plain img rather than next/image, because this file is copied
          // into projects that are not necessarily Next ones.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt=""
            className={cn(
              "absolute inset-0 size-full object-cover",
              uploading && "opacity-60"
            )}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-foreground/45">
            {badge}
          </div>
        )}

        {/* The scrim, so a name stays readable over a photograph of anything.
            Only where there is a picture under it — on a glyph tile it would
            be dimming the background for no reason. */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 flex flex-col justify-end gap-px px-1.5 pt-4 pb-1.5",
            src &&
              !failed &&
              "bg-gradient-to-t from-black/75 via-black/45 to-transparent"
          )}
        >
          <span
            className={cn(
              "flex min-w-0 text-[10px] leading-tight font-medium",
              src && !failed ? "text-white" : "text-foreground"
            )}
          >
            <span className="truncate">{stem}</span>
            <span className="shrink-0">{extension}</span>
          </span>
          {description ? (
            <span
              className={cn(
                "truncate text-[10px] leading-tight",
                failed
                  ? "text-destructive"
                  : src
                    ? "text-white/70"
                    : "text-muted-foreground"
              )}
            >
              {description}
            </span>
          ) : null}
        </div>

        {track}
        {remove}
      </div>
    )
  }

  return (
    <div
      data-slot="attachment"
      data-variant="chip"
      data-status={status}
      className={cn(
        paper,
        "group/attachment relative flex w-fit max-w-56 min-w-0 items-center gap-2.5 rounded-xl px-2.5 py-2",
        openable &&
          "transition-transform hover:-translate-y-px motion-reduce:transition-none",
        failed && "border-destructive/40",
        className
      )}
      {...props}
    >
      {overlay}

      <div
        className={cn(
          "relative grid size-8 shrink-0 place-items-center overflow-hidden rounded-lg",
          field,
          failed && "bg-destructive/10 text-destructive"
        )}
      >
        {src && !failed ? (
          // A plain img, as above.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt=""
            className={cn(
              "absolute inset-0 size-full object-cover",
              uploading && "opacity-60"
            )}
          />
        ) : (
          <span className={cn(!failed && "text-foreground/55")}>{badge}</span>
        )}
      </div>

      <div className="flex min-w-0 flex-col gap-0.5">
        <span
          title={name}
          className="flex min-w-0 text-xs leading-tight font-medium"
        >
          <span className="truncate">{stem}</span>
          <span className="shrink-0">{extension}</span>
        </span>

        {description ? (
          <span
            className={cn(
              "flex min-w-0 items-center gap-1.5 text-[11px] leading-tight",
              failed ? "text-destructive" : "text-muted-foreground"
            )}
          >
            <span className="truncate">{description}</span>
            {failed && onRetry ? (
              <button
                type="button"
                onClick={onRetry}
                className="relative z-20 shrink-0 cursor-pointer underline underline-offset-3 hover:text-destructive/80"
              >
                Retry
              </button>
            ) : null}
          </span>
        ) : null}
      </div>

      {track}
      {remove}
    </div>
  )
}
