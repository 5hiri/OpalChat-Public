---
title: "OpalChat Tech Stack"
date: 2025-12-01
---
# OpalChat Tech Stack

## Recommended Stack: Tauri + React + Python/Ollama
For a modern, high-performance desktop application that needs to handle local AI workloads, the following stack is recommended:
### 1. Core Framework: **[[Tauri]]** (v2)
*   **Why:** Tauri provides an extremely lightweight alternative to Electron. It uses the underlying OS's webview (WebView2 on Windows, WebKit on macOS/Linux), resulting in tiny binary sizes and lower RAM usage.
*   **Language:** Rust (Backend) + JavaScript/TypeScript (Frontend).
*   **Benefit:** Rust is memory-safe and highly performant, perfect for the "glue" code between the UI and the AI models.

### 2. Frontend: **[[React]]** + **[[TypeScript]]** + **[[Tailwind CSS]]**
*   **Why:** React is the industry standard for building interactive UIs. TypeScript adds type safety, which is crucial for maintaining a complex chat application. Tailwind CSS allows for rapid, modern styling.
*   **UI Library:** **shadcn/ui** or **Mantine** for pre-built, accessible components that look great out of the box.

### 3. Local AI Inference: **[[Ollama]]** (Integration)
*   **Why:** Instead of bundling a massive Python environment or compiling complex C++ bindings manually, OpalChat can act as a client for **Ollama**.
*   **Mechanism:** OpalChat checks if Ollama is running (or helps install it) and communicates via its local HTTP API.
*   **Alternative (Embedded):** If a self-contained app is required, use **Rust bindings for llama.cpp**. This keeps the app single-binary but increases build complexity.

### 4. Remote API Handling: **Rust (Reqwest)** or **TypeScript (Fetch)**
*   **Why:** Handling API keys and requests can be done securely in the Rust backend (Tauri) to prevent exposing keys to the frontend webview, or simply in the frontend if local storage encryption is used.

### 5. Data Storage: **[[SQLite]]**
*   **Why:** For storing chat history, user preferences, and session data. SQLite is robust, serverless, and has excellent support in Rust (via `sqlx` or `rusqlite`).

---

## Alternative Options Considered

### Option B: [[Electron]]
*   **Pros:** Mature ecosystem, easier access to Node.js packages.
*   **Cons:** Large binary size, high memory usage (Chromium).
*   **Verdict:** Good fallback if Tauri proves too difficult, but less efficient.

### Option C: [[Python]] (PyQt / PySide)
*   **Pros:** Native access to PyTorch/HuggingFace libraries.
*   **Cons:** UI development is slower and often looks dated compared to Web Tech. Harder to distribute (packaging Python is notoriously tricky).
*   **Verdict:** Not recommended for a consumer-facing chat app where UI/UX is key.
