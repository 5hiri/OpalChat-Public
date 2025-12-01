import React from "react";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { useState } from "react";

import { Slider } from "@/components/ui/slider"

function Settings() {
  console.log("Settings component rendered!");
  const [generationType, setGenerationType] = useState("");
  const [maxResponseLength, setMaxResponseLength] = useState(240);

  // function to access json settings file to populate and save settings - to be implemented
  
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <main className="py-5 px-5 flex flex-col min-h-screen">
        <div className="flex mb-4 w-full justify-between">
          <h1 className="text-3xl font-bold ">Settings</h1>
          <ModeToggle />
        </div>
        <p className="text-muted-foreground text-sm">Configure your preferences here.</p>
        {/* Add your settings options here */}
        <h2 className="text-2xl font-semibold mb-1 mt-2">Chat</h2>
        <div id="chatbot-settings">
          <div id="text-generation-label" className="flex-row py-2 flex items-stretch">
            <label htmlFor="text-generation" className="font-semibold px-3 py-1 border rounded-l-md bg-muted text-foreground">Text Generation</label>
            <div className="px-3 py-1 border rounded-r-md bg-background text-foreground">
              <select
                id="text-generation"
                className=""
                defaultValue="local"
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
          <div id="max-response-length" className="flex-row py-2 flex items-stretch">
            <label className="font-semibold px-3 py-1 border rounded-l-md bg-muted text-foreground flex items-center">Max Response Length</label>
            <div className="px-3 py-1 border border-l-0 bg-background flex items-center min-w-48">
              <Slider onValueChange={(value: number[]) => setMaxResponseLength(value[0])} defaultValue={[240]} max={2000} step={10} className="w-full" />
            </div>
            <label className="px-3 py-1 border border-l-0 rounded-r-md bg-background flex items-center">{maxResponseLength} tokens</label>
          </div>
        </div>
      </main>
    </ThemeProvider>
  );
}

export default Settings;
