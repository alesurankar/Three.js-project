import * as THREE from "three";

export class Star {
  constructor({
    // default for sun
    name = "sun",
    size = 20,
    position = new THREE.Vector3(10, 10, 50),
    intensity = 100,
    distance = 0,
    texturesPath = "./textures",
    color = 0xffffff,
  } = {}) {
    this.loader = new THREE.TextureLoader();

    // group
    this.group = new THREE.Group();
    this.group.position.copy(position);

    // geometry
    const geometry = new THREE.IcosahedronGeometry(size, 12);

    // material
    const material = new THREE.MeshBasicMaterial({
        map: this.loader.load(`${texturesPath}/${name}/${name}.jpg`),
        color: color,
    });
    this.star = new THREE.Mesh(geometry, material);
    this.star.castShadow = false;
    this.star.receiveShadow = false;
    this.group.add(this.star);

    // point light
    this.light = new THREE.PointLight(color, intensity, distance);
    this.light.castShadow = true;
    this.light.shadow.mapSize.set(2048, 2048);
    this.light.shadow.camera.near = 0.1;
    this.light.shadow.camera.far = distance === 0 ? 5000 : distance;
    this.light.position.set(0, 0, 0);
    this.group.add(this.light);
  }

    setPosition(x, y, z) {
        if (x instanceof THREE.Vector3) {
            this.group.position.copy(x);
        } else {
            this.group.position.set(x, y, z);
        }
    }
}