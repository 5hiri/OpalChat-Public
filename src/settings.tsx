import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { useState } from "react";

import { Slider } from "@/components/ui/slider"

function Settings() {
  const [generationType, setGenerationType] = useState("local");
  const [maxResponseLength, setMaxResponseLength] = useState(240);

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
          {/* Appearance settings can go here */}
        </div>
      </main>
    </ThemeProvider>
  );
}

export default Settings;
