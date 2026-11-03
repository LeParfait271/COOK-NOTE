// Constellation des saveurs : dessin du ciel en canvas (telephone), utilise par app-kitchen.js.
// Telephone : le ciel est dessine dans un canvas (un seul element a composer
// au lieu de 1 700 noeuds SVG, redessin complet en quelques millisecondes).
const CONSTELLATION_SPRITES = new Map();
function constellationRgb(hex) {
  const value = parseInt(String(hex).replace('#', ''), 16) || 0xf3cf86;
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}
function constellationHalo(color) {
  let sprite = CONSTELLATION_SPRITES.get(color);
  if (sprite) return sprite;
  const [r, g, b] = constellationRgb(color);
  sprite = document.createElement('canvas');
  sprite.width = sprite.height = 64;
  const context = sprite.getContext('2d');
  const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255,250,240,1)');
  gradient.addColorStop(0.28, `rgba(${r},${g},${b},.5)`);
  gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
  context.fillStyle = gradient;
  context.fillRect(0, 0, 64, 64);
  const core = `rgb(${Math.round(r * 0.3 + 255 * 0.7)},${Math.round(g * 0.3 + 250 * 0.7)},${Math.round(b * 0.3 + 240 * 0.7)})`;
  sprite.core = core;
  CONSTELLATION_SPRITES.set(color, sprite);
  return sprite;
}
function constellationCanvasFrame(canvas, sky) {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const { width, height } = sky.size;
  const cw = Math.round(rect.width * dpr);
  const ch = Math.round(rect.height * dpr);
  const fit = Math.min(cw / width, ch / height);
  return { rect, dpr, cw, ch, fit, ox: (cw - width * fit) / 2, oy: (ch - height * fit) / 2 };
}
function drawConstellationCanvas(canvas, sky, view, selected, focus, base) {
  const frame = constellationCanvasFrame(canvas, sky);
  const { dpr, cw, ch, fit, ox, oy } = frame;
  const { width, height } = sky.size;
  if (canvas.width !== cw || canvas.height !== ch) {
    canvas.width = cw;
    canvas.height = ch;
  }
  const ctx = canvas.getContext('2d');
  // Fond (voie lactee + poussiere) prepare une fois par taille d'ecran.
  if (!canvas.background || canvas.background.key !== `${cw}x${ch}`) {
    const background = document.createElement('canvas');
    background.width = cw;
    background.height = ch;
    background.key = `${cw}x${ch}`;
    const bg = background.getContext('2d');
    bg.setTransform(fit, 0, 0, fit, ox, oy);
    const veil = (cx, cy, rx, ry, angle, stops) => {
      bg.save();
      bg.translate(cx, cy);
      bg.rotate(angle);
      bg.scale(1, ry / rx);
      const gradient = bg.createRadialGradient(0, 0, 0, 0, 0, rx);
      stops.forEach(([offset, color]) => gradient.addColorStop(offset, color));
      bg.fillStyle = gradient;
      bg.fillRect(-rx, -rx, rx * 2, rx * 2);
      bg.restore();
    };
    const milky = [[0, 'rgba(201,184,255,.16)'], [0.45, 'rgba(125,140,216,.07)'], [1, 'rgba(11,16,34,0)']];
    veil(width / 2, height / 2, Math.max(width, height) * 0.62, Math.min(width, height) * 0.16, ((width > height ? -18 : -62) * Math.PI) / 180, milky);
    veil(width * 0.28, height * 0.7, width * 0.22, height * 0.16, 0, [[0, 'rgba(240,178,122,.12)'], [1, 'rgba(240,178,122,0)']]);
    veil(width * 0.76, height * 0.26, width * 0.2, height * 0.14, 0, milky);
    bg.fillStyle = '#fff';
    sky.dust.forEach(dot => {
      bg.globalAlpha = dot.o;
      bg.beginPath();
      bg.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
      bg.fill();
    });
    canvas.background = background;
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  ctx.clearRect(0, 0, cw, ch);
  ctx.drawImage(canvas.background, 0, 0);
  const k = fit * view.scale;
  const tx = ox + fit * (width / 2 + view.scale * (view.x - width / 2));
  const ty = oy + fit * (height / 2 + view.scale * (view.y - height / 2));
  if (base) {
    // Pendant le geste : une image du ciel preparee au debut, simplement
    // deplacee (deux copies d'image par frame au lieu de tout redessiner).
    const margin = 80;
    const key = `${base.scale}|${selected}|${focus}|${cw}x${ch}`;
    if (!canvas.layer || canvas.layer.key !== key) {
      const layer = document.createElement('canvas');
      const resolution = Math.min(fit * base.scale, 2600 / (width + margin * 2), 2600 / (height + margin * 2));
      layer.width = Math.ceil((width + margin * 2) * resolution);
      layer.height = Math.ceil((height + margin * 2) * resolution);
      layer.key = key;
      layer.resolution = resolution;
      const layerCtx = layer.getContext('2d');
      layerCtx.setTransform(resolution, 0, 0, resolution, margin * resolution, margin * resolution);
      drawConstellationWorld(layerCtx, sky, base.scale, selected, focus, dpr / (fit * base.scale));
      canvas.layer = layer;
    }
    const ratio = k / canvas.layer.resolution;
    ctx.imageSmoothingEnabled = true;
    ctx.setTransform(ratio, 0, 0, ratio, tx - margin * k, ty - margin * k);
    ctx.drawImage(canvas.layer, 0, 0);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    return;
  }
  ctx.setTransform(k, 0, 0, k, tx, ty);
  drawConstellationWorld(ctx, sky, view.scale, selected, focus, dpr / k);
}
function drawConstellationWorld(ctx, sky, scale, selected, focus, lineUnit) {
  const { width, height } = sky.size;
  const linked = new Set();
  if (selected >= 0) {
    linked.add(selected);
    sky.links.forEach(({ a, b }) => {
      if (a === selected) linked.add(b);
      if (b === selected) linked.add(a);
    });
  }
  // Liens : un seul trace pour les liens calmes, un autre pour les liens allumes.
  ctx.lineWidth = lineUnit;
  ctx.strokeStyle = 'rgba(215,190,140,.16)';
  ctx.beginPath();
  const lit = [];
  sky.links.forEach(({ a, b, same }) => {
    if (selected >= 0 && (a === selected || b === selected)) lit.push([a, b]);
    else if (same) {
      ctx.moveTo(sky.stars[a].x, sky.stars[a].y);
      ctx.lineTo(sky.stars[b].x, sky.stars[b].y);
    }
  });
  ctx.stroke();
  if (lit.length) {
    ctx.lineWidth = 1.4 * lineUnit;
    ctx.strokeStyle = 'rgba(243,207,134,.85)';
    ctx.beginPath();
    lit.forEach(([a, b]) => {
      ctx.moveTo(sky.stars[a].x, sky.stars[a].y);
      ctx.lineTo(sky.stars[b].x, sky.stars[b].y);
    });
    ctx.stroke();
  }
  const dimOf = (item, position) => (position !== selected && selected >= 0 && !linked.has(position)) || (selected < 0 && focus && item.family !== focus);
  sky.stars.forEach((item, position) => {
    const sprite = constellationHalo(item.color);
    const base = dimOf(item, position) ? 0.28 : 1;
    if (item.named || linked.has(position)) {
      const radius = item.size * 4.2;
      ctx.globalAlpha = base * (position === selected || (focus && item.family === focus) ? 1 : 0.55);
      ctx.drawImage(sprite, item.x - radius, item.y - radius, radius * 2, radius * 2);
    }
    ctx.globalAlpha = base;
    ctx.fillStyle = sprite.core;
    ctx.beginPath();
    ctx.arc(item.x, item.y, item.size, 0, Math.PI * 2);
    ctx.fill();
  });
  const portrait = width < height;
  const showAll = scale >= 1.7;
  ctx.textAlign = 'center';
  [true, false].forEach(major => {
    ctx.font = `500 ${major ? (portrait ? 24 : 15) : (portrait ? 19 : 12)}px system-ui, sans-serif`;
    sky.stars.forEach((item, position) => {
      const highlighted = position === selected || linked.has(position);
      if (Boolean(item.named) !== major) return;
      if (!(item.named || showAll || highlighted || (focus && item.family === focus))) return;
      ctx.globalAlpha = (dimOf(item, position) ? 0.28 : 1) * (major ? 1 : 0.8);
      ctx.fillStyle = highlighted ? item.color : 'rgba(239,230,212,.55)';
      ctx.fillText(item.label, item.x, item.y + item.size * 4.2 + 14);
    });
  });
  ctx.globalAlpha = 1;
}
function pickConstellationStar(canvas, sky, view, clientX, clientY) {
  const { rect, dpr, fit, ox, oy } = constellationCanvasFrame(canvas, sky);
  const { width, height } = sky.size;
  const k = fit * view.scale;
  const x = ((clientX - rect.left) * dpr - (ox + fit * (width / 2 + view.scale * (view.x - width / 2)))) / k;
  const y = ((clientY - rect.top) * dpr - (oy + fit * (height / 2 + view.scale * (view.y - height / 2)))) / k;
  let best = -1;
  let bestDistance = Infinity;
  sky.stars.forEach((item, position) => {
    const distance = Math.hypot(item.x - x, item.y - y);
    if (distance <= Math.max(26 / view.scale, item.size * 3) && distance < bestDistance) {
      best = position;
      bestDistance = distance;
    }
  });
  return best;
}
