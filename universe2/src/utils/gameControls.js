import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";

export class GameControls 
{
  constructor(camera, domElement) 
  {
    if (!domElement) {
      throw new Error("GameControls requires a DOM element (container)");
    }

    this.camera = camera;
    this.domElement = domElement;
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
    this._onEsc = (e) => {
      if (e.code === "Escape") this.Unlock();
    };

    window.addEventListener("keydown", this._onKeyDown);
    window.addEventListener("keyup", this._onKeyUp);
    window.addEventListener("keydown", this._onEsc);
  }

  ToggleLock() 
  {
    if (this.controls.isLocked) {
      this.controls.unlock();
    } 
    else {
      this.controls.lock();
    }
  }

  Lock() 
  {
    this.controls.lock();
  }

  Unlock() 
  {
    this.controls.unlock();
  }

  Update() 
  {
    if (!this.controls.isLocked) return;

    const velocity = new THREE.Vector3();
    const direction = new THREE.Vector3();
    this.camera.getWorldDirection(direction);

    const speed = this.move.fast ? 50 : 5;

    if (this.move.forward) velocity.add(direction.clone().multiplyScalar(speed));
    if (this.move.backward) velocity.add(direction.clone().multiplyScalar(-speed));

    const left = new THREE.Vector3().crossVectors(this.camera.up, direction).normalize();
    if (this.move.left) velocity.add(left.multiplyScalar(speed));
    if (this.move.right) velocity.add(left.multiplyScalar(-speed));

    if (this.move.up) velocity.y += speed;
    if (this.move.down) velocity.y -= speed;

    this.controls.getObject().position.add(velocity);
  }

  #OnKeyDown(event) 
  {
    switch (event.code) {
      case "KeyW": this.move.forward = true; break;
      case "KeyS": this.move.backward = true; break;
      case "KeyA": this.move.left = true; break;
      case "KeyD": this.move.right = true; break;
      case "KeyV": this.move.down = true; break;
      case "ShiftLeft": this.move.fast = true; break;
      case "Space": this.move.up = true; break;
    }
  }

  #OnKeyUp(event) 
  {
    switch (event.code) {
      case "KeyW": this.move.forward = false; break;
      case "KeyS": this.move.backward = false; break;
      case "KeyA": this.move.left = false; break;
      case "KeyD": this.move.right = false; break;
      case "KeyV": this.move.down = false; break;
      case "ShiftLeft": this.move.fast = false; break;
      case "Space": this.move.up = false; break;
    }
  }

  Dispose() 
  {
    window.removeEventListener("keydown", this._onKeyDown);
    window.removeEventListener("keyup", this._onKeyUp);
    window.removeEventListener("keydown", this._onEsc);
    
    this.controls.dispose?.();
  }
}