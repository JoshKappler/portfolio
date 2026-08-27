// Canvas drawing for the globe loader, shared by the studio renderer and the
// standalone component. The caller provides the context and a view transform
// ({ toCanvas(point), scale }); all motion math comes from a createGlobe
// instance so surfaces cannot drift.
import { R, bars, mcx, mcy, pointAlong, smooth5, tips, widthAlong } from './globe-core.js';

let INK = '250, 250, 250';
export function setInk(rgb) {
  INK = rgb;
}
const EDGE_FADE = 34;
const EDGE_SLICES = 8;

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

function drawRibbonWindow(context, view, bar, from, to, alpha) {
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
    const width = widthAlong(bar.widths, bar.cumulative, from + span * i / (count - 1));
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

function drawBarInk(context, view, globe, tau) {
  bars.forEach((bar, barIndex) => {
    const level = globe.pieceLevelAt(tau, barIndex);
    if (level <= 0.002) return;
    const length = bar.total * level;
    const from = bar.anchorAtEnd ? bar.total - length : 0;
    const to = bar.anchorAtEnd ? bar.total : length;
    const fadeSpan = Math.min(EDGE_FADE, length);
    if (level > 0.998) {
      drawRibbonWindow(context, view, bar, from, to, 1);
      return;
    }
    if (bar.anchorAtEnd) {
      drawRibbonWindow(context, view, bar, from + fadeSpan, to, 1);
      for (let slice = 0; slice < EDGE_SLICES; slice += 1) {
        const a = from + fadeSpan * slice / EDGE_SLICES;
        const b = from + fadeSpan * (slice + 1) / EDGE_SLICES + 0.75;
        drawRibbonWindow(context, view, bar, a, b, smooth5((slice + 0.5) / EDGE_SLICES));
      }
    } else {
      drawRibbonWindow(context, view, bar, from, to - fadeSpan, 1);
      for (let slice = 0; slice < EDGE_SLICES; slice += 1) {
        const a = to - fadeSpan * (slice + 1) / EDGE_SLICES - 0.75;
        const b = to - fadeSpan * slice / EDGE_SLICES;
        drawRibbonWindow(context, view, bar, a, b, smooth5((slice + 0.5) / EDGE_SLICES));
      }
    }
  });
}

function drawTips(context, view, globe, tau) {
  tips.forEach((tip, tipIndex) => {
    const shapes = globe.tipShapesAt(tau, tipIndex);
    if (!shapes.length) return;
    context.save();
    context.beginPath();
    context.moveTo(...view.toCanvas(tip.poly[0]));
    for (let i = 1; i < tip.poly.length; i += 1) context.lineTo(...view.toCanvas(tip.poly[i]));
    context.closePath();
    context.clip();
    context.fillStyle = `rgba(${INK}, 1)`;
    for (const shape of shapes) {
      context.beginPath();
      context.moveTo(...view.toCanvas(shape[0]));
      for (let i = 1; i < shape.length; i += 1) context.lineTo(...view.toCanvas(shape[i]));
      context.closePath();
      context.fill();
    }
    context.restore();
  });
}

const FULL_INK = { pieceLevelAt: () => 1 };

// Draws the fully assembled mark from the same geometry the melt uses, so the
// hold frame and the reform crossfade cannot drift from the animation.
export function drawMarkInk(context, view, alpha) {
  if (alpha < 0.01) return;
  context.save();
  context.globalAlpha = alpha;
  drawBarInk(context, view, FULL_INK, 0);
  context.restore();
}

export function drawGlobeScene(context, view, globe, tau, clockMs) {
  const ringAlpha = globe.ringAlphaAt(tau);
  if (ringAlpha > 0.01) {
    const center = view.toCanvas([mcx, mcy]);
    context.beginPath();
    context.arc(center[0], center[1], R * view.scale, 0, Math.PI * 2);
    context.strokeStyle = `rgba(${INK}, ${(0.09 * ringAlpha).toFixed(3)})`;
    context.lineWidth = 1;
    context.stroke();
  }
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
  drawBarInk(context, view, globe, tau);
  drawTips(context, view, globe, tau);
}
