import * as THREE from "three";


const starCount = 20000;
const positions = new Float32Array(starCount * 3);
const colors = new Float32Array(starCount * 3);
const radius = 14000;
const minDistance = 7000;


// generate positions inside spherical shell
for (let i = 0; i < starCount; i++) {
  const phi = Math.random() * 2 * Math.PI;
  const costheta = Math.random() * 2 - 1;
  const theta = Math.acos(costheta);
  const r = minDistance + (radius - minDistance) * Math.cbrt(Math.random());

  const x = r * Math.sin(theta) * Math.cos(phi);
  const y = r * Math.sin(theta) * Math.sin(phi);
  const z = r * Math.cos(theta);

  positions[i * 3] = x;
  positions[i * 3 + 1] = y;
  positions[i * 3 + 2] = z;

  const intensity = 0.8 + Math.random() * 0.2;
  colors[i * 3] = 1.0 * intensity;      // r
  colors[i * 3 + 1] = 1.0 * intensity;  // g
  colors[i * 3 + 2] = 0.8 * intensity;  // b (slightly yellowish)
}


export const starGeometry = new THREE.BufferGeometry();
starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));



export const starMaterial = new THREE.PointsMaterial({
  size: 60,
  map: new THREE.TextureLoader().load("./textures/star.png"),
  transparent: true,
  alphaTest: 0.01,
  depthWrite: false,
  vertexColors: true,
  blending: THREE.AdditiveBlending,
  sizeAttenuation: true
});
