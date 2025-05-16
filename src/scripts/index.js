// CSS imports
import "../styles/styles.css";

import App from "./pages/app";
import { registerServiceWorker } from "./utils";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    drawerNavigation: document.querySelector("#navigation-drawer"),
    skipLinkButton: document.querySelector(".skip-to-content"),
  });
  
  await registerServiceWorker();
  await app.renderPage();

  console.log('Berhasil mendaftarkan service worker.');

  window.addEventListener("hashchange", async () => {
    await app.renderPage();
  });
});
