import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

class ModelStoreClass 
{
  constructor() 
  {
      // cache for loaded models
      this.models = new Map();

      // cache for loading promises (prevents duplicate loads)
      this.loading = new Map();

      // create ONE loader
      this.loader = new GLTFLoader();

      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("/draco/");
      this.loader.setDRACOLoader(dracoLoader);
  }

  async Load(key) 
  {
      // already loaded → return cached
      if (this.models.has(key)) {
          return this.models.get(key);
      }

      // currently loading → return same promise
      if (this.loading.has(key)) {
          return this.loading.get(key);
      }

      const promise = new Promise((resolve, reject) => {
          const path = `/models/glb/${key}/model.glb`;

          this.loader.load(
              path,
              (gltf) => {
                  const scene = gltf.scene;

                  // Fix geometry/material ONCE
                  scene.traverse((child) => {
                      if (child.isMesh) {
                          child.material.side = THREE.DoubleSide;
                          child.geometry.computeVertexNormals();
                      }
                  });

                  this.models.set(key, scene);
                  this.loading.delete(key);
                  resolve(scene);
              },
              undefined,
              (err) => {
                  console.error("Model load failed:", path, err);
                  this.loading.delete(key);
                  reject(err);
              }
          );
      });

      this.loading.set(key, promise);
      return promise;
  }

  async GetClone(key) 
  {
      const original = await this.Load(key);

      // deep clone for safe reuse
      const clone = original.clone(true);

      return clone;
  }

  Dispose() 
  {
    for (const scene of this.models.values()) {

      scene.traverse((child) => {
        if (!child.isMesh) return;

        // geometry
        child.geometry.dispose();

        // material(s)
        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];

        materials.forEach(mat => {
          // dispose textures
          for (const key in mat) {
            const value = mat[key];
            if (value && value.isTexture) {
              value.dispose();
            }
          }
          mat.dispose();
        });
      });
    }

    this.models.clear();
    this.loading.clear();
  }
}

export const ModelStore = new ModelStoreClass();