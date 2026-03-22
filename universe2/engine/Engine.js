import * as THREE from "three";
import { SceneUpdate, CreateSceneManager, FirstScene } from "./SceneSetup.js";
import { CreateRenderer } from "./RendererSetup.js";
import { Player } from "./Player.js"

export class Engine 
{
  constructor(container, { fps = 60, firstScene = "MercuryOrbit"  } = {}) 
  {
    if (!this.Scene) {
      this.Scene = new THREE.Scene();
    }

    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    this.Scene.add(ambientLight);
    
    this.container = container;
    this.FIXED_FPS = fps;
    this.FIXED_DT = 1 / this.FIXED_FPS;
    this.lastTime = performance.now() / 1000;
    this.accumulator = 0;
    this.timeScale = 1;
    this.rafId = null;
    this._disposed = false;
    
    if (!this.manager) {
      this.manager = CreateSceneManager(this.Scene, (sceneName) => {
        console.log("Scene changed to:", sceneName);
      });
    }
    if (!this.Camera) {
      this.Camera = this.manager.camera;
    }
    if (!this.Renderer) {
      this.Renderer = CreateRenderer(container);
    }
    if (!this.player) {
      this.player = new Player({
        camera: this.Camera,
        container: container
      });

      this.Scene.add(this.player.objectRoot);
      this.manager.SetPlayer(this.player);
    }

    FirstScene(this.manager, firstScene);

    this.MainLoop = this.MainLoop.bind(this);
    console.log("ENGINE CREATED");
  }

  // Async Step 3 
  MainLoop(now) 
  {
    //console.log("Async Step 3: Engine.js: MainLoop()");
    now /= 1000;
    const frameTime = now - this.lastTime;
    this.lastTime = now;
    this.accumulator += frameTime;

    while (this.accumulator >= this.FIXED_DT) {
      this.player.Update(this.FIXED_DT)
      SceneUpdate(this.manager, this.timeScale);
      this.accumulator -= this.FIXED_DT;
    }

    this.Renderer.render(this.Scene, this.Camera);
    this.rafId = requestAnimationFrame(this.MainLoop);
  }

  // Async Step 1
  async Start() 
  {
    console.log("Async Step 1: Engine.js: async Start()");
    await this.manager.Init();
    if (this._disposed) return;
    this.rafId = requestAnimationFrame(this.MainLoop);
  }

  ToggleLock() 
  {
    this.player.Lock();
  }

  SetTimeScale(scale) 
  {
    this.timeScale = Math.max(0, scale);
  }

  GetCurrentSceneName() 
  {
    return this.manager?.GetCurrentSceneName() ?? "None";
  }

  Resize()
  {
    if (!this.Renderer || !this.Camera || !this.container) return;

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.Renderer.setSize(width, height);
    if (this.Camera.isPerspectiveCamera) {
      this.Camera.aspect = width / height;
      this.Camera.updateProjectionMatrix();
    }
  }

  Dispose() 
  {
    this._disposed = true;

    // Stop the animation loop
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    // Dispose controls first
    if (this.player) {
      this.player.Dispose();
      this.player = null;
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
