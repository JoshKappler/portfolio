// Canvas drawing for the globe loader, shared by the studio renderer and the
// standalone component. The caller provides the context and a view transform
// ({ toCanvas(point), scale }); all motion math comes from a createGlobe
// instance so surfaces cannot drift.
import { bars, pointAlong, smooth5, widthAlong } from './globe-core.js';
import { MARK_GEOMETRY } from './mark-geometry.js';

let INK = '250, 250, 250';
export function setInk(rgb) {
  INK = rgb;
}
// The mark ink is the caller's rendered glyph image, never a reconstruction:
// each frame draws it whole and erodes the melted spans out of it, so the
// intact letters are always the true font pixels. Erosion covers bars only;
// this mark has no tip appendages.
let markSprite = null;
export function setMark(canvas) {
  markSprite = canvas;
}
let erosionLayer = null;
const EDGE_FADE = 34;
const EDGE_SLICES = 8;
const ERODE_PAD = 8;

function makeGlyphBuckets() {
  const buckets = new Map();
  return {
    add(sizePx, alpha, glyph, x, y) {
      if (alpha < 0.02 || sizePx < 3) return;
      const size = Math.round(sizePx);
      if (!buckets.has(size)) buckets.set(size, []);
      buckets.get(size).push([alpha, glyph, x, y]);
    },
    flush(context) {
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      for (const [size, entries] of buckets) {
        context.font = `${size}px "Courier New", Courier, monospace`;
        for (const [alpha, glyph, x, y] of entries) {
          context.fillStyle = `rgba(${INK}, ${alpha.toFixed(3)})`;
          context.fillText(glyph, x, y);
        }
      }
      buckets.clear();
    },
  };
}

function drawRibbonWindow(context, view, bar, from, to, alpha, pad = 0) {
  const span = to - from;
  if (span < 1 || alpha < 0.01) return;
  const count = Math.max(3, Math.ceil(span / 8) + 1);
  const center = [];
  const left = [];
  const right = [];
  for (let i = 0; i < count; i += 1) {
    center.push(pointAlong(bar.points, bar.cumulative, from + span * i / (count - 1)));
  }
  for (let i = 0; i < count; i += 1) {
    const before = center[Math.max(0, i - 1)];
    const after = center[Math.min(count - 1, i + 1)];
    const dx = after[0] - before[0];
    const dy = after[1] - before[1];
    const magnitude = Math.hypot(dx, dy) || 1;
    const width = widthAlong(bar.widths, bar.cumulative, from + span * i / (count - 1)) + pad;
    left.push([center[i][0] - dy / magnitude * width, center[i][1] + dx / magnitude * width]);
    right.push([center[i][0] + dy / magnitude * width, center[i][1] - dx / magnitude * width]);
  }
  if (bar.face) {
    const blend = Math.max(0, 1 - Math.abs(to - bar.total) / 45);
    if (blend > 0) {
      const last = count - 1;
      const leftGap = Math.hypot(left[last][0] - bar.face[0][0], left[last][1] - bar.face[0][1]);
      const rightGap = Math.hypot(right[last][0] - bar.face[0][0], right[last][1] - bar.face[0][1]);
      const [leftTarget, rightTarget] = leftGap <= rightGap ? bar.face : [bar.face[1], bar.face[0]];
      left[last] = [
        left[last][0] + (leftTarget[0] - left[last][0]) * blend,
        left[last][1] + (leftTarget[1] - left[last][1]) * blend,
      ];
      right[last] = [
        right[last][0] + (rightTarget[0] - right[last][0]) * blend,
        right[last][1] + (rightTarget[1] - right[last][1]) * blend,
      ];
    }
  }
  context.beginPath();
  context.moveTo(...view.toCanvas(left[0]));
  for (let i = 1; i < count; i += 1) context.lineTo(...view.toCanvas(left[i]));
  for (let i = count - 1; i >= 0; i -= 1) context.lineTo(...view.toCanvas(right[i]));
  context.closePath();
  context.fillStyle = `rgba(${INK}, ${alpha.toFixed(3)})`;
  context.fill();
}

function erodeBar(context, view, bar, level) {
  const length = bar.total * level;
  const fadeSpan = Math.min(EDGE_FADE, length);
  if (bar.anchorAtEnd) {
    const edge = bar.total - length;
    drawRibbonWindow(context, view, bar, 0, edge + 0.75, 1, ERODE_PAD);
    for (let slice = 0; slice < EDGE_SLICES; slice += 1) {
      const a = edge + fadeSpan * slice / EDGE_SLICES;
      const b = edge + fadeSpan * (slice + 1) / EDGE_SLICES + 0.75;
      drawRibbonWindow(context, view, bar, a, b, 1 - smooth5((slice + 0.5) / EDGE_SLICES), ERODE_PAD);
    }
  } else {
    const edge = length;
    drawRibbonWindow(context, view, bar, edge - 0.75, bar.total, 1, ERODE_PAD);
    for (let slice = 0; slice < EDGE_SLICES; slice += 1) {
      const a = edge - fadeSpan * (slice + 1) / EDGE_SLICES - 0.75;
      const b = edge - fadeSpan * slice / EDGE_SLICES;
      drawRibbonWindow(context, view, bar, a, b, 1 - smooth5((slice + 0.5) / EDGE_SLICES), ERODE_PAD);
    }
  }
}

function drawMarkInk(context, view, globe, tau) {
  if (!markSprite || globe.inkLevelAt(tau) <= 0.002) return;
  const target = context.canvas;
  if (!erosionLayer || erosionLayer.width !== target.width || erosionLayer.height !== target.height) {
    erosionLayer = document.createElement('canvas');
    erosionLayer.width = target.width;
    erosionLayer.height = target.height;
  }
  const layer = erosionLayer.getContext('2d');
  layer.setTransform(1, 0, 0, 1, 0, 0);
  layer.clearRect(0, 0, erosionLayer.width, erosionLayer.height);
  layer.setTransform(context.getTransform());
  const origin = view.toCanvas([0, 0]);
  const size = MARK_GEOMETRY.mark.imgW * view.scale;
  layer.drawImage(markSprite, origin[0], origin[1], size, size);
  layer.globalCompositeOperation = 'destination-out';
  bars.forEach((bar, barIndex) => {
    const level = globe.pieceLevelAt(tau, barIndex);
    if (level > 0.998) return;
    erodeBar(layer, view, bar, level);
  });
  layer.globalCompositeOperation = 'source-over';
  context.save();
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.drawImage(erosionLayer, 0, 0);
  context.restore();
}

export function drawGlobeScene(context, view, globe, tau, clockMs, inkAlpha = 1) {
  const buckets = makeGlyphBuckets();
  for (const sprite of globe.glyphSprites(tau, clockMs)) {
    const canvasPos = view.toCanvas([sprite.x, sprite.y]);
    if (sprite.kind === 'dot') {
      const radius = sprite.r * view.scale;
      context.fillStyle = `rgba(${INK}, ${sprite.alpha.toFixed(3)})`;
      context.fillRect(canvasPos[0] - radius, canvasPos[1] - radius, radius * 2, radius * 2);
      continue;
    }
    const birth = sprite.birth ?? 1;
    const chunkAlpha = (1 - birth) * sprite.alpha;
    if (chunkAlpha > 0.02) {
      const w = sprite.chunkW * view.scale;
      const h = sprite.chunkH * view.scale;
      context.save();
      context.translate(canvasPos[0], canvasPos[1]);
      context.rotate(sprite.rot);
      context.fillStyle = `rgba(${INK}, ${chunkAlpha.toFixed(3)})`;
      context.fillRect(-w / 2, -h / 2, w, h);
      context.restore();
    }
    buckets.add(sprite.size * view.scale, birth * sprite.alpha, sprite.char, canvasPos[0], canvasPos[1]);
  }
  buckets.flush(context);
  if (inkAlpha > 0.01) {
    context.save();
    context.globalAlpha *= inkAlpha;
    drawMarkInk(context, view, globe, tau);
    context.restore();
  }
}
