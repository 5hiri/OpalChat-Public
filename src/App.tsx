import React from "react";
import { useState } from "react";
import ReactDOM from "react-dom/client";
import reactLogo from "@/assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
// import "@/styles/App.css";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";

import { Button } from "./components/ui/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";


function App() {
  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  async function openSettings() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    await invoke("open_settings_window");
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <main className="mx-auto p-10 flex flex-col items-center justify-center min-h-screen">
        <div id="theme-toggle" className="absolute top-4 right-4">
          <ModeToggle />
        </div>
        <div id="menu" className="absolute top-4 left-4 w-25">
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <ButtonGroup orientation="vertical" className="w-full">
              <ButtonGroupText className="flex items-center justify-center py-1">Menu</ButtonGroupText>
              <CollapsibleContent asChild>
                <div className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-200 data-[state=closed]:grid-rows-[0fr]">
                  <div className="overflow-hidden flex flex-col">
                    <Button onClick={() => openSettings()} variant="outline" className="rounded-none border-t-0">Settings</Button>
                    <Button variant="outline" className="rounded-none border-t-0">Profile</Button>
                  </div>
                </div>
              </CollapsibleContent>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="icon-xs" className="w-full rounded-t-none border-t-0">
                  {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </Button>
              </CollapsibleTrigger>
            </ButtonGroup>
          </Collapsible>
        </div>
        <h1 className="text-3xl font-bold mb-4">Welcome to OpalChat!</h1>

        <div className="row logos space-x-4">
          <a href="" target="_blank">
            <img src="/vite.svg" className="logo vite" alt="Vite logo" />
          </a>
          <a href="" target="_blank">
            <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
          </a>
          <a href="" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <p className="mb-4 text-lg font-medium">Click on the Tauri, Vite, and React logos to learn more.</p>
      </main>
    </ThemeProvider>
  );
}

export default App;
