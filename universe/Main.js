import { Engine } from "./src/Engine.js";


const engine = new Engine({fps: 40});
engine.Start();


// --- GUI hooks---
const lockIn = document.getElementById("lockIn");
const timeScale = document.getElementById("timeScale");
const sceneLevel = document.getElementById("sceneLevel");

lockIn.onclick = () => {
  engine.ToggleLock();
};

engine.gameControls.onLock = () => {
  lockIn.textContent = "🔓 Lock Out";
};

engine.gameControls.onUnlock = () => {
  lockIn.textContent = "🔒 Lock In";
};

timeScale.oninput = (e) => {
    engine.SetTimeScale(Number(e.target.value));
};