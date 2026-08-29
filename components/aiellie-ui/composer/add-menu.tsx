"use client"

import * as React from "react"
import {
  Add01Icon,
  Camera01Icon,
  CanvasIcon,
  ChartLineData01Icon,
  Clock01Icon,
  Doc01Icon,
  DropboxIcon,
  FigmaIcon,
  File01Icon,
  Folder01Icon,
  GitBranchIcon,
  GitPullRequestIcon,
  Github01Icon,
  GoogleDriveIcon,
  Image01Icon,
  Layers01Icon,
  Link02Icon,
  Mic01Icon,
  Note01Icon,
  Notion01Icon,
  PaintBoardIcon,
  Pdf01Icon,
  PlugSocketIcon,
  ScreenShareIcon,
  Settings01Icon,
  SourceCodeIcon,
  Upload01Icon,
  Xls01Icon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuLinkItem,
  MenuSeparator,
  MenuShortcut,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "@/components/aiellie-ui/menu"
import { TooltipIconButton } from "@/components/aiellie-ui/tooltip-icon-button"
import { cn } from "@/lib/utils"

/**
 * The plus on a composer: everything a message can carry that is not typed.
 * A file, a photo, a link, a thing to make — the one control that stands for
 * all of them, because a row of glyphs for each would be a toolbar, and a
 * toolbar is a menu that has been unfolded onto the composer and left there.
 *
 * It is a **tree**, not a list, and that is the whole of what this file is for.
 * "Attach a file" is one word to the person clicking it and four decisions to
 * the app underneath — which connector, whose account, which folder, which
 * file — and a flat menu answers the first by throwing a dialog at the other
 * three. Here the connector, the account and the folder are rows in the same
 * menu, each one opening the next, so the whole path is walked without a
 * modal ever being opened.
 *
 * So the catalogue is a tree and the menu is written from it: an entry with
 * `items` is a submenu, at whatever depth it sits, and nothing here counts
 * levels. Adding a folder under a connector is one entry in the data and no
 * edit to the parts.
 *
 * The surface is `menu`'s, whole — the popup, the rows, the rule between runs.
 * What this file adds is the shape (a tree), the trigger (a plus that says
 * nothing about what is behind it, because it stands for all of it), and the
 * one thing a menu has no opinion about: that a choice made four levels down
 * is reported to the composer as a single entry, not as a path it has to walk
 * back up.
 */

interface AddAction {
  /** What the choice is reported and stored as. Unique across the whole tree. */
  id: string
  /** The word on the row. */
  label: string
  icon?: IconSvgElement
  /**
   * A second line under the label. Deliberately rare: a menu of words is
   * scanned, and a sentence on every row turns scanning back into reading.
   * Worth it where a row cannot say for itself why it is the way it is — the
   * reason something is disabled, mainly.
   */
  description?: string
  /** The keystroke that does the same thing, set at the end of the row. */
  shortcut?: string
  disabled?: boolean
  /** Drawn in the destructive tone, for the entry that takes something away. */
  variant?: "default" | "destructive"
  /** Makes the row a real link, so a modified click still opens a tab. */
  href?: string
  /**
   * The heading it stands under, within its own level. Entries carrying the
   * same one in a row are gathered under it; the rest stand on their own.
   */
  group?: string
  /** What it opens rather than what it does. Any depth. */
  items?: AddAction[]
  /** What this one entry does. The menu's own `onSelect` hears about it too. */
  onSelect?: (action: AddAction) => void
}

/**
 * The default tree: what a chat composer's plus offers when it is handed
 * nothing of its own.
 *
 * Three headings, in the order the decision is usually made — what the message
 * carries, what the answer gets to look at, what the message is asking to be
 * made — and under the connectors a run that goes four deep, because that is
 * the case this element exists for and a catalogue that never nests would be
 * demonstrating the wrong thing.
 */
const addActions: AddAction[] = [
  {
    id: "upload",
    group: "Attach",
    label: "Upload a file",
    icon: Upload01Icon,
    shortcut: "⇧⌘U",
  },
  {
    id: "photos",
    group: "Attach",
    label: "Photos",
    icon: Image01Icon,
    items: [
      { id: "photos-library", label: "From this device", icon: Image01Icon },
      { id: "photos-camera", label: "Take a photo", icon: Camera01Icon },
      {
        id: "photos-screen",
        label: "Capture the screen",
        icon: ScreenShareIcon,
        shortcut: "⇧⌘4",
      },
    ],
  },
  {
    id: "audio",
    group: "Attach",
    label: "Record audio",
    icon: Mic01Icon,
    disabled: true,
    description: "The browser has not been given the microphone.",
  },
  {
    id: "connectors",
    group: "Attach",
    label: "From a connector",
    icon: PlugSocketIcon,
    items: [
      {
        id: "drive",
        group: "Connected",
        label: "Google Drive",
        icon: GoogleDriveIcon,
        items: [
          {
            id: "drive-recent",
            label: "Recent",
            icon: Clock01Icon,
            items: [
              { id: "drive-roadmap", label: "Roadmap.pdf", icon: Pdf01Icon },
              { id: "drive-budget", label: "Budget.xlsx", icon: Xls01Icon },
              { id: "drive-kickoff", label: "Kickoff.docx", icon: Doc01Icon },
            ],
          },
          { id: "drive-browse", label: "Browse Drive…", icon: Folder01Icon },
        ],
      },
      {
        id: "dropbox",
        group: "Connected",
        label: "Dropbox",
        icon: DropboxIcon,
      },
      {
        id: "github",
        group: "Connected",
        label: "GitHub",
        icon: Github01Icon,
        items: [
          { id: "github-repo", label: "A repository", icon: SourceCodeIcon },
          { id: "github-branch", label: "A branch", icon: GitBranchIcon },
          {
            id: "github-pull",
            label: "A pull request",
            icon: GitPullRequestIcon,
          },
        ],
      },
      { id: "notion", group: "Connected", label: "Notion", icon: Notion01Icon },
      { id: "figma", group: "Connected", label: "Figma", icon: FigmaIcon },
      {
        id: "connectors-manage",
        label: "Manage connectors…",
        icon: Settings01Icon,
        href: "#",
      },
    ],
  },
  {
    id: "link",
    group: "Context",
    label: "Paste a link",
    icon: Link02Icon,
    shortcut: "⌘L",
  },
  {
    id: "project",
    group: "Context",
    label: "Project files",
    icon: Folder01Icon,
    items: [
      { id: "project-file", label: "This file", icon: File01Icon },
      { id: "project-tabs", label: "Open tabs", icon: Layers01Icon },
      { id: "project-browse", label: "Browse…", icon: Folder01Icon },
    ],
  },
  { id: "image", group: "Create", label: "Image", icon: PaintBoardIcon },
  { id: "chart", group: "Create", label: "Chart", icon: ChartLineData01Icon },
  { id: "document", group: "Create", label: "Document", icon: Note01Icon },
  { id: "canvas", group: "Create", label: "Canvas", icon: CanvasIcon },
]

/**
 * The entry an id names, wherever in the tree it sits, or nothing. Depth-first
 * and by id alone, so a composer holding onto a choice never has to remember
 * the path it came down — which is the point of reporting whole entries rather
 * than paths in the first place.
 */
function findAddAction(
  id: string,
  actions: AddAction[] = addActions
): AddAction | undefined {
  for (const action of actions) {
    if (action.id === id) return action
    const found = action.items && findAddAction(id, action.items)
    if (found) return found
  }
  return undefined
}

/**
 * One level, cut into the runs it is drawn as: neighbours sharing a heading
 * stay together under it, and everything else stands on its own.
 *
 * A run breaks the moment the heading changes and a heading that comes back
 * later opens a second run rather than rejoining the first. The catalogue's
 * order is the menu's order, always: an entry silently teleporting up the list
 * to join its label is worse than a heading appearing twice, which is at least
 * the author's own doing and visible in the data.
 */
function runsOf(actions: AddAction[]) {
  const runs: { group?: string; actions: AddAction[] }[] = []
  for (const action of actions) {
    const last = runs[runs.length - 1]
    if (last && last.group === action.group) last.actions.push(action)
    else runs.push({ group: action.group, actions: [action] })
  }
  return runs
}

type AddMenuContextValue = {
  actions: AddAction[]
  select: (action: AddAction) => void
}

const AddMenuContext = React.createContext<AddMenuContextValue | undefined>(
  undefined
)

function useAddMenuContext(part: string) {
  const context = React.useContext(AddMenuContext)
  if (!context) {
    throw new Error(`${part} must be used within an AddMenu.`)
  }
  return context
}

type AddMenuProps = Omit<React.ComponentProps<typeof Menu>, "children"> & {
  /** The tree to offer. Defaults to the catalogue above. */
  actions?: AddAction[]
  /**
   * What was chosen — the entry itself, from whatever depth it was reached.
   * Called after the entry's own `onSelect`, and for every choice in the tree,
   * so a composer that only wants to know *that* something was added writes
   * one handler rather than one per leaf.
   */
  onSelect?: (action: AddAction) => void
  children?: React.ReactNode
}

function AddMenu({
  actions = addActions,
  onSelect,
  children,
  ...props
}: AddMenuProps) {
  const select = React.useCallback(
    (action: AddAction) => {
      action.onSelect?.(action)
      onSelect?.(action)
    },
    [onSelect]
  )

  const context = React.useMemo(() => ({ actions, select }), [actions, select])

  return (
    <AddMenuContext.Provider value={context}>
      <Menu data-slot="add-menu" {...props}>
        {children}
      </Menu>
    </AddMenuContext.Provider>
  )
}

/**
 * The way in: a plus, and nothing else. It carries no count and no state —
 * unlike the pickers next door there is nothing here to be in, only things to
 * be done, and a plus wearing a badge would be claiming otherwise.
 *
 * It turns forty-five degrees while the menu is open, which makes it the cross
 * that shuts what it opened. Cheap, and it saves the one move everybody makes
 * anyway: going back to the control they came from rather than hunting for
 * empty page to click on.
 *
 * `TooltipIconButton` is the control, as on every other composer menu: ghost,
 * round, and carrying its name on a hover. `render` is passed straight
 * through, so a composer with a control of its own keeps it and only borrows
 * the behaviour.
 */
function AddMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenuTrigger>) {
  return (
    <MenuTrigger
      data-slot="add-menu-trigger"
      aria-label="Add"
      render={
        <TooltipIconButton
          type="button"
          tooltip="Add"
          side="top"
          className={cn(
            "size-7 rounded-full text-muted-foreground hover:text-foreground",
            // On the glyph rather than the button: the button is round, so
            // turning it would move nothing but its focus ring.
            "[&>svg]:transition-transform [&>svg]:duration-200 aria-expanded:[&>svg]:rotate-45 motion-reduce:[&>svg]:transition-none",
            className
          )}
        />
      }
      {...props}
    >
      {children ?? (
        <HugeiconsIcon
          aria-hidden
          icon={Add01Icon}
          strokeWidth={1.75}
          className="size-4"
        />
      )}
    </MenuTrigger>
  )
}

/**
 * What every row holds, whether it does something, opens something or goes
 * somewhere — so the three kinds line up with each other down the menu instead
 * of each arranging its own glyph and word.
 *
 * The description is dimmed by opacity rather than given a colour of its own,
 * so it stays a shade of whatever the row currently is: muted at rest, the
 * foreground under the pointer, the destructive tone on the row that takes
 * something away. A hard-coded `text-muted-foreground` would come apart on
 * every one of those.
 */
function AddMenuRowContent({ action }: { action: AddAction }) {
  return (
    <>
      {action.icon ? (
        <HugeiconsIcon
          aria-hidden
          icon={action.icon}
          strokeWidth={1.75}
          className="mt-px size-4 shrink-0 opacity-80"
        />
      ) : null}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate">{action.label}</span>
        {action.description ? (
          <span className="text-[11px] leading-4 font-normal text-balance opacity-70">
            {action.description}
          </span>
        ) : null}
      </span>
    </>
  )
}

/**
 * One entry, drawn as whichever of the three kinds it turns out to be: a row
 * that opens another menu, a row that goes somewhere, or a row that does
 * something. The branch is on the data, not on the caller, which is what lets
 * a whole tree be handed in at the root and nothing be written per level.
 *
 * A submenu row gets no shortcut even when the entry carries one: `menu` puts
 * a chevron at the end of a submenu trigger, and a keystroke competing with it
 * for the same end of the row would say the row can be pressed for something,
 * when all it can do is open. Give the shortcut to the leaf it would land on.
 */
function AddMenuItem({
  action,
  className,
}: {
  action: AddAction
  className?: string
}) {
  const { select } = useAddMenuContext("AddMenuItem")

  if (action.items?.length) {
    return (
      <MenuSub>
        <MenuSubTrigger
          data-slot="add-menu-sub-trigger"
          disabled={action.disabled}
          className={cn("items-start", className)}
        >
          <AddMenuRowContent action={action} />
        </MenuSubTrigger>
        <MenuSubContent>
          <AddMenuList actions={action.items} />
        </MenuSubContent>
      </MenuSub>
    )
  }

  if (action.href) {
    return (
      <MenuLinkItem
        data-slot="add-menu-link-item"
        href={action.href}
        // Base UI holds the menu open on a link by default. Right for a menu
        // that opens things in tabs beside it, wrong for a composer's: the
        // page underneath is about to change, and a menu left standing over it
        // belongs to the page that has gone.
        closeOnClick
        onClick={() => select(action)}
        className={cn("items-start", className)}
      >
        <AddMenuRowContent action={action} />
        {action.shortcut ? (
          <MenuShortcut>{action.shortcut}</MenuShortcut>
        ) : null}
      </MenuLinkItem>
    )
  }

  return (
    <MenuItem
      data-slot="add-menu-item"
      variant={action.variant}
      disabled={action.disabled}
      onClick={() => select(action)}
      className={cn("items-start", className)}
    >
      <AddMenuRowContent action={action} />
      {action.shortcut ? <MenuShortcut>{action.shortcut}</MenuShortcut> : null}
    </MenuItem>
  )
}

/**
 * One level of the tree. Recursive by way of `AddMenuItem`, so the same twenty
 * lines draw the top of the menu and the folder four levels under it.
 *
 * A run under a heading is already set apart by the heading, so it gets no
 * rule as well; a run without one gets the rule instead. Either way a level
 * never carries two marks for the same break, and never opens with one.
 */
function AddMenuList({ actions }: { actions: AddAction[] }) {
  return (
    <>
      {runsOf(actions).map((run, index) => (
        <React.Fragment key={`${run.group ?? ""}-${index}`}>
          {index > 0 && !run.group ? <MenuSeparator /> : null}
          {run.group ? (
            <MenuGroup>
              <MenuGroupLabel>{run.group}</MenuGroupLabel>
              {run.actions.map((action) => (
                <AddMenuItem key={action.id} action={action} />
              ))}
            </MenuGroup>
          ) : (
            run.actions.map((action) => (
              <AddMenuItem key={action.id} action={action} />
            ))
          )}
        </React.Fragment>
      ))}
    </>
  )
}

/**
 * The menu itself, written from the tree unless something else is handed in.
 *
 * Wider than `menu`'s minimum, because these rows are not bare words: several
 * end in a keystroke, and a name squeezed against its own shortcut is a name
 * that gets truncated the first time a catalogue with longer entries is handed
 * in. The submenus are left to size themselves — a folder of filenames and a
 * list of five connectors have no reason to be the same width.
 */
function AddMenuContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenuContent>) {
  const { actions } = useAddMenuContext("AddMenuContent")

  return (
    <MenuContent
      data-slot="add-menu-content"
      className={cn("w-60 max-w-[calc(100vw-2rem)]", className)}
      {...props}
    >
      {children ?? <AddMenuList actions={actions} />}
    </MenuContent>
  )
}

export {
  AddMenu,
  AddMenuContent,
  AddMenuItem,
  AddMenuList,
  AddMenuTrigger,
  addActions,
  findAddAction,
}
export type { AddAction, AddMenuProps }
