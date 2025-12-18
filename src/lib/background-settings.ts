export type BackgroundTheme = "light" | "dark"

const LS_KEYS = {
  lightness: {
    light: "opalchat:bg:lightness:light",
    dark: "opalchat:bg:lightness:dark",
  },
  chroma: {
    light: "opalchat:bg:chroma:light",
    dark: "opalchat:bg:chroma:dark",
  },
  durationSec: {
    light: "opalchat:bg:durationSec:light",
    dark: "opalchat:bg:durationSec:dark",
  },
} as const

export const DEFAULT_BACKGROUND = {
  light: {
    lightness: 0.8,
    chroma: 0.1,
    durationSec: 20,
  },
  dark: {
    lightness: 0.1,
    chroma: 0.08,
    durationSec: 20,
  },
} as const

export type BackgroundSettings = {
  lightness: number
  chroma: number
  durationSec: number
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function readNumber(key: string): number | null {
  const raw = localStorage.getItem(key)
  if (!raw) return null
  const value = Number(raw)
  return Number.isFinite(value) ? value : null
}

export function getBackgroundSettings(theme: BackgroundTheme): BackgroundSettings {
  const defaults = DEFAULT_BACKGROUND[theme]

  const lightness = readNumber(LS_KEYS.lightness[theme]) ?? defaults.lightness
  const chroma = readNumber(LS_KEYS.chroma[theme]) ?? defaults.chroma
  const durationSec = readNumber(LS_KEYS.durationSec[theme]) ?? defaults.durationSec

  return {
    lightness: clamp(lightness, 0, 1),
    chroma: clamp(chroma, 0, 0.2),
    durationSec: clamp(durationSec, 3, 120),
  }
}

export function setBackgroundSettings(theme: BackgroundTheme, next: Partial<BackgroundSettings>) {
  const current = getBackgroundSettings(theme)
  const merged: BackgroundSettings = { ...current, ...next }

  localStorage.setItem(LS_KEYS.lightness[theme], String(clamp(merged.lightness, 0, 1)))
  localStorage.setItem(LS_KEYS.chroma[theme], String(clamp(merged.chroma, 0, 0.2)))
  localStorage.setItem(
    LS_KEYS.durationSec[theme],
    String(clamp(merged.durationSec, 3, 120))
  )
}

export function applyBackgroundSettingsToRoot(root: HTMLElement = document.documentElement) {
  const light = getBackgroundSettings("light")
  const dark = getBackgroundSettings("dark")

  root.style.setProperty("--bg-lightness-light", String(light.lightness))
  root.style.setProperty("--bg-chroma-light", String(light.chroma))
  root.style.setProperty("--bg-anim-duration-light", `${light.durationSec}s`)

  root.style.setProperty("--bg-lightness-dark", String(dark.lightness))
  root.style.setProperty("--bg-chroma-dark", String(dark.chroma))
  root.style.setProperty("--bg-anim-duration-dark", `${dark.durationSec}s`)
}
