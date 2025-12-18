import { useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
// import "@/styles/App.css";
import "@/styles/globals.css";
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
import { ChevronDownIcon, ChevronUpIcon, Settings2Icon, SendIcon, MoreVerticalIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";


function App() {
  const [isOpen, setIsOpen] = useState(true);
  const [showPfp] = useState(true);
  const [draft, setDraft] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const shouldAutoScrollRef = useRef(true);

  const [messages, setMessages] = useState<
    Array<{
      messageId: number;
      sender: string;
      name: string;
      pfp: string;
      content: string;
      timestamp: Date;
    }>
  >(() => [
    {
      messageId: 0,
      sender: "user",
      name: "User",
      pfp: "/default-pfp.svg",
      content: "Hi! I have a question about my account.",
      timestamp: new Date(),
    },
    {
      messageId: 1,
      sender: "bot",
      name: "OpalBot",
      pfp: "/default-pfp.svg",
      content: "Hello! How can I assist you today?",
      timestamp: new Date(),
    },
  ]);

  async function openSettings() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    await invoke("open_settings_window");
  }

  async function addMessage(sender: string, name: string, pfp: string, content: string, timestamp: Date) {
    setMessages((prevMessages) => {
      const latestMessageId = prevMessages.length > 0 ? prevMessages[prevMessages.length - 1].messageId : -1;
      const messageId = latestMessageId + 1;
      return [...prevMessages, { messageId, sender, name, pfp, content, timestamp }];
    });
  }

  async function sendMessage(sender: string, name: string, pfp: string, content: string) {
    const timestamp = new Date();
    await addMessage(sender, name, pfp, content, timestamp);
    setDraft("");
  }

  useEffect(() => {
    if (!shouldAutoScrollRef.current) return;
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
    });
  }, [messages.length]);

  function handleMessagesScroll() {
    const el = messagesContainerRef.current;
    if (!el) return;

    // If user scrolls up, stop auto-follow. Resume once they're back near the bottom.
    const thresholdPx = 48;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    shouldAutoScrollRef.current = distanceFromBottom <= thresholdPx;
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }

  return (
    <main className="h-screen min-h-0 p-4 flex gap-4 mx-auto w-full max-w-6xl">
        <div id="menu" className="w-56 shrink-0">
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <div className="rounded-xl border bg-background p-2 text-foreground shadow-sm">
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
            </div>
          </Collapsible>
        </div>
        <div id="content" className="min-w-0 min-h-0 flex-1 flex flex-col rounded-xl border bg-background p-4 text-foreground shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Welcome to OpalChat</h1>
              <p className="text-sm text-muted-foreground">Start a conversation below.</p>
            </div>
            <div className="flex items-center gap-2">
              <ModeToggle />
              <Button variant="outline" size="icon" aria-label="Open settings"> 
                {/* This settings button opens specific chat settings which arent the same as the global settings */}
                <Settings2Icon className="size-4" />
              </Button>
            </div>
          </div>
          <Separator className="my-4" />
          <div id="chat-area" className="mt-4 flex-1 min-h-0 flex flex-col gap-3">
            <div
              id="chat-messages"
              ref={messagesContainerRef}
              onScroll={handleMessagesScroll}
              className="opal-scrollbar flex-1 min-h-0 overflow-y-auto space-y-4 rounded-lg border bg-muted/30 p-4"
            >
              {/* Chat messages will appear here */}
              {messages.map((msg) => (
                <div
                  key={msg.messageId}
                  className={
                    `flex gap-2 ` +
                    (msg.sender === "user" ? "justify-end pl-10 items-end" : "justify-start pr-10 items-end")
                  }
                >
                  {msg.sender !== "user" && showPfp && (
                    <img
                      src={msg.pfp}
                      alt={`${msg.name} profile`}
                      className="size-9 rounded-full"
                    />
                  )}
                  <div
                    className={`relative group max-w-[75%] whitespace-pre-wrap break-words rounded-lg p-3 ${
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    <div className="mb-1">
                      {msg.name && (
                        <div
                          className={
                            "min-w-0 text-sm font-semibold " +
                            (msg.sender === "user"
                              ? "text-right pl-6"
                              : "text-left pr-6")
                          }
                        >
                          {msg.name}
                        </div>
                      )}
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="default"
                          size="icon-xs"
                          aria-label="Message options"
                          className={
                            "absolute top-1 z-10 h-6 w-6 p-0 bg-transparent text-inherit " +
                            "opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100 " +
                            "rounded-full border border-current/10 bg-current/5 hover:bg-current/10 " +
                            "hover:text-inherit focus-visible:text-inherit " +
                            (msg.sender === "user" ? "left-1 hover:bg-current/20 border-current/45" : "right-1 hover:bg-current/15 border-current/30")
                          }
                        >
                          <MoreVerticalIcon className="size-3.5 opacity-70 group-hover:opacity-90" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align={msg.sender === "user" ? "start" : "end"}>
                        <DropdownMenuItem disabled>Options coming soon</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="text-sm leading-relaxed">{msg.content}</div>
                  </div>
                  {msg.sender === "user" && showPfp && (
                    <img
                      src={msg.pfp}
                      alt={`${msg.name} profile`}
                      className="size-9 rounded-full"
                    />
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="flex w-full mt-1 items-end gap-2">
              <Textarea
                placeholder="Type your message here..."
                className="opal-scrollbar flex-1 resize-none min-h-12 max-h-40"
                id="chat-input"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={async (e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    const value = draft;
                    if (value.trim() !== "") {
                      await sendMessage("user", "User", "/default-pfp.svg", value);
                    }
                    // send user back to bottom of chat after sending message if they had scrolled up
                    scrollToBottom();
                  }
                }}
              />
              <Button
                id="send-message"
                className="gap-2"
                disabled={draft.trim() === ""}
                onClick={async () => {
                  if (draft.trim() !== "") {
                    await sendMessage("user", "User", "/default-pfp.svg", draft);
                    // send user back to bottom of chat after sending message if they had scrolled up
                    scrollToBottom();
                  }
                }}
              >
                <span>Send</span>
                <SendIcon className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
  );
}

export default App;
