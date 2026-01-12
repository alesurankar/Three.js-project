import * as THREE from "three";
import { CelestialBody } from "./celestialBody.js";

export class Star extends CelestialBody {
    constructor({
        name = "star",
        size = 20,
        posToParent = new THREE.Vector3(0, 0, 0),
        axialTilt = 0,
        axialRotationSpeed = 0,
        detail = 12,
        temperature = 6000,
        parent = null,
    } = {}) 
    {
        const texturePath = `./textures/${name}/${name}.jpg`;
        const starColor = Star.colorFromTemperature(temperature);
        const loader = new THREE.TextureLoader();

        // material (color fallback if texture fails)
        const texture = loader.load(
            texturePath,
            undefined,
            undefined,
            (err) => console.warn(`Texture not found for ${name}, using color.`)
        );

        const material = new THREE.MeshBasicMaterial({
            map: texture,
            color: starColor,
        });

        super({
            size,
            posToParent,
            axialTilt,
            axialRotationSpeed,
            detail,
            material,
            parent,
        });

        if (parent) parent.add(this.body);
    }

    static colorFromTemperature(T) {
        let r = 0, g = 0, b = 0;
        // --- Red ---
        if (T <= 1200) r = (T / 1200) * 255;
        else if (T <= 10000) r = 255;
        else {
            let fadeStart = 10000;
            let fadeEnd = 20000;
            r = 255 - ((T - fadeStart) / (fadeEnd - fadeStart)) * (255 - 180);
            if (r < 80) r = 80;
        }

        // // --- Green ---
        if (T <= 5000) g = (T / 5000) * 255;
        else  g = 255;

        // // --- Blue ---
        if (T <= 7000) b = (T / 7000) * 255;
        else b = 255;

        return new THREE.Color(r / 255, g / 255, b / 255);
    }
}