/* Theme metadata and the hook intentionally live beside the provider so every
   screen reads from one shared theme contract. */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";

export const THEMES = [
  {
    id: "njp",
    name: "Emerald Executive",
    tagline: "Signature Forest & Slate Workspace",
    category: "Signature Default",
    accent: "#8FA985",
    swatches: ["#0F172B", "#1E2B3B", "#4A6741", "#8FA985"],
    isDark: true,
  },
  {
    id: "white",
    name: "Pure White Pro",
    tagline: "Ultra-Clean Minimalist Day Mode",
    category: "Executive Light",
    accent: "#059669",
    swatches: ["#F8FAFC", "#FFFFFF", "#0F172A", "#059669"],
    isDark: false,
  },
  {
    id: "luxury-gold",
    name: "Obsidian & Gold",
    tagline: "Midnight VIP Barbershop Lounge",
    category: "Ultra Luxury",
    accent: "#D4AF37",
    swatches: ["#090A0E", "#14171F", "#C59B27", "#E8CD82"],
    isDark: true,
  },
  {
    id: "royal-indigo",
    name: "Royal Indigo",
    tagline: "High-Tech Electric Violet SaaS",
    category: "Next-Gen Tech",
    accent: "#818CF8",
    swatches: ["#070B14", "#0E1626", "#4F46E5", "#38BDF8"],
    isDark: true,
  },
  {
    id: "stealth-titanium",
    name: "Titanium Stealth",
    tagline: "Minimalist Apple / Monochromatic Pro",
    category: "Studio Precision",
    accent: "#FAFAFA",
    swatches: ["#09090B", "#141417", "#E4E4E7", "#FAFAFA"],
    isDark: true,
  },
];

const ThemeContext = createContext({
  theme: "njp",
  setTheme: () => {},
  themes: THEMES,
  currentTheme: THEMES[0],
});

export function ThemeProvider({ children }) {
  // Always open the app in its signature NJP palette. Theme selection remains
  // available for the current visit without an old browser preference taking
  // over the default experience.
  const [theme, setThemeState] = useState("njp");

  const currentTheme = THEMES.find((t) => t.id === theme) || THEMES[0];

  const setTheme = (newThemeId) => {
    if (THEMES.some((t) => t.id === newThemeId)) {
      setThemeState(newThemeId);
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);

    if (currentTheme.isDark) {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }
  }, [theme, currentTheme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        themes: THEMES,
        currentTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
