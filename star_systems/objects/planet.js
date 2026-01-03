import * as THREE from "three";

export class Planet {
    constructor({
        scene,
        name = "earth",
        size = 10,
        position = new THREE.Vector3(0, 0, 0),
        rotationSpeed = 0,
        cloudRotationSpeed = 0,
        texturesPath = "./textures",
        dayTexture = "day.jpg",
        nightTexture = "night.jpg",
        cloudTexture = "clouds.jpg",
        nightOpacity = 0,
        cloudOpacity = 0,
        axialTilt = 0
    } = {}) {
        if (!scene) throw new Error("Planet requires a scene.");

        this.loader = new THREE.TextureLoader();
        this.group = new THREE.Group();
        this.group.position.copy(position);
        this.rotationSpeed = rotationSpeed;
        this.cloudRotationSpeed = cloudRotationSpeed;
        this.axialTilt = axialTilt * Math.PI / 180;
        scene.add(this.group);

        // Geometry
        const geometry = new THREE.IcosahedronGeometry(size, 12);

        // Day material
        const dayMat = new THREE.MeshStandardMaterial({
            map: this.loader.load(`${texturesPath}/${name}/${dayTexture}`),
            roughness: 1,
            metalness: 0
        });
        this.planetDay = new THREE.Mesh(geometry, dayMat);
        this.planetDay.castShadow = true;
        this.planetDay.receiveShadow = true;
        this.group.add(this.planetDay);

        // Night material
        if (nightTexture) {
            const nightMat = new THREE.MeshBasicMaterial({
                map: this.loader.load(`${texturesPath}/${name}/${nightTexture}`),
                transparent: true,
                opacity: nightOpacity,
                depthWrite: false,
                color: new THREE.Color(1, 1, 0.3)
            });
            this.planetNight = new THREE.Mesh(geometry, nightMat);
            this.planetNight.receiveShadow = false;
            this.group.add(this.planetNight);
        }
        else {
            this.planetNight = null;
        }

        // Cloud material
        if (cloudTexture) {
            const cloudTex = this.loader.load(`${texturesPath}/${name}/${cloudTexture}`);
            const cloudMat = new THREE.MeshStandardMaterial({
                map: cloudTex,
                alphaMap: cloudTex, // white areas cast shadows
                transparent: true,
                opacity: cloudOpacity,
                blending: THREE.NormalBlending
            });
            this.planetClouds = new THREE.Mesh(geometry, cloudMat);
            this.planetClouds.castShadow = true;
            this.planetClouds.receiveShadow = false;
            this.planetClouds.scale.setScalar(1.003);
            this.group.add(this.planetClouds);
        } 
        else {
            this.planetClouds = null;
        }

        // Axial tilt
        this.group.rotation.z = this.axialTilt;
        if (this.planetClouds) this.planetClouds.rotation.z = this.axialTilt;
    }   

    // Animate rotation
    rotate() {
        this.group.rotation.y += this.rotationSpeed;
        if (this.planetClouds) this.planetClouds.rotation.y += this.cloudRotationSpeed;
    }

    // Update night-light visibility (optional)
    updateNightLight(sunLight, camera, opacityMultiplier = 0.4) {
        if (!this.planetNight) return;
        
        this._planetPos = new THREE.Vector3();
        this._sunPos = new THREE.Vector3();
        this._camPos = new THREE.Vector3();

        this.group.getWorldPosition(this._planetPos);
        sunLight.getWorldPosition(this._sunPos);
        camera.getWorldPosition(this._camPos);

        const toSun = this._sunPos.sub(this._planetPos).normalize();
        const toCamera = this._camPos.sub(this._planetPos).normalize();

        const dot = toSun.dot(toCamera);

        const nightStrength = THREE.MathUtils.smoothstep(0.2, -0.4, dot);
        this.planetNight.material.opacity = nightStrength * opacityMultiplier;
    }

    setPosition(x, y, z) {
        if (x instanceof THREE.Vector3) {
            this.group.position.copy(x);
        }  
        else {
            this.group.position.set(x, y, z);
        }
    }
}
