import * as THREE from "three";
import { CelestialBody } from "./CelestialBody.js";


export class Star extends CelestialBody 
{
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
        // Prepare texture and material
        const texturePath = `./textures/${name}/${name}.jpg`;
        const starColor = Star.#ColorFromTemperature(temperature);
        const loader = new THREE.TextureLoader();

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

        // Call base constructor
        super({
            size,
            posToParent,
            axialTilt,
            axialRotationSpeed,
            detail,
            material,
            parent,
        });

        this.light = new THREE.Group();

        // Light parameters
        const scaleFactor = 0.00000000000001; 
        const luminosity = 4 * Math.PI * Math.pow(size, 2) * Math.pow(temperature, 4);
        const intensity = luminosity * scaleFactor;
        const distance = Math.pow(size, 3);

        // Creating lights
        this.light1 = new THREE.PointLight(starColor, intensity, distance);
        this.light2 = new THREE.PointLight(starColor, intensity, distance);
        this.light3 = new THREE.PointLight(starColor, intensity, distance);
        this.light4 = new THREE.PointLight(starColor, intensity, distance);
        this.light5 = new THREE.PointLight(starColor, intensity, distance);
        this.light6 = new THREE.PointLight(starColor, intensity, distance);

        // Setting light positions
        const lightPos = 3*size/2;
        this.light1.position.set(lightPos, 0, 0);
        this.light2.position.set(0, lightPos, 0);
        this.light3.position.set(0, 0, lightPos);
        this.light4.position.set(-lightPos, 0, 0);
        this.light5.position.set(0, -lightPos, 0);
        this.light6.position.set(0, 0, -lightPos);

        // Adding light to hierarchy
        this.axialFrame.add(this.light);
        this.light.add(this.light1);
        this.light.add(this.light2);
        this.light.add(this.light3);
        this.light.add(this.light4);
        this.light.add(this.light5);
        this.light.add(this.light6);
    }

    static #ColorFromTemperature(T) {
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