export type ThemeColors = {
  primary: string
  secondary: string
  accent: string
  dark: string
  muted: string
}

export const themeColors: ThemeColors = {
  primary: "#A60311",
  secondary: "#73020C",
  accent: "#8C0303",
  dark: "#590202",
  muted: "#BF9F9F",
}

export function applyTheme(colors: ThemeColors) {
  if (typeof document === "undefined") return
  const root = document.documentElement
  root.style.setProperty("--color-primary", colors.primary)
  root.style.setProperty("--color-secondary", colors.secondary)
  root.style.setProperty("--color-accent", colors.accent)
  root.style.setProperty("--color-dark", colors.dark)
  root.style.setProperty("--color-muted", colors.muted)
}

export function currentTheme(): ThemeColors {
  if (typeof document === "undefined") return themeColors
  const cs = getComputedStyle(document.documentElement)
  return {
    primary: cs.getPropertyValue("--color-primary").trim() || themeColors.primary,
    secondary: cs.getPropertyValue("--color-secondary").trim() || themeColors.secondary,
    accent: cs.getPropertyValue("--color-accent").trim() || themeColors.accent,
    dark: cs.getPropertyValue("--color-dark").trim() || themeColors.dark,
    muted: cs.getPropertyValue("--color-muted").trim() || themeColors.muted,
  }
}

export const errorStyles = {
  codeText: { color: "var(--color-primary)" },
  primaryButton: {
    backgroundColor: "var(--color-primary)",
    color: "#fff",
  },
  primaryButtonHover: {
    backgroundColor: "var(--color-accent)",
  },
}

export type ThemeMode = "light" | "dark"

export function setThemeMode(mode: ThemeMode) {
  if (typeof document === "undefined") return
  const root = document.documentElement
  if (mode === "dark") {
    root.style.setProperty("--background", "#0a0a0a")
    root.style.setProperty("--foreground", "#ededed")
    root.style.setProperty("--color-dark", "#ededed")
    root.style.setProperty("--color-title", "#ffffff")
  } else {
    root.style.setProperty("--background", "#ffffff")
    root.style.setProperty("--foreground", "#171717")
    root.style.setProperty("--color-dark", "#590202")
    root.style.setProperty("--color-title", themeColors.secondary)
  }
}

export function enableThemeSmoothTransition(ms = 300) {
  if (typeof document === "undefined") return
  const root = document.documentElement
  root.classList.add("theme-transition")
  window.setTimeout(() => {
    root.classList.remove("theme-transition")
  }, ms)
}

export function getInitialThemeMode(): ThemeMode {
  const stored =
    typeof localStorage !== "undefined" ? (localStorage.getItem("themeMode") as ThemeMode | null) : null
  if (stored === "light" || stored === "dark") return stored
  const prefersDark =
    typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches
  return prefersDark ? "dark" : "light"
}
