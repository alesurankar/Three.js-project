import * as THREE from "three";

export class Planet {
  constructor({
    //default for earth
    name = "earth",
    size = 10,
    rotationSpeed = 0.001,
    cloudRotationSpeed = 0.0003,
    texturesPath = "./textures",
    dayTexture = "day.jpg",
    nightTexture = "night.jpg",
    cloudTexture = "clouds.jpg",
    nightOpacity = 0.4,
    cloudOpacity = 0.5,
    axialTilt = -23.4
  } = {}) {
    this.loader = new THREE.TextureLoader();
    this.group = new THREE.Group();

    this.rotationSpeed = rotationSpeed;
    this.cloudRotationSpeed = cloudRotationSpeed;
    this.axialTilt = axialTilt * Math.PI / 180;

    // Geometry
    const geometry = new THREE.IcosahedronGeometry(size, 12);

    // Day material
    const dayMat = new THREE.MeshStandardMaterial({
      map: this.loader.load(`${texturesPath}/${name}/${dayTexture}`),
      roughness: 1,
      metalness: 0
    });
    this.planetDay = new THREE.Mesh(geometry, dayMat);
    this.planetDay.receiveShadow = true;
    this.group.add(this.planetDay);

    // Night material
    const nightMat = new THREE.MeshBasicMaterial({
      map: this.loader.load(`${texturesPath}/${name}/${nightTexture}`),
      transparent: true,
      opacity: nightOpacity,
      depthWrite: false,
      color: new THREE.Color(1, 1, 0.3)
    });
    this.planetNight = new THREE.Mesh(geometry, nightMat);
    this.planetNight.receiveShadow = true;
    this.group.add(this.planetNight);

    // Cloud material
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

    // Axial tilt
    this.group.rotation.z = this.axialTilt;
    this.planetClouds.rotation.z = this.axialTilt;
  }

  // Animate rotation
  rotate() {
    this.group.rotation.y += this.rotationSpeed;
    this.planetClouds.rotation.y += this.cloudRotationSpeed;
  }

  // Update night-light visibility (optional)
  updateNightLight(sunLight, camera, minDot = -0.2, maxDot = 0.1, opacityMultiplier = 0.4) {
    const planetPos = new THREE.Vector3();
    const sunPos = new THREE.Vector3();
    const camPos = new THREE.Vector3();

    this.group.getWorldPosition(planetPos);
    sunLight.getWorldPosition(sunPos);
    camera.getWorldPosition(camPos);

    const toSun = sunPos.clone().sub(planetPos).normalize();
    const toCamera = camPos.clone().sub(planetPos).normalize();

    const dot = toSun.dot(toCamera);

    const nightStrength = THREE.MathUtils.smoothstep(maxDot, minDot, dot);
    this.planetNight.material.opacity = nightStrength * opacityMultiplier;
  }
}
