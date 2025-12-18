import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider"
import { useTheme } from "@/hooks/use-theme";
import {
  DEFAULT_BACKGROUND,
  type BackgroundTheme,
  applyBackgroundSettingsToRoot,
  getBackgroundSettings,
  setBackgroundSettings,
} from "@/lib/background-settings";

function Settings() {
  const { theme } = useTheme();
  const [generationType, setGenerationType] = useState("local");
  const [maxResponseLength, setMaxResponseLength] = useState(240);

  const resolvedTheme: BackgroundTheme =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;

  const [appearanceTarget, setAppearanceTarget] = useState<BackgroundTheme>(resolvedTheme);

  const initialBg = getBackgroundSettings(appearanceTarget);
  const [bgLightness, setBgLightness] = useState(initialBg.lightness);
  const [bgChroma, setBgChroma] = useState(initialBg.chroma);
  const [bgDurationSec, setBgDurationSec] = useState(initialBg.durationSec);

  function loadTargetValues(target: BackgroundTheme) {
    const next = getBackgroundSettings(target);
    setBgLightness(next.lightness);
    setBgChroma(next.chroma);
    setBgDurationSec(next.durationSec);
  }

  function updateBackground(target: BackgroundTheme, next: Partial<{ lightness: number; chroma: number; durationSec: number }>) {
    setBackgroundSettings(target, next);
    applyBackgroundSettingsToRoot();

    ;(async () => {
      try {
        const { emit } = await import("@tauri-apps/api/event");
        await emit("opalchat:bg:changed");
      } catch {
        // Ignore outside Tauri
      }
    })();
  }

  function resetBackground(target: BackgroundTheme) {
    const defaults = DEFAULT_BACKGROUND[target];
    setBackgroundSettings(target, {
      lightness: defaults.lightness,
      chroma: defaults.chroma,
      durationSec: defaults.durationSec,
    });
    applyBackgroundSettingsToRoot();
    loadTargetValues(target);

    ;(async () => {
      try {
        const { emit } = await import("@tauri-apps/api/event");
        await emit("opalchat:bg:changed");
      } catch {
        // Ignore outside Tauri
      }
    })();
  }

  // function to access json settings file to populate and save settings - to be implemented
  
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <main className="min-h-screen p-5 flex flex-col gap-4">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-3xl font-bold">Settings</h1>
          <ModeToggle />
        </div>
        <p className="text-muted-foreground text-sm">Configure your preferences here.</p>
        {/* Add your settings options here */}
        <h2 className="text-2xl font-semibold">Chat</h2>
        <div id="chatbot-settings" className="space-y-2">
          <div id="text-generation-label" className="flex items-stretch py-2">
            <label
              htmlFor="text-generation"
              className="h-9 inline-flex items-center whitespace-nowrap font-semibold px-3 border rounded-l-md bg-muted text-foreground"
            >
              Text Generation
            </label>
            <div className="h-9 flex items-center border border-l-0 rounded-r-md bg-background text-foreground px-2 transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]">
              <select
                id="text-generation"
                className="h-full w-full bg-transparent px-1 text-sm outline-none"
                value={generationType}
                onChange={(e) => setGenerationType(e.target.value)}
                >
                <option className="bg-muted" value="local">Local</option>
                <option className="bg-muted" value="openai">OpenAI API</option>
                <option className="bg-muted" value="claude">Claude API</option>
                <option className="bg-muted" value="gemini">Gemini API</option>
                <option className="bg-muted" value="mistral">Mistral API</option>
              </select>
            </div>
          </div>
          <div id="max-response-length" className="flex items-stretch py-2">
            <label className="h-9 inline-flex items-center whitespace-nowrap font-semibold px-3 border rounded-l-md bg-muted text-foreground">Max Response Length</label>
            <div className="h-9 px-3 border border-l-0 bg-background flex items-center min-w-48">
              <Slider onValueChange={(value: number[]) => setMaxResponseLength(value[0])} defaultValue={[240]} max={2000} step={10} className="w-full" />
            </div>
            <label className="h-9 px-3 border border-l-0 rounded-r-md bg-background flex items-center text-sm text-muted-foreground">{maxResponseLength} tokens</label>
          </div>
        </div>
        <h2 className="text-2xl font-semibold">Appearance</h2>
        <div id="appearance-settings" className="space-y-2">
          <div className="rounded-lg border bg-background p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">Background</div>
                <div className="text-xs text-muted-foreground">Adjust the animated gradient per theme.</div>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground">Edit</label>
                <select
                  className="h-9 rounded-md border bg-background px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                  value={appearanceTarget}
                  onChange={(e) => {
                    const target = e.target.value as BackgroundTheme;
                    setAppearanceTarget(target);
                    loadTargetValues(target);
                  }}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => resetBackground(appearanceTarget)}
                >
                  Reset
                </Button>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm">Lightness</div>
                  <div className="text-xs text-muted-foreground">{Math.round(bgLightness * 100)}%</div>
                </div>
                <Slider
                  value={[Math.round(bgLightness * 100)]}
                  onValueChange={(value: number[]) => {
                    const next = value[0] / 100;
                    setBgLightness(next);
                    updateBackground(appearanceTarget, { lightness: next });
                  }}
                  min={0}
                  max={100}
                  step={1}
                />
                <div className="text-xs text-muted-foreground">
                  Default: {Math.round(DEFAULT_BACKGROUND[appearanceTarget].lightness * 100)}%
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm">Chroma</div>
                  <div className="text-xs text-muted-foreground">{bgChroma.toFixed(2)}</div>
                </div>
                <Slider
                  value={[Math.round(bgChroma * 100)]}
                  onValueChange={(value: number[]) => {
                    const next = value[0] / 100;
                    setBgChroma(next);
                    updateBackground(appearanceTarget, { chroma: next });
                  }}
                  min={0}
                  max={20}
                  step={1}
                />
                <div className="text-xs text-muted-foreground">
                  Default: {DEFAULT_BACKGROUND[appearanceTarget].chroma.toFixed(2)}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm">Animation speed</div>
                  <div className="text-xs text-muted-foreground">{bgDurationSec}s</div>
                </div>
                <Slider
                  value={[bgDurationSec]}
                  onValueChange={(value: number[]) => {
                    const next = value[0];
                    setBgDurationSec(next);
                    updateBackground(appearanceTarget, { durationSec: next });
                  }}
                  min={5}
                  max={60}
                  step={1}
                />
                <div className="text-xs text-muted-foreground">
                  Default: {DEFAULT_BACKGROUND[appearanceTarget].durationSec}s
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </ThemeProvider>
  );
}

export default Settings;
