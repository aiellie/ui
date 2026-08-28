import * as React from "react"
import {
  AiBrain01Icon,
  AmazonIcon,
  ArtificialIntelligence04Icon,
  Atom02Icon,
  BrainCircuitIcon,
  ChatGptIcon,
  ClaudeIcon,
  ConnectIcon,
  DeepseekIcon,
  FireworksIcon,
  FlashIcon,
  GlobeIcon,
  GoogleGeminiIcon,
  GoogleIcon,
  Grok02Icon,
  Hexagon01Icon,
  Image02Icon,
  KimiAiIcon,
  MetaIcon,
  MicrosoftIcon,
  MistralIcon,
  PerplexityAiIcon,
  QwenIcon,
  Route01Icon,
  SourceCodeIcon,
  Wrench01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import type { ModelCapability } from "@/lib/models"
import { cn } from "@/lib/utils"

/**
 * The mark a provider, a model or a capability wears — the same job
 * `code-icons` does for a filename, and split the same way, into two sets:
 *
 * - `mono`, drawn in `currentColor`, which is the default. A menu row is a
 *   line of text with a glyph at the front of it, and a run of full-colour
 *   logos down the side of one reads as a sponsor list.
 * - `brand`, in each company's own colours, for the places where the logo is
 *   the point rather than the label — a chosen-model chip, a pricing table, a
 *   settings page with one row per provider.
 *
 * The other split, and the one that is easy to get wrong, is a company against
 * its product: `ClaudeIcon` is Claude's mark, not Anthropic's. A provider wears
 * the company's, a model wears the product's.
 *
 * Where Hugeicons carries a mark it is used. Where it does not, the mark is
 * drawn here — the same exception `code-icons` makes for the Rust gear, since a
 * logo is a specific shape in specific colours rather than a glyph you get to
 * choose. What is left over takes an abstract glyph picked for what the
 * provider is known for, never a logo drawn from memory.
 */

type MarkProps = React.SVGProps<SVGSVGElement>

/** One drawn mark, in either set. */
type Mark = (props: MarkProps) => React.ReactElement

/** Which set a mark is asked for in. `mono` inherits the text colour. */
type ModelIconSet = "mono" | "brand"

/**
 * Written without `width` or `height` so the class sizing it wins, and with
 * `aria-hidden` since the name it sits beside already says whose mark it is.
 */
function Svg({ children, ...props }: MarkProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden {...props}>
      {children}
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/*  Mono marks — one colour, inherited                                        */
/* -------------------------------------------------------------------------- */

/** Anthropic's "A", which is not the Claude sunburst. */
const AnthropicMark: Mark = (props) => (
  <Svg viewBox="0 0 40 40" fill="currentColor" {...props}>
    <path d="M26.9568 9.88184H22.1265L30.7753 31.7848H35.4917L26.9568 9.88184ZM13.028 9.88184L4.4917 31.7848H9.32203L11.2305 27.1793H20.2166L22.0126 31.6724H26.8444L18.0832 9.88184H13.028ZM12.5783 23.1361L15.4987 15.3853L18.5315 23.1361H12.5783Z" />
  </Svg>
)

const GrokMark: Mark = (props) => (
  <Svg viewBox="0 1 48 46" fill="currentColor" {...props}>
    <path d="m18.542 30.532 15.956-11.776c.783-.576 1.902-.354 2.274.545 1.962 4.728 1.084 10.411-2.819 14.315-3.903 3.901-9.333 4.756-14.299 2.808l-5.423 2.511c7.778 5.315 17.224 4 23.125-1.903 4.682-4.679 6.131-11.058 4.775-16.812l.011.011c-1.966-8.452.482-11.829 5.501-18.735.116-.164.237-.33.357-.496l-6.602 6.599v-.022l-22.86 22.958m-3.29 2.857c-5.582-5.329-4.619-13.579.142-18.339 3.521-3.522 9.294-4.958 14.331-2.847l5.412-2.497c-.974-.704-2.224-1.46-3.659-1.994-6.478-2.666-14.238-1.34-19.505 3.922-5.065 5.064-6.659 12.851-3.924 19.496 2.044 4.965-1.307 8.48-4.682 12.023-1.199 1.255-2.396 2.514-3.363 3.844l15.241-13.608" />
  </Svg>
)

/** Vercel's triangle. The same in both sets — its brand colour *is* the ink. */
const VercelMark: Mark = (props) => (
  <Svg viewBox="0 -17 256 256" fill="currentColor" {...props}>
    <polygon points="128 0 256 221.705007 0 221.705007" />
  </Svg>
)

const AlibabaMark: Mark = (props) => (
  <Svg viewBox="0 0 32 32" fill="currentColor" {...props}>
    <path d="M18.988 21.273c-1.203 0.055-1.081-0.574-0.377-1.542 1.649-2.209 4.774-5.293 4.881-7.475 0.189-2.853-2.678-3.781-5.625-3.754-2.042 0.087-3.963 0.495-5.75 1.174l0.126-0.042c-4.242 1.38-7.731 4.094-10.058 7.639l-0.044 0.072c-2.096 3.097-1.406 6.057 3.015 6.153 2.92-0.122 5.625-0.942 7.983-2.297l-0.085 0.045c0.012 0-6.356 1.816-8.695 0.479l-0.010-0.003c-0.323-0.16-0.547-0.478-0.571-0.85l-0-0.003c-0.015-1.106 1.824-2.252 2.853-2.62v-1.916c0.724 0.289 1.563 0.457 2.442 0.457 1.657 0 3.175-0.598 4.35-1.589l-0.010 0.008c0.038 0.13 0.060 0.28 0.060 0.434 0 0.044-0.002 0.087-0.005 0.13l0-0.006h0.464c0.004-0.039 0.006-0.085 0.006-0.131 0-0.279-0.082-0.539-0.224-0.756l0.003 0.005c-0.247-0.381-0.664-0.633-1.141-0.65l-0.002-0c0.272 0.136 0.495 0.334 0.657 0.576l0.004 0.006c-1.068 0.901-2.459 1.448-3.978 1.448-0.661 0-1.298-0.104-1.895-0.295l0.044 0.012 1.512-1.5-0.42-1.092c2.766-1.061 6.047-1.965 9.434-2.558l0.328-0.047-0.932-0.78 0.486-0.3c2.512 0.71 4.155 1.231 4.065 2.563-0.059 0.289-0.146 0.544-0.261 0.784l0.009-0.020c-1.173 1.83-2.421 3.422-3.801 4.888l0.016-0.017c-0.537 0.586-1.048 1.223-1.516 1.892l-0.040 0.060c-0.376 0.492-0.625 1.099-0.687 1.761l-0.001 0.014c0.054 4.379 12.914-2.049 15.401-3.753-3.496 1.72-7.56 2.923-11.848 3.383l-0.16 0.014z" />
  </Svg>
)

const MoonshotMark: Mark = (props) => (
  <Svg viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" {...props}>
    <path d="M1.052 16.916l9.539 2.552a21.007 21.007 0 00.06 2.033l5.956 1.593a11.997 11.997 0 01-5.586.865l-.18-.016-.044-.004-.084-.009-.094-.01a11.605 11.605 0 01-.157-.02l-.107-.014-.11-.016a11.962 11.962 0 01-.32-.051l-.042-.008-.075-.013-.107-.02-.07-.015-.093-.019-.075-.016-.095-.02-.097-.023-.094-.022-.068-.017-.088-.022-.09-.024-.095-.025-.082-.023-.109-.03-.062-.02-.084-.025-.093-.028-.105-.034-.058-.019-.08-.026-.09-.031-.066-.024a6.293 6.293 0 01-.044-.015l-.068-.025-.101-.037-.057-.022-.08-.03-.087-.035-.088-.035-.079-.032-.095-.04-.063-.028-.063-.027a5.655 5.655 0 01-.041-.018l-.066-.03-.103-.047-.052-.024-.096-.046-.062-.03-.084-.04-.086-.044-.093-.047-.052-.027-.103-.055-.057-.03-.058-.032a6.49 6.49 0 01-.046-.026l-.094-.053-.06-.034-.051-.03-.072-.041-.082-.05-.093-.056-.052-.032-.084-.053-.061-.039-.079-.05-.07-.047-.053-.035a7.785 7.785 0 01-.054-.036l-.044-.03-.044-.03a6.066 6.066 0 01-.04-.028l-.057-.04-.076-.054-.069-.05-.074-.054-.056-.042-.076-.057-.076-.059-.086-.067-.045-.035-.064-.052-.074-.06-.089-.073-.046-.039-.046-.039a7.516 7.516 0 01-.043-.037l-.045-.04-.061-.053-.07-.062-.068-.06-.062-.058-.067-.062-.053-.05-.088-.084a13.28 13.28 0 01-.099-.097l-.029-.028-.041-.042-.069-.07-.05-.051-.05-.053a6.457 6.457 0 01-.168-.179l-.08-.088-.062-.07-.071-.08-.042-.049-.053-.062-.058-.068-.046-.056a7.175 7.175 0 01-.027-.033l-.045-.055-.066-.082-.041-.052-.05-.064-.02-.025a11.99 11.99 0 01-1.44-2.402zm-1.02-5.794l11.353 3.037a20.468 20.468 0 00-.469 2.011l10.817 2.894a12.076 12.076 0 01-1.845 2.005L.657 15.923l-.016-.046-.035-.104a11.965 11.965 0 01-.05-.153l-.007-.023a11.896 11.896 0 01-.207-.741l-.03-.126-.018-.08-.021-.097-.018-.081-.018-.09-.017-.084-.018-.094c-.026-.141-.05-.283-.071-.426l-.017-.118-.011-.083-.013-.102a12.01 12.01 0 01-.019-.161l-.005-.047a12.12 12.12 0 01-.034-2.145zm1.593-5.15l11.948 3.196c-.368.605-.705 1.231-1.01 1.875l11.295 3.022c-.142.82-.368 1.612-.668 2.365l-11.55-3.09L.124 10.26l.015-.1.008-.049.01-.067.015-.087.018-.098c.026-.148.056-.295.088-.442l.028-.124.02-.085.024-.097c.022-.09.045-.18.07-.268l.028-.102.023-.083.03-.1.025-.082.03-.096.026-.082.031-.095a11.896 11.896 0 011.01-2.232zm4.442-4.4L17.352 4.59a20.77 20.77 0 00-1.688 1.721l7.823 2.093c.267.852.442 1.744.513 2.665L2.106 5.213l.045-.065.027-.04.04-.055.046-.065.055-.076.054-.072.064-.086.05-.065.057-.073.055-.07.06-.074.055-.069.065-.077.054-.066.066-.077.053-.06.072-.082.053-.06.067-.074.054-.058.073-.078.058-.06.063-.067.168-.17.1-.098.059-.056.076-.071a12.084 12.084 0 012.272-1.677zM12.017 0h.097l.082.001.069.001.054.002.068.002.046.001.076.003.047.002.06.003.054.002.087.005.105.007.144.011.088.007.044.004.077.008.082.008.047.005.102.012.05.006.108.014.081.01.042.006.065.01.207.032.07.012.065.011.14.026.092.018.11.022.046.01.075.016.041.01L14.7.3l.042.01.065.015.049.012.071.017.096.024.112.03.113.03.113.032.05.015.07.02.078.024.073.023.05.016.05.016.076.025.099.033.102.036.048.017.064.023.093.034.11.041.116.045.1.04.047.02.06.024.041.018.063.026.04.018.057.025.11.048.1.046.074.035.075.036.06.028.092.046.091.045.102.052.053.028.049.026.046.024.06.033.041.022.052.029.088.05.106.06.087.051.057.034.053.032.096.059.088.055.098.062.036.024.064.041.084.056.04.027.062.042.062.043.023.017c.054.037.108.075.161.114l.083.06.065.048.056.043.086.065.082.064.04.03.05.041.086.069.079.065.085.071c.712.6 1.353 1.283 1.909 2.031L7.222.994l.062-.027.065-.028.081-.034.086-.035c.113-.045.227-.09.341-.131l.096-.035.093-.033.084-.03.096-.031c.087-.03.176-.058.264-.085l.091-.027.086-.025.102-.03.085-.023.1-.026L9.04.37l.09-.023.091-.022.095-.022.09-.02.098-.021.091-.02.095-.018.092-.018.1-.018.091-.016.098-.017.092-.014.097-.015.092-.013.102-.013.091-.012.105-.012.09-.01.105-.01c.093-.01.186-.018.28-.024l.106-.008.09-.005.11-.006.093-.004.1-.004.097-.002.099-.002.197-.002z" />
  </Svg>
)

/** v0's wordmark — a model rather than a house. */
const V0Mark: Mark = (props) => (
  <Svg viewBox="0 0 147 70" fill="currentColor" {...props}>
    <path d="M56 50.2031V14H70V60.1562C70 65.5928 65.5928 70 60.1562 70C57.5605 70 54.9982 68.9992 53.1562 67.1573L0 14H19.7969L56 50.2031Z" />
    <path d="M147 56H133V23.9531L100.953 56H133V70H96.6875C85.8144 70 77 61.1856 77 50.3125V14H91V46.1562L123.156 14H91V0H127.312C138.186 0 147 8.81439 147 19.6875V56Z" />
  </Svg>
)

/* -------------------------------------------------------------------------- */
/*  Brand marks — each company's own colours                                  */
/* -------------------------------------------------------------------------- */

const ClaudeBrandMark: Mark = (props) => (
  <Svg viewBox="0 -.01 39.5 39.53" fill="none" {...props}>
    <path
      fill="#d97757"
      d="m7.75 26.27 7.77-4.36.13-.38-.13-.21h-.38l-1.3-.08-4.44-.12-3.85-.16-3.73-.2-.94-.2-.88-1.16.09-.58.79-.53 1.13.1 2.5.17 3.75.26 2.72.16 4.03.42h.64l.09-.26-.22-.16-.17-.16-3.88-2.63-4.2-2.78-2.2-1.6-1.19-.81-.6-.76-.26-1.66 1.08-1.19 1.45.1.37.1 1.47 1.13 3.14 2.43 4.1 3.02.6.5.24-.17.03-.12-.27-.45-2.23-4.03-2.38-4.1-1.06-1.7-.28-1.02c-.1-.42-.17-.77-.17-1.2l1.23-1.67.68-.22 1.64.22.69.6 1.02 2.33 1.65 3.67 2.56 4.99.75 1.48.4 1.37.15.42h.26v-.24l.21-2.81.39-3.45.38-4.44.13-1.25.62-1.5 1.23-.81.96.46.79 1.13-.11.73-.47 3.05-.92 4.78-.6 3.2h.35l.4-.4 1.62-2.15 2.72-3.4 1.2-1.35 1.4-1.49.9-.71h1.7l1.25 1.86-.56 1.92-1.75 2.22-1.45 1.88-2.08 2.8-1.3 2.24.12.18.31-.03 4.7-1 2.54-.46 3.03-.52 1.37.64.15.65-.54 1.33-3.24.8-3.8.76-5.66 1.34-.07.05.08.1 2.55.24 1.09.06h2.67l4.97.37 1.3.86.78 1.05-.13.8-2 1.02-2.7-.64-6.3-1.5-2.16-.54h-.3v.18l1.8 1.76 3.3 2.98 4.13 3.84.21.95-.53.75-.56-.08-3.63-2.73-1.4-1.23-3.17-2.67h-.21v.28l.73 1.07 3.86 5.8.2 1.78-.28.58-1 .35-1.1-.2-2.26-3.17-2.33-3.57-1.88-3.2-.23.13-1.11 11.95-.52.61-1.2.46-1-.76-.53-1.23.53-2.43.64-3.17.52-2.52.47-3.13.28-1.04-.02-.07-.23.03-2.36 3.24-3.59 4.85-2.84 3.04-.68.27-1.18-.61.11-1.09.66-.97 3.93-5 2.37-3.1 1.53-1.79-.01-.26h-.09l-10.44 6.78-1.86.24-.8-.75.1-1.23.38-.4 3.14-2.16z"
    />
  </Svg>
)

/**
 * Gemini's ramp, and the reason these two brand marks take a hook. A gradient
 * needs an `id` to be referenced by, and an `id` baked into a component drawn
 * once per row is a duplicate `id` per row — invalid, and the first thing to
 * break the moment two of them are on screen. `useId` gives each instance its
 * own.
 */
const GeminiBrandMark: Mark = (props) => {
  const id = React.useId()
  return (
    <Svg viewBox="0 0 28 28" fill="none" {...props}>
      <path
        fill={`url(#${id})`}
        d="M14 28C14 26.0633 13.6267 24.2433 12.88 22.54C12.1567 20.8367 11.165 19.355 9.905 18.095C8.645 16.835 7.16333 15.8433 5.46 15.12C3.75667 14.3733 1.93667 14 0 14C1.93667 14 3.75667 13.6383 5.46 12.915C7.16333 12.1683 8.645 11.165 9.905 9.905C11.165 8.645 12.1567 7.16333 12.88 5.46C13.6267 3.75667 14 1.93667 14 0C14 1.93667 14.3617 3.75667 15.085 5.46C15.8317 7.16333 16.835 8.645 18.095 9.905C19.355 11.165 20.8367 12.1683 22.54 12.915C24.2433 13.6383 26.0633 14 28 14C26.0633 14 24.2433 14.3733 22.54 15.12C20.8367 15.8433 19.355 16.835 18.095 18.095C16.835 19.355 15.8317 20.8367 15.085 22.54C14.3617 24.2433 14 26.0633 14 28Z"
      />
      <defs>
        <radialGradient
          id={id}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(2.77876 11.3795) rotate(18.6832) scale(29.8025 238.737)"
        >
          <stop offset="0.0671246" stopColor="#9168C0" />
          <stop offset="0.342551" stopColor="#5684D1" />
          <stop offset="0.672076" stopColor="#1BA1E3" />
        </radialGradient>
      </defs>
    </Svg>
  )
}

/**
 * DeepSeek's whale, on the white tile it is issued with. The tile is part of
 * the mark rather than an accident of the export — worth knowing before it is
 * dropped on a dark surface, where it reads as a white chip rather than a glyph.
 */
const DeepSeekBrandMark: Mark = (props) => (
  <Svg
    viewBox="0 0 512 509.64"
    fillRule="evenodd"
    clipRule="evenodd"
    {...props}
  >
    <path
      fill="#fff"
      d="M115.612 0h280.775C459.974 0 512 52.026 512 115.612v278.415c0 63.587-52.026 115.613-115.613 115.613H115.612C52.026 509.64 0 457.614 0 394.027V115.612C0 52.026 52.026 0 115.612 0z"
    />
    <path
      fill="#4D6BFE"
      fillRule="nonzero"
      d="M440.898 139.167c-4.001-1.961-5.723 1.776-8.062 3.673-.801.612-1.479 1.407-2.154 2.141-5.848 6.246-12.681 10.349-21.607 9.859-13.048-.734-24.192 3.368-34.04 13.348-2.093-12.307-9.048-19.658-19.635-24.37-5.54-2.449-11.141-4.9-15.02-10.227-2.708-3.795-3.447-8.021-4.801-12.185-.861-2.509-1.725-5.082-4.618-5.512-3.139-.49-4.372 2.142-5.601 4.349-4.925 9.002-6.833 18.921-6.647 28.962.432 22.597 9.972 40.597 28.932 53.397 2.154 1.47 2.707 2.939 2.032 5.082-1.293 4.41-2.832 8.695-4.186 13.105-.862 2.817-2.157 3.429-5.172 2.205-10.402-4.346-19.391-10.778-27.332-18.553-13.481-13.044-25.668-27.434-40.873-38.702a177.614 177.614 0 00-10.834-7.409c-15.512-15.063 2.032-27.434 6.094-28.902 4.247-1.532 1.478-6.797-12.251-6.736-13.727.061-26.285 4.653-42.288 10.777-2.34.92-4.801 1.593-7.326 2.142-14.527-2.756-29.608-3.368-45.367-1.593-29.671 3.305-53.368 17.329-70.788 41.272-20.928 28.785-25.854 61.482-19.821 95.59 6.34 35.943 24.683 65.704 52.876 88.974 29.239 24.123 62.911 35.943 101.32 33.677 23.329-1.346 49.307-4.468 78.607-29.27 7.387 3.673 15.142 5.144 28.008 6.246 9.911.92 19.452-.49 26.839-2.019 11.573-2.449 10.773-13.166 6.586-15.124-33.915-15.797-26.47-9.368-33.24-14.573 17.235-20.39 43.213-41.577 53.369-110.222.8-5.448.121-8.877 0-13.287-.061-2.692.553-3.734 3.632-4.041 8.494-.981 16.742-3.305 24.314-7.471 21.975-12.002 30.84-31.719 32.933-55.355.307-3.612-.061-7.348-3.879-9.245v-.003zM249.4 351.89c-32.872-25.838-48.814-34.352-55.4-33.984-6.155.368-5.048 7.41-3.694 12.002 1.415 4.532 3.264 7.654 5.848 11.634 1.785 2.634 3.017 6.551-1.784 9.493-10.587 6.55-28.993-2.205-29.856-2.635-21.421-12.614-39.334-29.269-51.954-52.047-12.187-21.924-19.267-45.435-20.435-70.542-.308-6.061 1.478-8.207 7.509-9.307 7.94-1.471 16.127-1.778 24.068-.615 33.547 4.9 62.108 19.902 86.054 43.66 13.666 13.531 24.007 29.699 34.658 45.496 11.326 16.778 23.514 32.761 39.026 45.865 5.479 4.592 9.848 8.083 14.035 10.656-12.62 1.407-33.673 1.714-48.075-9.676zm15.899-102.519c.521-2.111 2.421-3.658 4.722-3.658a4.74 4.74 0 011.661.305c.678.246 1.293.614 1.786 1.163.861.859 1.354 2.083 1.354 3.368 0 2.695-2.154 4.837-4.862 4.837a4.748 4.748 0 01-4.738-4.034 5.01 5.01 0 01.077-1.981zm47.208 26.915c-2.606.996-5.2 1.778-7.707 1.88-4.679.244-9.787-1.654-12.556-3.981-4.308-3.612-7.386-5.631-8.679-11.941-.554-2.695-.247-6.858.246-9.246 1.108-5.144-.124-8.451-3.754-11.451-2.954-2.449-6.711-3.122-10.834-3.122-1.539 0-2.954-.673-4.001-1.224-1.724-.856-3.139-3-1.785-5.634.432-.856 2.525-2.939 3.018-3.305 5.6-3.185 12.065-2.144 18.034.244 5.54 2.266 9.727 6.429 15.759 12.307 6.155 7.102 7.263 9.063 10.773 14.39 2.771 4.163 5.294 8.451 7.018 13.348.877 2.561.071 4.74-2.341 6.277-.981.625-2.109 1.044-3.191 1.458z"
    />
  </Svg>
)

const MistralBrandMark: Mark = (props) => (
  <Svg viewBox="0 0 129 91" {...props}>
    <rect x="18.292" y="0" width="18.293" height="18.123" fill="#ffd800" />
    <rect x="91.473" y="0" width="18.293" height="18.123" fill="#ffd800" />
    <rect x="18.292" y="18.121" width="36.586" height="18.123" fill="#ffaf00" />
    <rect x="73.181" y="18.121" width="36.586" height="18.123" fill="#ffaf00" />
    <rect x="18.292" y="36.243" width="91.476" height="18.122" fill="#ff8205" />
    <rect x="18.292" y="54.37" width="18.293" height="18.123" fill="#fa500f" />
    <rect x="54.883" y="54.37" width="18.293" height="18.123" fill="#fa500f" />
    <rect x="91.473" y="54.37" width="18.293" height="18.123" fill="#fa500f" />
    <rect x="0" y="72.504" width="54.89" height="18.123" fill="#e10500" />
    <rect x="73.181" y="72.504" width="54.89" height="18.123" fill="#e10500" />
  </Svg>
)

const AlibabaBrandMark: Mark = (props) => (
  <Svg viewBox="0 0 24 24" {...props}>
    <path
      fill="#FF6003"
      fillRule="evenodd"
      d="M24 14.014c-2.8 1.512-5.62 2.896-8.759 3.524-.7.139-1.476.139-2.187.043-.678-.085-1.017-.682-.776-1.31.23-.585.536-1.181.93-1.671.852-1.065 1.814-2.034 2.678-3.088a15.75 15.75 0 001.422-2.054c.306-.511.164-1.129-.372-1.384-.897-.437-1.859-.745-2.81-1.075-.11-.043-.274.074-.492.149.273.244.47.425.743.67-2.821.48-5.49 1.16-8.08 2.098-.012.053-.033.095-.023.117.383.585.208 1.032-.35 1.394a2.365 2.365 0 00-.568.522c1.706.5 3.226.213 4.68-.735-.087-.127-.175-.244-.262-.372.546.096.874.394.918.862.011.107-.054.213-.087.32-.077-.086-.175-.17-.24-.267-.045-.064-.056-.138-.088-.245-1.728 1.15-3.587 1.438-5.632.842 0 .404-.022.745.011 1.075.022.287-.098.415-.36.564-.591.362-1.204.735-1.696 1.214-.59.585-.371 1.299.427 1.597.907.34 1.859.35 2.81.234 1.126-.139 2.23-.32 3.456-.49-1.433.67-2.844 1.14-4.33 1.33-1.04.14-2.078.214-3.106-.084-1.476-.415-2.133-1.501-1.75-2.96.361-1.363 1.236-2.449 2.176-3.45 3.139-3.332 7.108-5.024 11.7-5.365 1.072-.074 2.155.064 3.16.511 1.411.639 2.002 1.99 1.313 3.354-.448.905-1.072 1.735-1.695 2.555-.612.809-1.301 1.554-1.946 2.331-.186.234-.361.48-.503.745-.274.5-.088.83.492.778 1.213-.118 2.45-.213 3.62-.511 1.716-.437 3.389-1.054 5.084-1.597.175-.043.339-.107.492-.17z"
    />
  </Svg>
)

const QwenBrandMark: Mark = (props) => {
  const id = React.useId()
  return (
    <Svg viewBox="0 0 200 200" fill="none" {...props}>
      <path
        fill={`url(#${id})`}
        d="M174.82 108.75L155.38 75L165.64 57.75C166.46 56.31 166.46 54.53 165.64 53.09L155.38 35.84C154.86 34.91 153.87 34.33 152.78 34.33H114.88L106.14 19.03C105.62 18.1 104.63 17.52 103.54 17.52H83.3C82.21 17.52 81.22 18.1 80.7 19.03L61.26 52.77H41.02C39.93 52.77 38.94 53.35 38.42 54.28L28.16 71.53C27.34 72.97 27.34 74.75 28.16 76.19L45.52 107.5L36.78 122.8C35.96 124.24 35.96 126.02 36.78 127.46L47.04 144.71C47.56 145.64 48.55 146.22 49.64 146.22H87.54L96.28 161.52C96.8 162.45 97.79 163.03 98.88 163.03H119.12C120.21 163.03 121.2 162.45 121.72 161.52L141.16 127.78H158.52C159.61 127.78 160.6 127.2 161.12 126.27L171.38 109.02C172.2 107.58 172.2 105.8 171.38 104.36L174.82 108.75Z"
      />
      <path
        fill="#fff"
        d="M119.12 163.03H98.88L87.54 144.71H49.64L61.26 126.39H80.7L38.42 55.29H61.26L83.3 19.03L93.56 37.35L83.3 55.29H161.58L151.32 72.54L170.76 106.28H151.32L141.16 88.34L101.18 163.03H119.12Z"
      />
      <path
        fill={`url(#${id})`}
        d="M127.86 79.83H76.14L101.18 122.11L127.86 79.83Z"
      />
      <defs>
        <radialGradient
          id={id}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(100 100) rotate(90) scale(100)"
        >
          <stop stopColor="#665CEE" />
          <stop offset="1" stopColor="#332E91" />
        </radialGradient>
      </defs>
    </Svg>
  )
}

/* -------------------------------------------------------------------------- */
/*  Lookups                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Company marks drawn here because Hugeicons has none. Reached before the
 * Hugeicons map below, so giving a provider its real mark later is one line
 * added here and nothing else touched.
 */
const PROVIDER_MARKS: Record<string, Mark> = {
  anthropic: AnthropicMark,
  alibaba: AlibabaMark,
  moonshot: MoonshotMark,
  vercel: VercelMark,
}

/**
 * Houses that have a mark in their own colours — and *only* those. A company
 * without one falls through to its plain mark; it never borrows a product's.
 * Anthropic is the case that makes the rule: there is a colour Claude mark and
 * no colour Anthropic mark, and putting the first here would have the provider
 * wearing its model's logo, which is the whole thing these two maps exist to
 * keep apart. Same for Google against Gemini.
 *
 * Nothing monochrome belongs here either. A mark with no colour version is
 * reached by falling through, not by being listed twice.
 */
const PROVIDER_BRAND_MARKS: Record<string, Mark> = {
  deepseek: DeepSeekBrandMark,
  mistral: MistralBrandMark,
  alibaba: AlibabaBrandMark,
}

/**
 * Company marks Hugeicons does carry, keyed by the `id` in `lib/providers`.
 * A platform wears its parent company's mark — Bedrock is Amazon's, Vertex is
 * Google's — since that is how a reader picks it out of a list.
 *
 * Two of these are a product's mark standing in for a company that has none to
 * hand: OpenAI's blossom is ChatGPT's, and xAI is wearing Grok. Both are marked
 * as stand-ins rather than passed off — swap either the moment a real corporate
 * mark turns up, by adding it to `PROVIDER_MARKS` above.
 *
 * The platforms take an abstract glyph chosen for what they are known for
 * rather than a logo traced from memory: a bolt for Groq, a circuit for
 * Cerebras, a route for OpenRouter.
 */
const PROVIDER_ICONS: Record<string, IconSvgElement> = {
  openai: ChatGptIcon,
  google: GoogleIcon,
  meta: MetaIcon,
  deepseek: DeepseekIcon,
  xai: Grok02Icon,
  mistral: MistralIcon,
  zai: Hexagon01Icon,
  cohere: Atom02Icon,
  perplexity: PerplexityAiIcon,
  bedrock: AmazonIcon,
  azure: MicrosoftIcon,
  vertex: GoogleIcon,
  groq: FlashIcon,
  cerebras: BrainCircuitIcon,
  fireworks: FireworksIcon,
  together: ConnectIcon,
  openrouter: Route01Icon,
}

/** Product marks drawn here, keyed by model family. */
const MODEL_MARKS: Record<string, Mark> = {
  grok: GrokMark,
  v0: V0Mark,
}

/**
 * Families that have a mark in their own colours, and only those — `v0` and
 * `grok` are not here, because their marks are monochrome and falling through
 * to them is the point.
 */
const MODEL_BRAND_MARKS: Record<string, Mark> = {
  claude: ClaudeBrandMark,
  gemini: GeminiBrandMark,
  gemma: GeminiBrandMark,
  deepseek: DeepSeekBrandMark,
  mistral: MistralBrandMark,
  magistral: MistralBrandMark,
  devstral: MistralBrandMark,
  codestral: MistralBrandMark,
  qwen: QwenBrandMark,
  qwq: QwenBrandMark,
}

/**
 * Product marks from Hugeicons, keyed by model *family* rather than by id — a
 * family outlives every version of itself, so `claude-opus-5` and whatever
 * replaces it both key on `claude` and neither has to be listed.
 *
 * This is where `ClaudeIcon` belongs: Claude is the product. A family with no
 * mark of its own falls back to its provider's.
 */
const MODEL_ICONS: Record<string, IconSvgElement> = {
  claude: ClaudeIcon,
  gpt: ChatGptIcon,
  o: ChatGptIcon,
  gemini: GoogleGeminiIcon,
  gemma: GoogleGeminiIcon,
  llama: MetaIcon,
  deepseek: DeepseekIcon,
  grok: Grok02Icon,
  mistral: MistralIcon,
  magistral: MistralIcon,
  devstral: MistralIcon,
  codestral: MistralIcon,
  qwen: QwenIcon,
  qwq: QwenIcon,
  kimi: KimiAiIcon,
  glm: Hexagon01Icon,
  command: Atom02Icon,
  sonar: PerplexityAiIcon,
  nova: AmazonIcon,
  phi: MicrosoftIcon,
}

/** The mark for each thing a model can do, keyed as `lib/models` names them. */
const CAPABILITY_ICONS: Record<ModelCapability, IconSvgElement> = {
  reasoning: AiBrain01Icon,
  vision: Image02Icon,
  tools: Wrench01Icon,
  search: GlobeIcon,
  code: SourceCodeIcon,
}

/**
 * The keys a model id might be filed under, most specific first: the segment
 * before the first separator, then the leading run of letters.
 *
 * Two, not one, because a family name is not always all letters. `v0-1.5-md`
 * has to find `v0`, and a letters-only rule reads it as `v`; `qwen3-max` has to
 * find `qwen`, and a whole-segment rule reads it as `qwen3`. Trying the
 * narrower key first satisfies both.
 */
function familyKeys(nameOrId: string) {
  const name = nameOrId.trim().toLowerCase()
  const segment = name.split(/[-_.\s]/)[0] ?? ""
  const letters = name.match(/^[a-z]+/)?.[0] ?? ""
  return segment === letters ? [letters] : [segment, letters]
}

/** The first key that is present in a map, or undefined. */
function lookup<T>(map: Record<string, T>, keys: string[]): T | undefined {
  for (const key of keys) {
    if (map[key]) return map[key]
  }
  return undefined
}

/**
 * The Hugeicons mark for a provider, or a neutral one. Providers drawn from
 * `PROVIDER_MARKS` are not here — use `ProviderIcon`, which covers both. This
 * is for callers that need the icon *data* rather than something rendered.
 */
export function providerIconFor(id: string): IconSvgElement {
  return PROVIDER_ICONS[id] ?? ArtificialIntelligence04Icon
}

/**
 * The Hugeicons mark for a model, by family first and by the provider that
 * ships it second. Both fall back, so an unknown model from an unknown house
 * still gets a glyph rather than a gap in the row.
 */
export function modelIconFor(
  nameOrId: string,
  providerId?: string
): IconSvgElement {
  const family = lookup(MODEL_ICONS, familyKeys(nameOrId))
  if (family) return family
  return providerId ? providerIconFor(providerId) : ArtificialIntelligence04Icon
}

export function capabilityIconFor(capability: ModelCapability): IconSvgElement {
  return CAPABILITY_ICONS[capability]
}

type IconProps = Omit<React.ComponentProps<typeof HugeiconsIcon>, "icon"> & {
  /**
   * `brand` draws the company's colours where there are any, `mono` the plain
   * mark. The defaults differ by what is being drawn: models colour, providers
   * not. Left off, each part picks its own.
   */
  set?: ModelIconSet
}

/**
 * A provider's mark, monochrome unless asked otherwise. Colour first when it
 * *is* asked for, then the drawn monochrome one, then Hugeicons — so
 * `set="brand"` never leaves a gap where a house has no colour version, it
 * falls back to that house's own plain mark rather than borrowing anyone's.
 *
 * Every mark is `aria-hidden`: the name it sits beside already says which
 * provider this is, and a glyph repeating it is one more thing read aloud for
 * nothing.
 */
function ProviderIcon({
  provider,
  set = "mono",
  className,
  ...props
}: IconProps & { provider: string }) {
  const Drawn =
    (set === "brand" ? PROVIDER_BRAND_MARKS[provider] : undefined) ??
    PROVIDER_MARKS[provider]

  if (Drawn) return <Drawn className={cn("shrink-0", className)} />

  return (
    <HugeiconsIcon
      aria-hidden
      icon={providerIconFor(provider)}
      strokeWidth={2}
      className={cn("shrink-0", className)}
      {...props}
    />
  )
}

/**
 * A model's own mark, falling back through its provider — so a house whose
 * families are all unlisted still shows the right logo, in whichever set was
 * asked for.
 *
 * Colour by default, where `ProviderIcon` is monochrome by default, and the
 * asymmetry is deliberate: a model is the thing being chosen, and its logo is
 * how it is recognised. The house is context around that choice, and a column
 * of colour beside a column of colour makes neither one stand out. Pass `set`
 * to override either.
 */
function ModelIcon({
  model,
  provider,
  set = "brand",
  className,
  ...props
}: IconProps & { model: string; provider?: string }) {
  /* Indexed straight into the maps rather than through a helper. A component
     that arrives out of a function call is one `react-hooks/static-components`
     cannot prove is stable, and it is right to ask: a component identity that
     changes between renders remounts and loses its state. Both keys are read
     inline for the same reason. */
  const [first, second = first] = familyKeys(model)
  const Drawn =
    (set === "brand"
      ? (MODEL_BRAND_MARKS[first] ?? MODEL_BRAND_MARKS[second])
      : undefined) ??
    MODEL_MARKS[first] ??
    MODEL_MARKS[second]

  if (Drawn) return <Drawn className={cn("shrink-0", className)} />

  /* No mark for the family. If the house has one, wear that rather than
     dropping to a Hugeicons glyph that says less. */
  const hasFamilyIcon = Boolean(MODEL_ICONS[first] ?? MODEL_ICONS[second])
  if (!hasFamilyIcon && provider) {
    return (
      <ProviderIcon
        provider={provider}
        set={set}
        className={className}
        {...props}
      />
    )
  }

  return (
    <HugeiconsIcon
      aria-hidden
      icon={modelIconFor(model, provider)}
      strokeWidth={2}
      className={cn("shrink-0", className)}
      {...props}
    />
  )
}

function CapabilityIcon({
  capability,
  className,
  ...props
}: Omit<IconProps, "set"> & { capability: ModelCapability }) {
  return (
    <HugeiconsIcon
      aria-hidden
      icon={capabilityIconFor(capability)}
      strokeWidth={2}
      className={cn("shrink-0", className)}
      {...props}
    />
  )
}

export {
  CAPABILITY_ICONS,
  CapabilityIcon,
  MODEL_BRAND_MARKS,
  MODEL_ICONS,
  MODEL_MARKS,
  ModelIcon,
  PROVIDER_BRAND_MARKS,
  PROVIDER_ICONS,
  PROVIDER_MARKS,
  ProviderIcon,
  familyKeys,
}
export type { ModelIconSet }
