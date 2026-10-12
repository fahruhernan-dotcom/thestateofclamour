import * as React from "react"
import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip"

export function TooltipProvider({
  children,
  delayDuration = 200,
}: {
  children: React.ReactNode
  delayDuration?: number
}) {
  return <BaseTooltip.Provider delay={delayDuration}>{children}</BaseTooltip.Provider>
}

export function Tooltip({
  children,
  ...props
}: React.ComponentProps<typeof BaseTooltip.Root>) {
  return <BaseTooltip.Root {...props}>{children}</BaseTooltip.Root>
}

export const TooltipTrigger = BaseTooltip.Trigger

export function TooltipContent({
  children,
  className = "",
  side = "top",
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof BaseTooltip.Popup> & {
  side?: "top" | "right" | "bottom" | "left"
  sideOffset?: number
}) {
  return (
    <BaseTooltip.Portal>
      <BaseTooltip.Positioner side={side} sideOffset={sideOffset}>
        <BaseTooltip.Popup
          className={`z-[10000] px-2.5 py-1 text-[11px] font-sans font-medium text-[#f5eedc] bg-[#121620] border border-white/15 rounded-md shadow-xl backdrop-blur-md animate-in fade-in-0 zoom-in-95 pointer-events-none select-none flex items-center ${className}`}
          {...props}
        >
          {children}
          <BaseTooltip.Arrow className="fill-[#121620] stroke-white/15" />
        </BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  )
}
