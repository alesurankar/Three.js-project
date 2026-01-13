import { scene, Update as SceneUpdate } from "./Scene.js";
import { GameControls } from "./utils/GameControls.js"
import { camera, renderer } from "./RendererSetup.js";


// Adjustable FPS
const FIXED_FPS = 40;
const FIXED_DT = 1 / FIXED_FPS;
let lastTime = performance.now() / 1000;
let accumulator = 0;

const gameControls = new GameControls(camera);

function MainLoop(now) 
{
  now /= 1000;
  const frameTime = now - lastTime;
  lastTime = now;

  accumulator += frameTime;

  // Fixed-step updates
  while (accumulator >= FIXED_DT) {
    gameControls.Update();
    SceneUpdate();
    accumulator -= FIXED_DT;
  }

  // Render
  renderer.render(scene, camera);
  requestAnimationFrame(MainLoop);
}

requestAnimationFrame(MainLoop);