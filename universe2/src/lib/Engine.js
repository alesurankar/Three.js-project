import { Scene, Update as SceneUpdate, CreateSceneManager } from "./SceneSetup.js";
import { GameControls } from "../utils/gameControls.js";
import { CreateRenderer } from "./RendererSetup.js";

export class Engine 
{
  constructor(container, { fps = 60 } = {}) 
  {
    this.container = container;
    this.FIXED_FPS = fps;
    this.FIXED_DT = 1 / this.FIXED_FPS;
    this.lastTime = performance.now() / 1000;
    this.accumulator = 0;
    this.timeScale = 1;

    this.manager = CreateSceneManager();
    this.Camera = this.manager.camera;
    this.Renderer = CreateRenderer(container);
    this.gameControls = new GameControls(this.Camera, container);

    this.MainLoop = this.MainLoop.bind(this);
  }

  MainLoop(now) 
  {
    now /= 1000;
    const frameTime = now - this.lastTime;
    this.lastTime = now;
    this.accumulator += frameTime;

    while (this.accumulator >= this.FIXED_DT) {
      this.gameControls.Update();
      SceneUpdate(this.manager, this.timeScale);
      this.accumulator -= this.FIXED_DT;
    }

    this.Renderer.render(Scene, this.Camera);
    requestAnimationFrame(this.MainLoop);
  }

  Start() 
  {
    requestAnimationFrame(this.MainLoop);
  }

  ToggleLock() 
  {
    this.gameControls.ToggleLock();
  }

  SetTimeScale(scale) 
  {
    this.timeScale = Math.max(0, scale);
  }

  Dispose() 
  {
    // Dispose controls first
    if (this.gameControls) {
      this.gameControls.Dispose();
      this.gameControls = null;
    }
    // Dispose renderer
    this.Renderer.dispose();
    this.container.removeChild(this.Renderer.domElement);
  }
}
