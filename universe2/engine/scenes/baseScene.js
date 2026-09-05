import * as THREE from "three";
import { SkyBox } from "../visuals/skyBox.js";
import { loadEntities } from "../utils/loadEntities.js"
import { SetEntityObjectMap, ClearEntityObjectMap } from "../factories/entityFactory.js";


export class BaseScene 
{
  // Step 10
  constructor(scene, camera, player, focus = {}, skyBoxName = "StarBox") 
  {
    console.log("Scene constructor");
    this.active = true;
    this.initialized = false;
    this.timeFactor=1

    this.SIZE_SCALE = 1;
    this.REGION_SIZE_SCALE = 0.000144 * this.SIZE_SCALE;
    this.LOCAL_SIZE_SCALE = 5 * this.REGION_SIZE_SCALE;
    this.INNER_SIZE_SCALE = 1800 * this.LOCAL_SIZE_SCALE;
    
    this.near = 12;
    this.far = 16000;
    this.cameraSettings = { near: this.near,far: this.far };
    this.scene = scene;
    this.scene.background = SkyBox.Load(skyBoxName);
    this.camera = camera;
    this.player = player;
    this.focus = focus;
    this.objects = [];
    this.objectMap = {};
  }

  async Init() 
  {
    if (!this.active) return;
    const { requiredKeys, scaleMap } = this.GetEntityConfig();

    try {
      const { entityMap, sizeMap } = await loadEntities(requiredKeys, scaleMap);
      this.entityMap = entityMap;
      this.sizeMap = sizeMap;
      SetEntityObjectMap(this.objectMap, requiredKeys);
      this.CreateObjects();
      ClearEntityObjectMap();
      if (this.primaryEntity) {
        this.AttachPlayerTo(this.primaryEntity);
      }
      this.PlayerEntryPosition();
      if (this.SetExitCondition) {
        this.SetExitCondition();
      }
      if (this.DefinePortals) {
        this.DefinePortals();
      }
      this.initialized = true;
    }
    catch (err) {
      console.error("Failed to load entities", err);
    }
  }

  AttachPlayerTo(entity)
  {
  if (!entity?.orbitPivot) return;
  if (this.player.objectRoot.parent)
    this.player.objectRoot.parent.remove(this.player.objectRoot);

    entity.objectRoot.add(this.player.objectRoot);
  }

  Update(dt) 
  {
    if (!this.initialized) return;

    for (const obj of this.objects) {
      obj.Update(dt * this.timeFactor);
    }
    if (this.CheckSceneTransition) {
      this.CheckSceneTransition();
    }
  }

  Dispose() 
  {
    this.active = false;
    this.initialized = false;
    this.objects.forEach(obj => obj?.Dispose());
    this.objects = [];
    if (this.sceneTriggers) {
        this.sceneTriggers = [];
    }

    // Dispose skybox
    if (this.scene?.background) {
      SkyBox.Dispose(this.scene.background);
      this.scene.background = null;
    }
    // Clear objectMap to remove references
    this.objectMap = {};
    ClearEntityObjectMap();
  }
}
