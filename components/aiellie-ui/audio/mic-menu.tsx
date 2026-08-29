"use client"

import * as React from "react"
import { Mic01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from "@/components/aiellie-ui/menu"
import { TooltipIconButton } from "@/components/aiellie-ui/tooltip-icon-button"
import { cn } from "@/lib/utils"

/**
 * Which microphone, chosen where the call is set up.
 *
 * The browser is cagey here on purpose: until the page has been granted the
 * microphone once, `enumerateDevices` returns inputs with their names
 * blanked. The menu tells the truth about that state instead of papering
 * over it — unnamed devices are numbered, and one row offers to ask for
 * access, after which the real names arrive and the list redraws. It also
 * listens for `devicechange`, so plugging a headset in while the menu is on
 * screen adds its row without a reload.
 */

export interface MicDevice {
  deviceId: string
  label: string
}

/** The system's input list, live, with unnamed entries numbered honestly. */
export function useMicDevices() {
  const [devices, setDevices] = React.useState<MicDevice[]>([])
  const [named, setNamed] = React.useState(false)

  const refresh = React.useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return
    const all = await navigator.mediaDevices.enumerateDevices()
    const inputs = all.filter((device) => device.kind === "audioinput")
    setNamed(inputs.some((device) => device.label))
    setDevices(
      inputs.map((device, index) => ({
        deviceId: device.deviceId,
        label: device.label || `Microphone ${index + 1}`,
      }))
    )
  }, [])

  React.useEffect(() => {
    /* The first read waits a beat so the effect body itself sets no state —
       after that, every redraw is the devicechange event's doing. */
    const first = setTimeout(() => void refresh(), 0)
    navigator.mediaDevices?.addEventListener("devicechange", refresh)
    return () => {
      clearTimeout(first)
      navigator.mediaDevices?.removeEventListener("devicechange", refresh)
    }
  }, [refresh])

  /** Opens the mic just long enough for the browser to reveal the names. */
  const requestNames = React.useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach((track) => track.stop())
    } catch {
      // Declined; the numbered names stand.
    }
    await refresh()
  }, [refresh])

  return { devices, named, requestNames }
}

type MicMenuContextValue = {
  value: string
  setValue: (deviceId: string) => void
  devices: MicDevice[]
  named: boolean
  requestNames: () => Promise<void>
}

const MicMenuContext = React.createContext<MicMenuContextValue | undefined>(
  undefined
)

function useMicMenuContext(part: string) {
  const context = React.useContext(MicMenuContext)
  if (!context) throw new Error(`${part} must be used within a MicMenu.`)
  return context
}

export interface MicMenuProps extends Omit<
  React.ComponentProps<typeof Menu>,
  "children"
> {
  /** The chosen `deviceId`. Empty means the system default. */
  value?: string
  defaultValue?: string
  onValueChange?: (deviceId: string) => void
  children?: React.ReactNode
}

export function MicMenu({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  children,
  ...props
}: MicMenuProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const value = valueProp ?? uncontrolled
  const { devices, named, requestNames } = useMicDevices()

  const setValue = React.useCallback(
    (next: string) => {
      if (valueProp === undefined) setUncontrolled(next)
      onValueChange?.(next)
    },
    [valueProp, onValueChange]
  )

  const context = React.useMemo(
    () => ({ value, setValue, devices, named, requestNames }),
    [value, setValue, devices, named, requestNames]
  )

  return (
    <MicMenuContext.Provider value={context}>
      <Menu data-slot="mic-menu" {...props}>
        {children}
      </Menu>
    </MicMenuContext.Provider>
  )
}

export function MicMenuTrigger({
  showLabel = false,
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenuTrigger> & { showLabel?: boolean }) {
  const { value, devices } = useMicMenuContext("MicMenuTrigger")
  const chosen = devices.find((device) => device.deviceId === value)
  const name = chosen?.label ?? "Default microphone"

  return (
    <MenuTrigger
      data-slot="mic-menu-trigger"
      aria-label={`Microphone: ${name}`}
      render={
        <TooltipIconButton
          type="button"
          tooltip={name}
          side="top"
          className={cn(
            "size-7 text-muted-foreground hover:text-foreground",
            showLabel && "w-fit max-w-44 gap-1.5 rounded-full px-2.5",
            className
          )}
        />
      }
      {...props}
    >
      {children ?? (
        <>
          <HugeiconsIcon
            icon={Mic01Icon}
            strokeWidth={1.75}
            className="size-4"
          />
          {showLabel ? <span className="truncate">{name}</span> : null}
        </>
      )}
    </MenuTrigger>
  )
}

export function MicMenuContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenuContent>) {
  const { value, setValue, devices, named, requestNames } =
    useMicMenuContext("MicMenuContent")

  return (
    <MenuContent
      data-slot="mic-menu-content"
      className={cn("w-64", className)}
      {...props}
    >
      {children ?? (
        <MenuGroup>
          <MenuGroupLabel>Microphone</MenuGroupLabel>
          {devices.length === 0 ? (
            <MenuItem disabled>No microphones found</MenuItem>
          ) : (
            <MenuRadioGroup
              value={value}
              onValueChange={(next) => setValue(String(next))}
            >
              {devices.map((device) => (
                <MenuRadioItem key={device.deviceId} value={device.deviceId}>
                  <span className="truncate">{device.label}</span>
                </MenuRadioItem>
              ))}
            </MenuRadioGroup>
          )}
          {!named && devices.length > 0 ? (
            /* The numbered names are the browser withholding, not us: one
               short grant fixes the list for good, and the row says exactly
               what pressing it will do. */
            <MenuItem closeOnClick={false} onClick={() => void requestNames()}>
              <span className="text-muted-foreground">
                Allow access to see names
              </span>
            </MenuItem>
          ) : null}
        </MenuGroup>
      )}
    </MenuContent>
  )
}
