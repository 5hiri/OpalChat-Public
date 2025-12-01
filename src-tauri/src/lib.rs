use tauri::{AppHandle, Manager, WebviewUrl, WebviewWindowBuilder};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn open_settings_window(app: AppHandle) -> Result<(), String> {
    // Check if window already exists
    if let Some(window) = app.get_webview_window("settings") {
        window.show().map_err(|e| e.to_string())?;
        window.set_focus().map_err(|e| e.to_string())?;
        return Ok(());
    }

    // Window was destroyed, recreate it
    #[cfg(debug_assertions)]
    let url = WebviewUrl::External("http://localhost:1420/#/settings".parse().unwrap());
    
    #[cfg(not(debug_assertions))]
    let url = WebviewUrl::App("index.html#/settings".into());

    let window = WebviewWindowBuilder::new(&app, "settings", url)
        .title("Settings")
        .inner_size(600.0, 400.0)
        .center()
        .build()
        .map_err(|e| e.to_string())?;

    // Hide instead of close when user clicks X
    let window_clone = window.clone();
    window.on_window_event(move |event| {
        if let tauri::WindowEvent::CloseRequested { api, .. } = event {
            api.prevent_close();
            let _ = window_clone.hide();
        }
    });

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            // Set up the close handler for the pre-configured settings window
            if let Some(settings_window) = app.get_webview_window("settings") {
                let window_clone = settings_window.clone();
                settings_window.on_window_event(move |event| {
                    if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                        api.prevent_close();
                        let _ = window_clone.hide();
                    }
                });
            }

            // Close the entire app when main window is closed
            if let Some(main_window) = app.get_webview_window("main") {
                let app_handle = app.handle().clone();
                main_window.on_window_event(move |event| {
                    if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                        // Prevent default close to handle it manually
                        api.prevent_close();
                        
                        // Close all windows first, then exit
                        let handle = app_handle.clone();
                        std::thread::spawn(move || {
                            // Close all webview windows
                            for (_, window) in handle.webview_windows() {
                                let _ = window.close();
                            }
                            // Small delay to let windows clean up properly
                            std::thread::sleep(std::time::Duration::from_millis(100));
                            handle.exit(0);
                        });
                    }
                });
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet, open_settings_window])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
