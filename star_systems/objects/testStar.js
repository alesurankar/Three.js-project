import * as THREE from "three";

export class Star {
constructor({
    name = "sun",
    size = 20,
    position =  new THREE.Vector3(0, 0, 0),
    temperature = 5778,
    texturesPath = "./textures",
} = {}) {
    this.loader = new THREE.TextureLoader();

    // group
    

    // calculate temperature
    const starColor = this.colorFromTemperature(temperature);

    // geometry
    const geometry = new THREE.IcosahedronGeometry(size, 12);

    // material
    const material = new THREE.MeshBasicMaterial({
        map: this.loader.load(`${texturesPath}/${name}/${name}.jpg`),
        color: starColor,
    });
    this.star = new THREE.Mesh(geometry, material);
    this.star.position.copy(position);
}

    colorFromTemperature(T) {
        let r = 0;
        let g = 0;
        let b = 0;

        // --- Red ---
        if (T <= 1200) {
        r = (T / 1200) * 255;
        } 
        else if (T <= 10000) {
        r = 255;
        } 
        else {
        let fadeStart = 20000;
        let fadeEnd = 40000;
        r = 255 - ((T - fadeStart) / (fadeEnd - fadeStart)) * (255 - 180);
        if (r < 60) r = 60;
        }

        // // --- Green ---
        if (T <= 5000) {
        g = (T / 5000) * 255;
        } 
        else if (T <= 12000) {
        g = 255;
        }
        else {
        let fadeStart = 12000;
        let fadeEnd = 24000;
        g = 255 - ((T - fadeStart) / (fadeEnd - fadeStart)) * 255;
        if (g < 120) g = 120;
        }

        // // --- Blue ---
        if (T <= 7000) {
        b = (T / 7000) * 255;
        }
        else {
        b = 255;
        }

        return new THREE.Color(r / 255, g / 255, b / 255);
    }
}