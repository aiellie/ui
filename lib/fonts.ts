import { Geist, Geist_Mono } from "next/font/google"

import { cn } from "@/lib/utils"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

/** Every font variable, ready to drop on the <html> element. */
const fontVariables = cn(fontSans.variable, fontMono.variable)

type FontFamily = {
  name: string
  /** What the family is for. */
  role: string
  /** The CSS custom property next/font writes the family into. */
  cssVar: string
  /** Full family utility, written out so Tailwind detects the class. */
  className: string
  sample: string
}

const fontFamilies: FontFamily[] = [
  {
    name: "Geist",
    role: "Interface and body copy",
    cssVar: "--font-sans",
    className: "font-sans",
    sample: "The quick brown fox jumps over the lazy dog",
  },
  {
    name: "Geist Mono",
    role: "Code, tokens and tabular numerals",
    cssVar: "--font-geist-mono",
    className: "font-mono",
    sample: "const ui = { ready: true } 0123456789",
  },
]

type TypeStep = {
  /** Full size utility, written out so Tailwind detects the class. */
  className: string
  size: string
  lineHeight: string
}

const typeScale: TypeStep[] = [
  { className: "text-xs", size: "12px", lineHeight: "16px" },
  { className: "text-sm", size: "14px", lineHeight: "20px" },
  { className: "text-base", size: "16px", lineHeight: "24px" },
  { className: "text-lg", size: "18px", lineHeight: "28px" },
  { className: "text-xl", size: "20px", lineHeight: "28px" },
  { className: "text-2xl", size: "24px", lineHeight: "32px" },
  { className: "text-3xl", size: "30px", lineHeight: "36px" },
  { className: "text-4xl", size: "36px", lineHeight: "40px" },
]

type FontWeight = {
  name: string
  /** Full weight utility, written out so Tailwind detects the class. */
  className: string
  value: number
}

const fontWeights: FontWeight[] = [
  { name: "Light", className: "font-light", value: 300 },
  { name: "Regular", className: "font-normal", value: 400 },
  { name: "Medium", className: "font-medium", value: 500 },
  { name: "Semibold", className: "font-semibold", value: 600 },
  { name: "Bold", className: "font-bold", value: 700 },
]

export {
  fontFamilies,
  fontMono,
  fontSans,
  fontVariables,
  fontWeights,
  typeScale,
}
export type { FontFamily, FontWeight, TypeStep }
