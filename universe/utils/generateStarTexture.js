function generateStarTextureSphere(size = 2048, starCount = 2000) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = 'rgb(0, 0, 24)';
    ctx.fillRect(0, 0, size, size);

    const cx = size / 2;
    const cy = size / 2;
    const maxD = Math.hypot(cx, cy);

    let placed = 0;
    while (placed < starCount) {
        const x = Math.random() * size;
        const y = Math.random() * size;

        // Distance from center (0..1)
        const dx = x - cx;
        const dy = y - cy;
        const d = Math.hypot(dx, dy) / maxD;

        // Density bias: MORE stars near center
        const density = Math.pow(1 - d, 1.2);
        if (Math.random() > density) continue;

        // Size bias: SMALLER stars near center
        const sizeBias = 0.2 + d * 0.6; // center ~0.4, edge ~1.2
        const radius = (Math.random() * 1.0 + 0.4) * sizeBias;

        // Brightness (optional subtle edge boost)
        const alpha = (Math.random() * 0.6 + 0.4) * (0.7 + d * 0.3);
        //const alpha = (Math.random() * 0.6 + 0.4)

        // Slight color variation
        const tint = Math.random() * 40;

        ctx.beginPath();
        ctx.fillStyle = `rgba(${255 - tint}, ${255 - tint}, 255, ${alpha})`;
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        placed++;
    }

    return canvas;
}


function generateGalaxyStarLineCenterTextureSphere(size = 2048, starCount = 4000) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = 'rgb(0, 0, 24)';
    ctx.fillRect(0, 0, size, size);

    const cx = size / 2;
    const cy = size / 2;
    const maxD = Math.hypot(cx, cy);

    let placed = 0;
    while (placed < starCount) {
      const x = Math.random() * size;
      const d_y = Math.random() * size;

      // Y concentrated near center (galactic line)
      const y = cy + (Math.random() - 0.5) * size * 1.2  * Math.random(); // adjust thickness here

      // Distance from center (for radial falloff if desired)
      const dx = x - cx;
      const dy = y - cy;
      const d = Math.hypot(dx, dy) / maxD;

      // Size bias: SMALLER stars near center
      const sizeBias = 0.2 + d * 0.6; // center ~0.3, edge ~1.3
      const radius = (Math.random() * 1.0 + 0.4) * sizeBias;

      // Brightness stronger on the edges
      const alpha = (Math.random() * 0.6 + 0.4) * (0.6 + d * 0.3);
      // Brightness: stronger near center line
      //const alpha = (Math.random() * 0.6 + 0.4) * (1 - Math.abs(dy) / (size/2));
      //const alpha = (Math.random() * 0.6 + 0.4)

      // Slight color variation
      const tint = Math.random() * 40;

      ctx.beginPath();
      ctx.fillStyle = `rgba(${255 - tint}, ${255 - tint}, 255, ${alpha})`;
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      placed++;
    }

    return canvas;
}

function generateGalaxyStarLineCenterTextureCube(size = 2048, starCount = 9000) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = 'rgb(0, 0, 24)';
    ctx.fillRect(0, 0, size, size);

    const cy = size / 2;

    const bandHalfHeight = size * 0.05;   // central galactic line thickness
    const bandOuter = size * 0.25;        // outer fading edges

    let placed = 0;
    while (placed < starCount) {
        const x = Math.random() * size;

        // Vertical placement biased toward galactic line
        const y = cy + (Math.random() - 0.5) * size * 1.4  * Math.random();

        // Size bias (smaller near center line)
        const distanceFromLine = Math.abs(y - cy) / (bandHalfHeight + bandOuter);
        const sizeBias = 0.2 + distanceFromLine * 0.5;
        const radius = (Math.random() * 1 + 0.4) * sizeBias;

        // Brightness bias: stronger near center line
        const alpha = (Math.random() * 0.6 + 0.4) * (1 - distanceFromLine * 0.5);
        //const alpha = (Math.random() * 0.6 + 0.4)

        // Slight color variation
        const tint = Math.random() * 40;

        ctx.beginPath();
        ctx.fillStyle = `rgba(${255 - tint}, ${255 - tint}, 255, ${alpha})`;
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        placed++;
    }

    return canvas;
}

function experimentTexture(size = 2048, starCount = 4000) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const minTransperency = 0.4;
  const minRadius = 0.4;
  const maxRaidus = 2;
  const sizeBias = 1;
  const transperencyBias = 1;

  ctx.fillStyle = 'rgb(0, 0, 24)';
  ctx.fillRect(0, 0, size, size);

  let placed = 0;
  while (placed < starCount) {
    const x = Math.random() * size;
    const y = Math.random() * size;

    const radius = (Math.random() * maxRaidus + minRadius) * sizeBias;
    const alpha = (Math.random() * (1-minTransperency) + minTransperency) * transperencyBias;
    const tint = Math.random() * 40;

    ctx.beginPath();
    ctx.fillStyle = `rgba(${255 - tint}, ${255 - tint}, 255, ${alpha})`;
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    placed++;
  }
  
  return canvas;
}

function drawGalaxy(ctx, cx, cy, radius, rotation) {
  const armCount = 3 + Math.floor(Math.random() * 3);
  const starCount = radius * 40;

  // Core glow
  const gradient = ctx.createRadialGradient(
    cx, cy, 0,
    cx, cy, radius * 0.4
  );
  gradient.addColorStop(0, 'rgba(255,255,255,0.9)');
  gradient.addColorStop(0.3, 'rgba(180,180,255,0.5)');
  gradient.addColorStop(1, 'rgba(0,0,0,0)');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.4, 0, Math.PI * 2);
  ctx.fill();

  // Spiral arms
  for (let i = 0; i < starCount; i++) {
    const t = Math.random();           // 0 → 1 along arm
    const arm = Math.floor(Math.random() * armCount);

    const angle =
      rotation +
      arm * (Math.PI * 2 / armCount) +
      t * Math.PI * 4;

    const dist = t * radius;
    const spread = (1 - t) * radius * 0.1;

    const x = cx + Math.cos(angle) * dist + (Math.random() - 0.5) * spread;
    const y = cy + Math.sin(angle) * dist + (Math.random() - 0.5) * spread;

    const alpha = Math.random() * 0.5 + 0.3;
    const r = Math.random() * 1.2 + 0.3;

    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function galaxyTexture(size = 2048, galaxyCount = 10) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = 'rgb(0, 0, 24)';
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < galaxyCount; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const radius = Math.random() * 150 + 80;
    const rotation = Math.random() * Math.PI * 2;

    drawGalaxy(ctx, x, y, radius, rotation);
  }

  return canvas;
}

const canvas = galaxyTexture(2048, 10);
//const canvas = experimentTexture(2048, 2000);
//const canvas = generateStarTextureSphere(2048, 2000);
//const canvas = generateGalaxyStarLineCenterTextureSphere(2048, 3000);
//const canvas = generateGalaxyStarLineCenterTextureCube(2048, 2000);

const link = document.createElement('a');
link.download = 'nz.png';
link.href = canvas.toDataURL('image/png');
link.click();
