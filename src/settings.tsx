import "@/styles/globals.css";
import { ModeToggle } from "@/components/mode-toggle";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider"
import { useTheme } from "@/hooks/use-theme";
import { Separator } from "@/components/ui/separator";
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
    <main className="h-screen min-h-0 p-4">
      <div className="mx-auto flex h-full min-h-0 w-full max-w-4xl flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
              <p className="text-sm text-muted-foreground">Configure your preferences here.</p>
            </div>
            <ModeToggle />
          </div>

          <Separator />

          <div className="opal-scrollbar flex-1 min-h-0 overflow-y-auto pr-1">
            <div className="space-y-6">
              <section className="space-y-3">
                <h2 className="text-xl font-semibold tracking-tight">Chat</h2>
                <div id="chatbot-settings" className="rounded-xl border bg-background p-4 text-foreground shadow-sm">
                  <div className="space-y-1">
                    <div className="text-sm font-semibold">Chatbot</div>
                    <div className="text-xs text-muted-foreground">Adjust response behavior and generation source.</div>
                  </div>
                  <Separator className="my-4" />

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <label htmlFor="text-generation" className="text-sm font-medium">Text generation</label>
                        <div className="text-xs text-muted-foreground">Choose where responses come from</div>
                      </div>
                      <div className="flex items-center rounded-md border bg-background px-2 transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]">
                        <select
                          id="text-generation"
                          className="h-9 w-full bg-transparent px-1 text-sm outline-none"
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

                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-medium">Max response length</div>
                        <div className="text-xs text-muted-foreground">{maxResponseLength} tokens</div>
                      </div>
                      <Slider
                        value={[maxResponseLength]}
                        onValueChange={(value: number[]) => setMaxResponseLength(value[0])}
                        max={2000}
                        step={10}
                      />
                      <div className="text-xs text-muted-foreground">Higher values may increase generation time.</div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold tracking-tight">Appearance</h2>
                <div id="appearance-settings" className="space-y-2">
                  <div className="rounded-xl border bg-background p-4 shadow-sm">
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
              </section>
            </div>
          </div>
      </div>
    </main>
  );
}

export default Settings;
