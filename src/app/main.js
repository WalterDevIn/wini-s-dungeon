import { createGameApp } from "./createGameApp.js";

const canvas = document.querySelector("#game-canvas");
const uiRoot = document.querySelector("#ui-root");

if (!canvas) {
  throw new Error("No se pudo inicializar el canvas del juego.");
}

if (!uiRoot) {
  throw new Error("No se pudo inicializar la UI del juego.");
}

const app = createGameApp({ canvas, uiRoot });
app.start();
