type ColorToken = {
  /** Token name, matching the suffix of the Tailwind utility. */
  name: string
  /** The CSS custom property the token reads from. */
  cssVar: string
  /** Full background utility, written out so Tailwind detects the class. */
  className: string
}

type ColorGroup = {
  name: string
  description: string
  tokens: ColorToken[]
}

const colorGroups: ColorGroup[] = [
  {
    name: "Surface",
    description: "Page, card and popover backgrounds with their text colors.",
    tokens: [
      {
        name: "background",
        cssVar: "--background",
        className: "bg-background",
      },
      {
        name: "foreground",
        cssVar: "--foreground",
        className: "bg-foreground",
      },
      { name: "card", cssVar: "--card", className: "bg-card" },
      {
        name: "card-foreground",
        cssVar: "--card-foreground",
        className: "bg-card-foreground",
      },
      { name: "popover", cssVar: "--popover", className: "bg-popover" },
      {
        name: "popover-foreground",
        cssVar: "--popover-foreground",
        className: "bg-popover-foreground",
      },
    ],
  },
  {
    name: "Brand",
    description:
      "Primary, secondary and accent pairs used by interactive parts.",
    tokens: [
      { name: "primary", cssVar: "--primary", className: "bg-primary" },
      {
        name: "primary-foreground",
        cssVar: "--primary-foreground",
        className: "bg-primary-foreground",
      },
      { name: "secondary", cssVar: "--secondary", className: "bg-secondary" },
      {
        name: "secondary-foreground",
        cssVar: "--secondary-foreground",
        className: "bg-secondary-foreground",
      },
      { name: "accent", cssVar: "--accent", className: "bg-accent" },
      {
        name: "accent-foreground",
        cssVar: "--accent-foreground",
        className: "bg-accent-foreground",
      },
    ],
  },
  {
    name: "State",
    description:
      "Low emphasis surfaces and destructive states. Translucent tokens show the dotted backdrop.",
    tokens: [
      { name: "muted", cssVar: "--muted", className: "bg-muted" },
      {
        name: "muted-foreground",
        cssVar: "--muted-foreground",
        className: "bg-muted-foreground",
      },
      {
        name: "destructive",
        cssVar: "--destructive",
        className: "bg-destructive",
      },
      {
        name: "destructive-foreground",
        cssVar: "--destructive-foreground",
        className: "bg-destructive-foreground",
      },
    ],
  },
  {
    name: "Lines",
    description: "Borders, field outlines and the focus ring.",
    tokens: [
      { name: "border", cssVar: "--border", className: "bg-border" },
      { name: "input", cssVar: "--input", className: "bg-input" },
      { name: "ring", cssVar: "--ring", className: "bg-ring" },
    ],
  },
  {
    name: "Charts",
    description: "Ordered series colors for data visualisation.",
    tokens: [
      { name: "chart-1", cssVar: "--chart-1", className: "bg-chart-1" },
      { name: "chart-2", cssVar: "--chart-2", className: "bg-chart-2" },
      { name: "chart-3", cssVar: "--chart-3", className: "bg-chart-3" },
      { name: "chart-4", cssVar: "--chart-4", className: "bg-chart-4" },
      { name: "chart-5", cssVar: "--chart-5", className: "bg-chart-5" },
    ],
  },
  {
    name: "Sidebar",
    description: "A parallel scale so navigation can sit apart from the page.",
    tokens: [
      { name: "sidebar", cssVar: "--sidebar", className: "bg-sidebar" },
      {
        name: "sidebar-foreground",
        cssVar: "--sidebar-foreground",
        className: "bg-sidebar-foreground",
      },
      {
        name: "sidebar-primary",
        cssVar: "--sidebar-primary",
        className: "bg-sidebar-primary",
      },
      {
        name: "sidebar-primary-foreground",
        cssVar: "--sidebar-primary-foreground",
        className: "bg-sidebar-primary-foreground",
      },
      {
        name: "sidebar-accent",
        cssVar: "--sidebar-accent",
        className: "bg-sidebar-accent",
      },
      {
        name: "sidebar-accent-foreground",
        cssVar: "--sidebar-accent-foreground",
        className: "bg-sidebar-accent-foreground",
      },
      {
        name: "sidebar-border",
        cssVar: "--sidebar-border",
        className: "bg-sidebar-border",
      },
      {
        name: "sidebar-ring",
        cssVar: "--sidebar-ring",
        className: "bg-sidebar-ring",
      },
    ],
  },
  {
    name: "Selection",
    description: "Text selection pair and the anchor hover color.",
    tokens: [
      { name: "selection", cssVar: "--selection", className: "bg-selection" },
      {
        name: "selection-foreground",
        cssVar: "--selection-foreground",
        className: "bg-selection-foreground",
      },
      { name: "link", cssVar: "--link", className: "bg-link" },
    ],
  },
]

/** Every token, flattened, for lookups that do not care about grouping. */
const colorTokens = colorGroups.flatMap((group) => group.tokens)

export { colorGroups, colorTokens }
export type { ColorGroup, ColorToken }
