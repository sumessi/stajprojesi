"use client";

import { Palette, Check } from "lucide-react";
import { useTheme } from "./theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

const colorThemes = [
  { value: "default" as const, label: "Varsayılan", color: "bg-gray-500" },
  { value: "rose" as const, label: "Rose", color: "bg-rose-500" },
  { value: "sea" as const, label: "Sea", color: "bg-blue-500" },
  { value: "sun" as const, label: "Sun", color: "bg-yellow-500" },
  { value: "fire" as const, label: "Fire", color: "bg-orange-500" },
];

const darkModes = [
  { value: "dark" as const, label: "Dark", desc: "Standart karanlık" },
  { value: "oled" as const, label: "OLED", desc: "Tam siyah" },
  { value: "soft" as const, label: "Soft Dark", desc: "Göz yormayan" },
];

export function ThemeSelector() {
  const { colorTheme, setColorTheme, theme, darkMode, setDarkMode } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex w-full items-center gap-3 rounded-2xl bg-accent px-3 py-2 text-left text-sm font-medium text-foreground transition-all duration-200 hover:bg-accent/80 hover:scale-[1.02]"
          aria-label="Tema seçenekleri"
        >
          <Palette className="h-4 w-4" />
          <span>Tema</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Renk Teması</DropdownMenuLabel>
        {colorThemes.map((ct) => (
          <DropdownMenuItem
            key={ct.value}
            onClick={() => setColorTheme(ct.value)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div className={`h-4 w-4 rounded-full ${ct.color}`} />
              <span>{ct.label}</span>
            </div>
            {colorTheme === ct.value && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
        
        {theme === "dark" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Karanlık Mod Varyantı</DropdownMenuLabel>
            {darkModes.map((dm) => (
              <DropdownMenuItem
                key={dm.value}
                onClick={() => setDarkMode(dm.value)}
                className="flex items-center justify-between"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{dm.label}</span>
                  <span className="text-xs text-muted-foreground">{dm.desc}</span>
                </div>
                {darkMode === dm.value && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
