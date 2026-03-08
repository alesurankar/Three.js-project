import * as THREE from "three";
import { StarSystem } from "../utils/starSystemHelper.js"
import { SkyBox } from "../visuals/skyBox.js";
import { loadEntities } from "../utils/loadEntities.js"


export class BaseScene 
{
    // Step 10
    constructor(scene, camera, player, focus = {}) 
    {
        console.log("Scene constructor");
        this.active = true;
        StarSystem.timeFactor=1

        this.SIZE_SCALE = 1;
        this.REGION_SIZE_SCALE = 0.000144 * this.SIZE_SCALE;
        this.LOCAL_SIZE_SCALE = 5 * this.REGION_SIZE_SCALE;
        this.INNER_SIZE_SCALE = 1800 * this.LOCAL_SIZE_SCALE;
        
        this.near = 12;
        this.far = 16000;
        this.cameraSettings = { near: this.near,far: this.far };
        this.scene = scene;
        this.scene.background = SkyBox.Load("StarBox");
        this.camera = camera;
        this.player = player;
        this.focus = focus;
        this._tempVec = new THREE.Vector3();
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
            this.CreateObjects();
            this.PlayerEntryPosition();
            if (this.SetExitCondition) {
                this.SetExitCondition();
            }
            if (this.DefinePortals) {
                this.DefinePortals();
            }
        }
        catch (err) {
            console.error("Failed to load entities", err);
        }
    }

    Update(dt) 
    {
        // console.log("Camera position:", this.camera.position);
        if (!this.sun) return;
        for (const obj of this.objects) {
            obj.Update(dt);
        }
        if (this.CheckSceneTransition) {
            this.CheckSceneTransition();
        }
    }

    Dispose() 
    {
        this.active = false;
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
    }
}