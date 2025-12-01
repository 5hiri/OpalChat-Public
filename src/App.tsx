import React from "react";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
// import "@/styles/App.css";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";

import { Button } from "./components/ui/button";
import {
  ButtonGroup,
  ButtonGroupText,
} from "@/components/ui/button-group";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDownIcon, ChevronUpIcon, Settings2Icon, SendIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea"


function App() {
  const [isOpen, setIsOpen] = useState(true);

  async function openSettings() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    await invoke("open_settings_window");
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <main className="min-h-screen p-4 flex gap-4">
        <div id="menu" className="w-56 shrink-0">
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
        <div id="content" className="min-w-0 flex-1 flex flex-col rounded-xl border bg-background p-4 text-foreground shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold">Welcome to OpalChat!</h1>
              <p className="text-sm text-muted-foreground">Start a conversation below.</p>
            </div>
            <div className="flex items-center gap-2">
              <ModeToggle />
              <Button variant="outline" size="icon" onClick={() => openSettings()} aria-label="Open settings">
                <Settings2Icon className="size-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1" />
          <div id="chat-area" className="mt-4 flex w-full items-end gap-2">
            <Textarea placeholder="Type your message here..." className="flex-1" />
            <Button id="send-message" className="gap-2">
              <span>Send</span>
              <SendIcon className="size-4" />
            </Button>
          </div>
        </div>
      </main>
    </ThemeProvider>
  );
}

export default App;
