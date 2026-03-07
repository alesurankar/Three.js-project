import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";

export class GameControls 
{
  constructor(camera, domElement) 
  {
    if (!domElement) {
      throw new Error("GameControls requires a DOM element (container)");
    }
    this.controls = new PointerLockControls(camera, domElement);
    this.onLock = null;
    this.onUnlock = null;

    this.controls.addEventListener("lock", () => {
      document.activeElement?.blur();
      this.onLock?.();
    });

    this.controls.addEventListener("unlock", () => {
      document.activeElement?.blur();
      this.onUnlock?.();
    });

    this.move = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      up: false,
      down: false,
      fast: false
    };

    this._onKeyDown = (e) => this.#OnKeyDown(e);
    this._onKeyUp = (e) => this.#OnKeyUp(e);
    this._onMouseDown = (event) => {
      if (event.button === 0) {
        if (!this.controls.isLocked) this.Lock(); 
        console.log("Left mouse button pressed");
      }
        if (event.button === 2) console.log("Right mouse button pressed");
    };
    this._onMouseUp = (event) => {
      if (event.button === 0) console.log("Left mouse button released");
      if (event.button === 2) console.log("Right mouse button released");
    };
    this._onWheel = (event) => {
      if (event.deltaY < 0) console.log("Scrolled UP");
      if (event.deltaY > 0) console.log("Scrolled DOWN");
      event.preventDefault();
    }

    window.addEventListener("keydown", this._onKeyDown);
    window.addEventListener("keyup", this._onKeyUp);
    window.addEventListener("mousedown", this._onMouseDown);
    window.addEventListener("mouseup", this._onMouseUp);
    window.addEventListener("wheel", this._onWheel, { passive: false });
  }

  Lock() 
  {
    this.controls.lock();
  }

  Unlock() 
  {
    this.controls.unlock();
  }

  ToggleLock() 
  {
    this.controls.isLocked ? this.Unlock() : this.Lock();
  }

  Update() 
  {
    if (!this.controls.isLocked) return;
  }

  #OnKeyDown(event) 
  {
    switch (event.code) {
      case "KeyW": this.move.forward = true; break;
      case "KeyS": this.move.backward = true; break;
      case "KeyA": this.move.left = true; break;
      case "KeyD": this.move.right = true; break;
      case "Space": this.move.up = true; break;
      case "KeyV": this.move.down = true; break;
      case "ShiftLeft": this.move.fast = true; break;
    }
  }

  #OnKeyUp(event) 
  {
    switch (event.code) {
      case "KeyW": this.move.forward = false; break;
      case "KeyS": this.move.backward = false; break;
      case "KeyA": this.move.left = false; break;
      case "KeyD": this.move.right = false; break;
      case "Space": this.move.up = false; break;
      case "KeyV": this.move.down = false; break;
      case "ShiftLeft": this.move.fast = false; break;
    }
  }

  Dispose() 
  {
    window.removeEventListener("keydown", this._onKeyDown);
    window.removeEventListener("keyup", this._onKeyUp);
    window.removeEventListener("mousedown", this._onMouseDown);
    window.removeEventListener("mouseup", this._onMouseUp);
    window.removeEventListener("wheel", this._onWheel);
    
    this.controls.dispose?.();
  }
}