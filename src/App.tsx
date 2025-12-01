import { useState } from "react";
import reactLogo from "@/assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "@/styles/App.css";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <main className="mx-auto p-10 flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Welcome to OpalChat!</h1>

        <div className="row logos space-x-4 justify-center">
          <a href="https://vite.dev" target="_blank">
            <img src="/vite.svg" className="logo vite" alt="Vite logo" />
          </a>
          <a href="https://tauri.app" target="_blank">
            <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <p className="mb-4 text-lg font-medium">Click on the Tauri, Vite, and React logos to learn more.</p>

        <form
          className="row"
          onSubmit={(e) => {
            e.preventDefault();
            greet();
          }}
        >
          <input
            id="greet-input"
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="Enter a name..."
          />
          <button type="submit">Greet</button>
        </form>
        <p className="mt-4 text-lg font-medium">{greetMsg}</p>
      </main>
    </ThemeProvider>
  );
}

export default App;
