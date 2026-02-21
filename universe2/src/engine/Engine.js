import * as THREE from "three";
import { Update as SceneUpdate, CreateSceneManager } from "./SceneSetup.js";
import { GameControls } from "../utils/gameControls.js";
import { CreateRenderer } from "./RendererSetup.js";

export class Engine 
{
  constructor(container, { fps = 60 } = {}) 
  {
    this.Scene = new THREE.Scene();

    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    this.Scene.add(ambientLight);

    this.container = container;
    this.FIXED_FPS = fps;
    this.FIXED_DT = 1 / this.FIXED_FPS;
    this.lastTime = performance.now() / 1000;
    this.accumulator = 0;
    this.timeScale = 1;
    this.rafId = null;
    
    this.manager = CreateSceneManager(this.Scene, (sceneName) => {
      console.log("Scene changed to:", sceneName);
    });
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

    this.Renderer.render(this.Scene, this.Camera);
    this.rafId = requestAnimationFrame(this.MainLoop);
  }

  Start() 
  {
    this.rafId = requestAnimationFrame(this.MainLoop);
  }

  ToggleLock() 
  {
    this.gameControls.ToggleLock();
  }

  SetTimeScale(scale) 
  {
    this.timeScale = Math.max(0, scale);
  }

  GetCurrentSceneName() 
  {
    return this.manager?.GetCurrentSceneName() ?? "None";
  }

  Dispose() 
  {
    // Stop the animation loop
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    // Dispose controls first
    if (this.gameControls) {
      this.gameControls.Dispose();
      this.gameControls = null;
    }

    // Dispose renderer
    if (this.Renderer) {
      this.Renderer.dispose();
      this.container.removeChild(this.Renderer.domElement);
      this.Renderer = null;
    }

    // Clear the global THREE.Scene
    this.Scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(m => {
            if (m.map) m.map.dispose();
            m.dispose();
          });
        } 
        else {
          if (obj.material.map) obj.material.map.dispose();
          obj.material.dispose();
        }
      }
    });
    this.Scene.clear();
    this.Scene = null;

    // Remove manager reference
    this.manager?.Dispose();
    this.manager = null;
  }
}
