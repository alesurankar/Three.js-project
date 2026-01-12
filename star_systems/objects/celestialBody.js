import * as THREE from "three";

export class CelestialBody {
constructor(
    {
        name = "",
        size = 1,
        axialTilt = 0,
        orbitRadius = 0,
        axialRotationSpeed = 0,
        orbitRotationSpeed = 0, 
        detail = 12,
        color = 0xffffff,
        parent = null, 
    } = {}) 
    {
        this.name = name;
        this.size = size;
        this.axialTilt = axialTilt;
        this.orbitRadius = orbitRadius;
        this.axialRotationSpeed = axialRotationSpeed;
        this.orbitRotationSpeed = orbitRotationSpeed;
        this.loader = new THREE.TextureLoader();
        const texturePath = `./textures/${name}/${name}.jpg`;

        // group
        
        // geometry
        this.geometry = new THREE.IcosahedronGeometry(size, detail);

        // material
        this.material = new THREE.MeshStandardMaterial({ color });
        
        // Try to load texture
        this.loader.load(
            texturePath,
            (texture) => { 
                this.material.map = texture; 
                this.material.needsUpdate = true;
            },
            undefined,
            (err) => {
                // Texture failed to load; fallback to color
                console.warn(`Texture not found for ${name} at ${texturePath}, using color.`);
            }
        )

        // Mesh
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        
        // Parent handling
        if (parent) parent.add(this.mesh);
    }
}