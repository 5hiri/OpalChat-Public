import { useEffect, useState } from "react"
import { Theme, ThemeProviderContext } from "@/components/theme-context"
import { applyBackgroundSettingsToRoot } from "@/lib/background-settings"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement

    // Apply per-theme background overrides (if any)
    applyBackgroundSettingsToRoot(root)

    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  // Cleanup background listener on unmount
  useEffect(() => {
    let unlisten: undefined | (() => void)
    ;(async () => {
      try {
        const { listen } = await import("@tauri-apps/api/event")
        unlisten = await listen("opalchat:bg:changed", () => {
          applyBackgroundSettingsToRoot(window.document.documentElement)
        })
      } catch {
        // Ignore outside Tauri.
      }
    })()

    return () => {
      try {
        unlisten?.()
      } catch {
        // ignore
      }
    }
  }, [])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}