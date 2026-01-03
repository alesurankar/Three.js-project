import * as THREE from "three";

export class AsteroidBelt {
  constructor({
    starCount = 20000,
    radius = 14000,
    minDistance = 7000,
    thickness = 1000, // thickness of the belt along Z-axis
    starSize = 60,
    texturePath = "./textures/star.png",
  } = {}) {
    this.starCount = starCount;
    this.radius = radius;
    this.minDistance = minDistance;
    this.thickness = thickness;
    this.starSize = starSize;
    this.texturePath = texturePath;

    this.geometry = this._createGeometry();
    this.material = this._createMaterial();
    this.points = new THREE.Points(this.geometry, this.material);
  }

  _createGeometry() {
    const positions = new Float32Array(this.starCount * 3);
    const colors = new Float32Array(this.starCount * 3);

    for (let i = 0; i < this.starCount; i++) {
      // Polar coordinates for a flat disk
      const angle = Math.random() * 2 * Math.PI; // full circle
      const r = this.minDistance + (this.radius - this.minDistance) * Math.cbrt(Math.random()); // radial distribution

      const x = r * Math.cos(angle);
      const y = (Math.random() - 0.5) * this.thickness; // thin vertical spread
      const z = r * Math.sin(angle);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Slightly yellowish star/asteroid color
      const intensity = 0.4 + Math.random() * 0.2;
      colors[i * 3] = 1.0 * intensity;
      colors[i * 3 + 1] = 1.0 * intensity;
      colors[i * 3 + 2] = 0.6 * intensity;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    return geometry;
  }

  _createMaterial() {
    const texture = new THREE.TextureLoader().load(this.texturePath);

    return new THREE.PointsMaterial({
      size: this.starSize,
      map: texture,
      transparent: true,
      alphaTest: 0.01,
      depthWrite: false,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
  }

  addToScene(scene) {
    scene.add(this.points);
  }
}