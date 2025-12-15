"use client";

import * as React from "react";

type Theme = "dark" | "light";
type ColorTheme = "default" | "rose" | "sea" | "sun" | "fire";
type DarkMode = "dark" | "oled" | "soft";

type ThemeProviderProps = {
  children: React.ReactNode;
};

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
  darkMode: DarkMode;
  setDarkMode: (mode: DarkMode) => void;
};

const ThemeContext = React.createContext<ThemeContextType | undefined>(
  undefined
);

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>("dark");
  const [colorTheme, setColorTheme] = React.useState<ColorTheme>("default");
  const [darkMode, setDarkMode] = React.useState<DarkMode>("dark");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as Theme;
    const savedColorTheme = localStorage.getItem("colorTheme") as ColorTheme;
    const savedDarkMode = localStorage.getItem("darkMode") as DarkMode;
    
    if (savedTheme) setTheme(savedTheme);
    if (savedColorTheme) setColorTheme(savedColorTheme);
    if (savedDarkMode) setDarkMode(savedDarkMode);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;
    
    const root = window.document.documentElement;
    
    // Tüm tema class'larını temizle
    root.classList.remove("light", "dark", "oled", "soft", "default", "rose", "sea", "sun", "fire");
    
    // Yeni temaları ekle
    root.classList.add(theme);
    root.classList.add(colorTheme);
    
    // Dark mode varyantı ekle
    if (theme === "dark") {
      root.classList.add(darkMode);
    }
    
    // LocalStorage'a kaydet
    localStorage.setItem("theme", theme);
    localStorage.setItem("colorTheme", colorTheme);
    localStorage.setItem("darkMode", darkMode);
  }, [theme, colorTheme, darkMode, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colorTheme, setColorTheme, darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
