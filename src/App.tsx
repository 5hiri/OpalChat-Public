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
import { ChevronDownIcon, ChevronUpIcon, Settings2Icon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea"


function App() {
  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  async function openSettings() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    await invoke("open_settings_window");
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <main className="p-4 flex flex-row min-h-screen">
        <div id="menu" className="min-w-30 max-w-1/6 mr-2">
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <ButtonGroup orientation="vertical" className="w-full">
              <ButtonGroupText className="flex items-center justify-center py-1">Menu</ButtonGroupText>
              <CollapsibleContent asChild>
                <div className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-200 data-[state=closed]:grid-rows-[0fr]">
                  <div className="overflow-hidden flex flex-col">
                    <Button variant="outline" className="rounded-none border-t-0">Explore</Button>
                    <Button variant="outline" className="rounded-none border-t-0">Favourites</Button>
                    <Button variant="outline" className="rounded-none border-t-0">Create</Button>
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
        <div id="content" className="flex flex-col border ml-2 mr-2 px-4 py-4 min-w-1/2 w-full rounded-lg shadow-lg bg-background text-foreground">
          <div className="flex flex-row justify-between">
            <h1 className="text-3xl font-bold">Welcome to OpalChat!</h1>
            <div className="flex justify-end mb-4">
              <Button className="px-4 py-2 bg-accent-foreground/80 hover:bg-accent-foreground">
                <Settings2Icon className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1" />
          <div id="chat-area" className="flex flex-row w-full gap-2 mt-4 items-end">
            <Textarea placeholder="Type your message here..." className="flex-1" />
            <Button id="send-message" className="px-4 py-2 bg-accent-foreground/80 hover:bg-accent-foreground">
              <span>Send</span>
              <ChevronUpIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div id="theme-toggle" className="ml-2 top-4 right-4">
          <ModeToggle />
        </div>
      </main>
    </ThemeProvider>
  );
}

export default App;
