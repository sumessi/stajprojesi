"use client"

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>
>(({ className, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(
      "peer inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200",
      "bg-gray-200 dark:bg-gray-800",
      "data-[state=checked]:bg-emerald-500 dark:data-[state=checked]:bg-emerald-500",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    <TogglePrimitive.Thumb
      className={cn(
        // boyut ve şekil
        "pointer-events-none block h-6 w-6 rounded-full shadow",

        // tema rengi
        "bg-black dark:bg-white",

        // zorunlu transform (GPU hızlandırma) + yumuşak animasyon
        "transform will-change-transform transition-transform duration-300 ease-in-out",

        // alternatif daha yumuşak istersen duration-400 ve ease-out kullan
        // hareket (Radix data attribute ile)
        "data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0"
      )}
    />
  </TogglePrimitive.Root>
))
Toggle.displayName = TogglePrimitive.Root.displayName
export { Toggle }
