

function focusOnPlanet(index) {
    if (index < 0 || index >= cameraTargets.length) return;

    currentTargetIndex = index;
    // Set the next target to the next planet in the array for smooth cycling
    nextTargetIndex = (index + 1) % cameraTargets.length;
}


let cameraTargets = [
    sun.group,
    mercury.group,
    venus.group,
    earth.group,
    moon.group,
    mars.group,
    jupiter.group,
    saturn.group,
    uranus.group,
    neptune.group,
    pluto.group,
];

let orbitAngle = 0;          // Current rotation around planet
let orbitRadius = 160;     // Distance from planet
let orbitHeight = 10;     // Height above planet
let orbitSpeed = 0.003;     // Rotation speed

let currentTargetIndex = 0;
let nextTargetIndex = 1;

// Lerp factor (controls speed of transition)
const lerpSpeed = 0.01; // smaller = slower

// Temporary vectors for calculations
const camPos = new THREE.Vector3();
const targetPos = new THREE.Vector3();
const currentLookAt = new THREE.Vector3();


let e = 0;



function Update() {
  // gameControls.update();

  // Get planet position
    cameraTargets[currentTargetIndex].getWorldPosition(targetPos);

    // Orbiting offset
    orbitAngle += orbitSpeed;
    const offsetX = Math.cos(orbitAngle) * orbitRadius;
    const offsetZ = Math.sin(orbitAngle) * orbitRadius;
    const offsetY = orbitHeight;
    const offset = new THREE.Vector3(offsetX, offsetY, offsetZ);

    // Desired camera position
    const desiredPos = targetPos.clone().add(offset);

    // Smooth camera movement
    camPos.lerpVectors(camera.position, desiredPos, lerpSpeed);
    camera.position.copy(camPos);

    // Smooth look at planet
    currentLookAt.lerpVectors(currentLookAt, targetPos, 0.01); // faster lerp
    camera.lookAt(currentLookAt);

    // Switch to next planet if close enough
    if (camera.position.distanceTo(desiredPos) < 1) {
        currentTargetIndex = nextTargetIndex;
        nextTargetIndex = (nextTargetIndex + 1) % cameraTargets.length;
        // reset orbit angle so camera orbit continues smoothly
        orbitAngle = 0;
    }

  if (e == -1000) {
    focusOnPlanet(0); // Sun
    orbitRadius = 1000; 
  }
  if (e == 0) {
    focusOnPlanet(1); // Mercury
    orbitRadius = 200; 
  }
  if (e == 1000) {
    focusOnPlanet(2); // Venus
    orbitRadius = 210; 
  }
  if (e == 2000) {
    focusOnPlanet(3); // Earth
    orbitRadius = 230; 
  }
  if (e == 3000) {
    focusOnPlanet(4); // Moon
    orbitRadius = 180; 
  }
  if (e == 4000) {
    focusOnPlanet(5); // Mars
    orbitRadius = 200; 
  }
  if (e == 5000) {
    focusOnPlanet(6); // Jupiter
    orbitRadius = 350; 
  }
  if (e == 6000) {
    focusOnPlanet(7); // Saturn
    orbitRadius = 320; 
  }
  if (e == 7000) {
    focusOnPlanet(8); // Uranus
    orbitRadius = 320; 
  }
  if (e == 8000) {
    focusOnPlanet(9); // Neptune
    orbitRadius = 300; 
  }
  if (e == 9000) {
    focusOnPlanet(10); // Pluto
    orbitRadius = 80; 
  }
  if (e == 10000) {
    e = -1200 
    focusOnPlanet(0); // Reset
    orbitRadius = 1000; 
  }
  e+=2;
}
