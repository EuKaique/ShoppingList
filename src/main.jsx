import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      const resourceEntries = performance
        .getEntriesByType("resource")
        .map((entry) => entry.name)
        .filter((url) => url.startsWith(window.location.origin));

      const currentPageAssets = [...new Set([window.location.href, ...resourceEntries])];

      function sendUrlsToCache(serviceWorker) {
        if (!serviceWorker) {
          return;
        }

        serviceWorker.postMessage({
          type: "CACHE_URLS",
          payload: currentPageAssets,
        });
      }

      if (registration.active) {
        sendUrlsToCache(registration.active);
      }

      navigator.serviceWorker.addEventListener("controllerchange", () => {
        sendUrlsToCache(navigator.serviceWorker.controller);
      });
    } catch (error) {
      console.error("Service worker registration failed", error);
    }
  });
}
