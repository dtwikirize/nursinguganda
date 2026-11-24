import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AppProvider } from "./context/AppContext";
import "./styles/udemy.css";
import { registerWebMcpTools } from "./utils/webmcp";

registerWebMcpTools();

// Auto-recover cleanly if a user tab still holds an older HTML chunk map across deployments
window.addEventListener("vite:preloadError", () => {
  try {
    const key = "nu.chunk_reload_at";
    const last = Number(sessionStorage.getItem(key) || 0);
    if (Date.now() - last > 15000) {
      sessionStorage.setItem(key, String(Date.now()));
      window.location.reload();
    }
  } catch {
    window.location.reload();
  }
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);
