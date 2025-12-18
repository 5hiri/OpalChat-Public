# OpalChat Copilot Instructions

## Big picture
- Desktop app: Vite + React frontend in [src/](src/) packaged by Tauri v2 (Rust) in [src-tauri/](src-tauri/).
- Routing is hash-based for Tauri windows: see [src/main.tsx](src/main.tsx) (uses `HashRouter`) and the settings URL `/#/settings` in [src-tauri/tauri.conf.json](src-tauri/tauri.conf.json).
- The backend owns native window lifecycle; the frontend calls Rust commands via `@tauri-apps/api/core` `invoke` (example in [src/App.tsx](src/App.tsx)).

## Key places to edit
- Routes/pages: [src/main.tsx](src/main.tsx), [src/App.tsx](src/App.tsx) (main view), [src/settings.tsx](src/settings.tsx) (settings view).
- Tauri commands + window management: [src-tauri/src/lib.rs](src-tauri/src/lib.rs).
- UI system: shadcn/ui + Radix primitives in [src/components/ui/](src/components/ui/) (Tailwind v4 + CSS variables in [src/styles/globals.css](src/styles/globals.css)).
- Styling helper: use `cn(...)` from [src/lib/utils.ts](src/lib/utils.ts) to merge classNames.
- Theme: wrap pages in `ThemeProvider` ([src/components/theme-provider.tsx](src/components/theme-provider.tsx)); `ModeToggle` uses `useTheme` ([src/hooks/use-theme.ts](src/hooks/use-theme.ts)).

## Local workflows
- Frontend dev server: `npm run dev` (Tauri expects fixed port 1420; see [vite.config.ts](vite.config.ts)).
- Desktop dev/build: `npm run tauri dev` / `npm run tauri build`.
- Typecheck/build web assets: `npm run build` (runs `tsc && vite build`).

## Project conventions
- Imports use the `@` alias to `src/` (configured in [vite.config.ts](vite.config.ts)); prefer `@/components/...` over relative paths.
- For new UI, prefer existing primitives in [src/components/ui/](src/components/ui/) and theme tokens (`bg-background`, `text-foreground`, etc.) instead of hard-coded colors.
- Settings window behavior: closing the Settings window hides it (not destroys it). Mirror this pattern if you add more auxiliary windows (see `open_settings_window` and close handlers in [src-tauri/src/lib.rs](src-tauri/src/lib.rs)).

## Adding a new Rust command (frontend → backend)
1. Implement `#[tauri::command] fn my_command(...) -> Result<_, String>` in [src-tauri/src/lib.rs](src-tauri/src/lib.rs).
2. Register it in `.invoke_handler(tauri::generate_handler![..., my_command])`.
3. Call from TS with `await invoke("my_command", { ... })` (pattern: [src/App.tsx](src/App.tsx)).

## Boundaries
- Never include secrets (API keys, tokens) in code or chat output.
- Don’t change dependency/config files (`package.json`, `tsconfig*.json`, Tauri config) unless the task requires it.
- Ask before deleting files.