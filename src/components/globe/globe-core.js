// Pure animation math for the globe loader. No canvas, no DOM.
// Consumed by globe-renderer.js (studio), globe-loader.js (component),
// and globe/ascii.mjs (terminal). Change motion only here.
import { MARK_GEOMETRY } from './mark-geometry.js';
import { GLOBE_DATA } from './globe-data.js';

export const GLOBE_TIMING = { moveMs: 5200, holdMs: 500 };

export const COUNTRIES = {
  china: { label: 'China', lon: 105 },
  japan: { label: 'Japan', lon: 138 },
  korea: { label: 'South Korea', lon: 127.5 },
  australia: { label: 'Australia', lon: 134 },
  indonesia: { label: 'Indonesia', lon: 117 },
  vietnam: { label: 'Vietnam', lon: 106 },
  thailand: { label: 'Thailand', lon: 101 },
  india: { label: 'India', lon: 78 },
  russia: { label: 'Russia', lon: 50 },
  saudiarabia: { label: 'Saudi Arabia', lon: 45 },
  turkey: { label: 'Turkey', lon: 35 },
  egypt: { label: 'Egypt', lon: 30 },
  southafrica: { label: 'South Africa', lon: 25 },
  greece: { label: 'Greece', lon: 22 },
  italy: { label: 'Italy', lon: 12 },
  germany: { label: 'Germany', lon: 10 },
  nigeria: { label: 'Nigeria', lon: 8 },
  france: { label: 'France', lon: 2 },
  uk: { label: 'United Kingdom', lon: -2 },
  spain: { label: 'Spain', lon: -4 },
  brazil: { label: 'Brazil', lon: -52 },
  argentina: { label: 'Argentina', lon: -64 },
  usa: { label: 'United States', lon: -95 },
  canada: { label: 'Canada', lon: -100 },
  mexico: { label: 'Mexico', lon: -102 },
};

export const GLOBE_DEFAULTS = {
  start: 'china',
  end: 'usa',
  moveMs: GLOBE_TIMING.moveMs,
  holdMs: GLOBE_TIMING.holdMs,
  ocean: 1,
  shimmer: 1,
};

const RAD = Math.PI / 180;
export const R = 680;
export const STAGE_HALF = 830;
const TILT = 18 * RAD;
const COS_T = Math.cos(TILT);
const SIN_T = Math.sin(TILT);
const MELT0 = 0.05;
const MELT_SPAN = 0.19;
const REFILL_SPAN = MELT_SPAN;
const REFILL_END = 0.955;
const MAX_SHIFT = 0.045;
export const RASTER_OUT = [0, 0.05];
export const RASTER_IN = [0.955, 1];

const POOLS = {
  latin: { chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', wide: false },
  latinAccent: { chars: 'ÀÂÄÇÉÈÊËÎÏÔÖÙÛÜÅØÆŒŁŠŽČĆŃŐ', wide: false },
  hanzi: { chars: '中文语言世界文字翻译你好谢学习书写北京上海山河湖海云天地人月日', wide: true },
  kana: { chars: 'アイウエオカキクケコサシスセソタチツテトあかさたなはまやらわ', wide: true },
  hangul: { chars: '가나다라마바사아자차카타파하한국어글말씨', wide: true },
  cyrillic: { chars: 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯ', wide: false },
  devanagari: { chars: 'अआइईउऊएऐओकखगघचछजझटठडतथदधनपफबभमयरलवशषसह', wide: false },
  arabic: { chars: 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي', wide: false },
  thai: { chars: 'กขคงจฉชซญดตถทธนบปผพฟภมยรลวศษสหอ', wide: false },
  greek: { chars: 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ', wide: false },
  spanish: { chars: 'ÑÁÉÍÓÚÜ¿¡', wide: false },
  portuguese: { chars: 'ÃÕÇÁÂÊÉÍÓÔÚ', wide: false },
  vietnamese: { chars: 'ĂÂĐÊÔƠƯẠẢẼỀỘỜỮ', wide: false },
};

export const clamp = (value, low = 0, high = 1) => Math.min(high, Math.max(low, value));
export const smooth5 = (value) => {
  const x = clamp(value);
  return x * x * x * (x * (x * 6 - 15) + 10);
};
const smooth7 = (value) => {
  const x = clamp(value);
  return x ** 4 * (35 - 84 * x + 70 * x * x - 20 * x ** 3);
};
export const fadeIn = (tau, from, to) => smooth5((tau - from) / (to - from));

export const rasterAlphaAt = (tau) => Math.max(1 - fadeIn(tau, ...RASTER_OUT), fadeIn(tau, ...RASTER_IN));

export function globePhaseAt(tau) {
  if (tau < 0.34) return 'Scatter';
  if (tau < 0.7) return 'Spin';
  if (tau < 0.955) return 'Gather';
  if (tau < 1) return 'Reform';
  return 'Lock';
}

function invSmooth5(target) {
  let low = 0;
  let high = 1;
  for (let i = 0; i < 26; i += 1) {
    const mid = (low + high) / 2;
    if (smooth5(mid) < target) low = mid;
    else high = mid;
  }
  return (low + high) / 2;
}

const cumOf = (points) => {
  const cumulative = [0];
  for (let index = 1; index < points.length; index += 1) {
    cumulative.push(cumulative[index - 1] + Math.hypot(
      points[index][0] - points[index - 1][0],
      points[index][1] - points[index - 1][1],
    ));
  }
  return cumulative;
};

export const mcx = MARK_GEOMETRY.mark.mcx;
export const mcy = MARK_GEOMETRY.mark.mcy;

export function pointAlong(points, cumulative, distance) {
  const target = clamp(distance, 0, cumulative.at(-1));
  let low = 0;
  let high = cumulative.length - 1;
  while (low + 1 < high) {
    const mid = (low + high) >> 1;
    if (cumulative[mid] <= target) low = mid;
    else high = mid;
  }
  const mix = (target - cumulative[low]) / (cumulative[high] - cumulative[low] || 1);
  return [
    points[low][0] + (points[high][0] - points[low][0]) * mix,
    points[low][1] + (points[high][1] - points[low][1]) * mix,
  ];
}

export function widthAlong(widths, cumulative, distance) {
  const target = clamp(distance, 0, cumulative.at(-1));
  let low = 0;
  let high = cumulative.length - 1;
  while (low + 1 < high) {
    const mid = (low + high) >> 1;
    if (cumulative[mid] <= target) low = mid;
    else high = mid;
  }
  const mix = (target - cumulative[low]) / (cumulative[high] - cumulative[low] || 1);
  return widths[low] * (1 - mix) + widths[high] * mix;
}

export const bars = MARK_GEOMETRY.elements.map((element) => {
  const cumulative = cumOf(element.homePts);
  const total = cumulative.at(-1);
  const startGap = Math.hypot(element.homePts[0][0] - mcx, element.homePts[0][1] - mcy);
  const endGap = Math.hypot(element.homePts.at(-1)[0] - mcx, element.homePts.at(-1)[1] - mcy);
  return {
    points: element.homePts,
    widths: element.homeHw,
    cumulative,
    total,
    anchorAtEnd: endGap <= startGap,
    face: element.name === 'E0' && MARK_GEOMETRY.e0Face?.length === 2 ? MARK_GEOMETRY.e0Face : null,
  };
});

export const tips = MARK_GEOMETRY.apps.map((app) => ({
  poly: app.poly,
  reveal: app.reveal,
  arms: app.reveal.arms.map((arm) => ({
    ...arm,
    length: Math.hypot(arm.freeEnd[0] - arm.elbow[0], arm.freeEnd[1] - arm.elbow[1]),
  })),
}));

const totalInk = bars.reduce((sum, bar) => sum + bar.total, 0)
  + tips.reduce((sum, tip) => sum + tip.arms.reduce((armSum, arm) => armSum + arm.length, 0), 0);

// Piece order: bars 0-5, then tips 6-7. Each piece melts on its own shifted
// window so the mark shatters unevenly; refill order is the exact mirror.
const PIECE_COUNT = bars.length + tips.length;
const pieceShift = Array.from({ length: PIECE_COUNT }, (_, i) => ((i * 5) % PIECE_COUNT) / (PIECE_COUNT - 1) * MAX_SHIFT);
const meltStartOf = (piece) => MELT0 + pieceShift[piece];
const refillStartOf = (piece) => (REFILL_END - REFILL_SPAN) - pieceShift[piece];

function resolveLon(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const country = COUNTRIES[String(value).toLowerCase()];
  if (!country) throw new Error(`Unknown country "${value}". Use a longitude or one of: ${Object.keys(COUNTRIES).join(', ')}`);
  return country.lon;
}

function buildSites(count) {
  const spacing = totalInk / count;
  const sites = [];
  bars.forEach((bar, barIndex) => {
    const n = Math.max(1, Math.round(bar.total / spacing));
    for (let i = 0; i < n; i += 1) {
      const distance = ((i + 0.5) / n) * bar.total;
      const position = pointAlong(bar.points, bar.cumulative, distance);
      sites.push({
        x: position[0],
        y: position[1],
        piece: barIndex,
        meltPoint: bar.anchorAtEnd ? distance / bar.total : 1 - distance / bar.total,
        width: widthAlong(bar.widths, bar.cumulative, distance),
      });
    }
  });
  tips.forEach((tip, tipIndex) => {
    tip.arms.forEach((arm) => {
      const n = Math.max(1, Math.round(arm.length / spacing));
      for (let i = 0; i < n; i += 1) {
        const fraction = (i + 0.5) / n;
        sites.push({
          x: arm.elbow[0] + (arm.freeEnd[0] - arm.elbow[0]) * fraction,
          y: arm.elbow[1] + (arm.freeEnd[1] - arm.elbow[1]) * fraction,
          piece: bars.length + tipIndex,
          meltPoint: 1 - fraction,
          width: arm.width / 2,
        });
      }
    });
  });
  sites.forEach((site, index) => {
    site.jitter = ((index * 59) % 103) / 103;
    site.chunkW = clamp(site.width * 1.7, 18, 64);
    site.chunkH = clamp(spacing * 1.9, 14, 50);
  });
  return sites;
}

function bendControl(fromX, fromY, toX, toY, jitter) {
  const midX = (fromX + toX) / 2;
  const midY = (fromY + toY) / 2;
  const dx = toX - fromX;
  const dy = toY - fromY;
  const length = Math.hypot(dx, dy) || 1;
  let px = -dy / length;
  let py = dx / length;
  if (px * (midX - mcx) + py * (midY - mcy) < 0) {
    px = -px;
    py = -py;
  }
  const bend = (0.2 + 0.2 * jitter) * length;
  return [midX + px * bend, midY + py * bend];
}

const limbRamp = (z) => smooth5(z / 0.16);

export function createGlobe(config = {}) {
  const options = { ...GLOBE_DEFAULTS, ...config };
  const timing = { moveMs: options.moveMs, holdMs: options.holdMs };
  const oceanLevel = clamp(Number(options.ocean) || 0, 0, 2);
  const shimmer = clamp(Number(options.shimmer) || 0, 0, 2);

  const startLon = resolveLon(options.start);
  let delta = (((startLon - resolveLon(options.end)) % 360) + 360) % 360;
  if (delta < 60) delta += 360;
  const lead = 0.15 * delta;
  const knots = [
    { tau: 0, lon: startLon + lead, slope: -lead },
    { tau: 0.34, lon: startLon, slope: -1.3 * delta },
    { tau: 0.72, lon: startLon - delta, slope: -1.3 * delta },
    { tau: 1, lon: startLon - delta - lead, slope: -lead },
  ];

  function facingLon(tau) {
    const t = clamp(tau);
    let seg = 0;
    while (seg < knots.length - 2 && t > knots[seg + 1].tau) seg += 1;
    const k0 = knots[seg];
    const k1 = knots[seg + 1];
    const h = k1.tau - k0.tau;
    const u = (t - k0.tau) / h;
    const u2 = u * u;
    const u3 = u2 * u;
    return (2 * u3 - 3 * u2 + 1) * k0.lon
      + (u3 - 2 * u2 + u) * h * k0.slope
      + (-2 * u3 + 3 * u2) * k1.lon
      + (u3 - u2) * h * k1.slope;
  }

  const targets = GLOBE_DATA.land.map(([lon, lat, scriptIndex], index) => ({
    kind: 'glyph',
    cosLat: Math.cos(lat * RAD),
    sinLat: Math.sin(lat * RAD),
    lon: lon * RAD,
    pool: POOLS[GLOBE_DATA.scripts[scriptIndex]].chars,
    wide: POOLS[GLOBE_DATA.scripts[scriptIndex]].wide,
    seed: index * 137 + scriptIndex * 11,
    jitter: ((index * 73) % 101) / 101,
    arrivedAt: null,
    leaveAt: null,
  })).concat(GLOBE_DATA.ocean.map(([lon, lat], index) => ({
    kind: 'dot',
    cosLat: Math.cos(lat * RAD),
    sinLat: Math.sin(lat * RAD),
    lon: lon * RAD,
    jitter: ((index * 37) % 101) / 101,
    arrivedAt: null,
    leaveAt: null,
  })));

  function projectPoint(point, facingRad) {
    const d = point.lon - facingRad;
    const x = point.cosLat * Math.sin(d);
    const y = point.sinLat;
    return {
      x: mcx + (x * COS_T + y * SIN_T) * R,
      y: mcy - (-x * SIN_T + y * COS_T) * R,
      z: point.cosLat * Math.cos(d),
    };
  }

  const targetAt = (target, tau) => projectPoint(target, facingLon(tau) * RAD);

  const visibleDuring = (target, from, to) => {
    for (let t = from; t <= to; t += 0.01) {
      if (targetAt(target, t).z > 0.035) return true;
    }
    return false;
  };

  const exitTimeOf = (target) => {
    let seen = false;
    for (let t = 0.04; t <= 0.56; t += 0.01) {
      const z = targetAt(target, t).z;
      if (z >= 0.04) seen = true;
      else if (seen) return t;
    }
    return Infinity;
  };

  const entryTimeOf = (target) => {
    for (let t = 0.62; t <= 0.97; t += 0.01) {
      if (targetAt(target, t).z >= 0.04) return t;
    }
    return Infinity;
  };

  // Everything conspicuously visible during the burst arrives by flight, and
  // everything conspicuously visible during the gather flies home. The rest
  // simply exists and rotates in and out behind the limb.
  const needOut = targets.filter((target) => visibleDuring(target, 0.04, 0.36));
  const needBack = targets.filter((target) => visibleDuring(target, 0.7, 0.97));

  const outSites = buildSites(Math.max(1, needOut.length));
  const backSites = buildSites(Math.max(1, needBack.length));
  for (const site of outSites) {
    site.emit = meltStartOf(site.piece) + MELT_SPAN * invSmooth5(site.meltPoint) + (site.jitter - 0.5) * 0.012;
    site.flyOut = 0.07 + 0.035 * site.jitter;
    site.out = null;
  }
  for (const site of backSites) {
    site.back = refillStartOf(site.piece) + REFILL_SPAN * invSmooth5(1 - site.meltPoint) + (site.jitter - 0.5) * 0.012;
    site.flyBack = 0.07 + 0.035 * site.jitter;
    site.ret = null;
  }

  // Targets claim sites in urgency order: whatever exits view soonest picks
  // its flight first, so nothing visible during the burst is left flightless.
  for (const site of outSites) site.arrive = site.emit + site.flyOut;
  const freeOut = new Set(outSites);
  const outOrdered = needOut
    .map((target) => ({ target, exit: exitTimeOf(target) }))
    .sort((a, b) => a.exit - b.exit);
  for (const { target, exit } of outOrdered) {
    let best = null;
    let bestScore = Infinity;
    let bestPos = null;
    for (const site of freeOut) {
      if (site.arrive > exit - 0.015) continue;
      const pos = targetAt(target, site.arrive);
      if (pos.z < 0.02) continue;
      const score = (pos.x - site.x) ** 2 + (pos.y - site.y) ** 2 - pos.z * 350000;
      if (score < bestScore) {
        bestScore = score;
        best = site;
        bestPos = pos;
      }
    }
    if (!best) {
      for (const site of freeOut) if (!best || site.arrive < best.arrive) best = site;
      if (!best) continue;
      bestPos = targetAt(target, best.arrive);
    }
    freeOut.delete(best);
    target.arrivedAt = best.arrive;
    best.out = { target, arrive: best.arrive, ctrl: bendControl(best.x, best.y, bestPos.x, bestPos.y, best.jitter) };
  }
  for (const site of backSites) site.launch = site.back - site.flyBack;
  const freeBack = new Set(backSites);
  const backOrdered = needBack
    .map((target) => ({ target, entry: entryTimeOf(target) }))
    .sort((a, b) => b.entry - a.entry);
  for (const { target, entry } of backOrdered) {
    if (entry === Infinity) continue;
    let best = null;
    let bestScore = Infinity;
    let bestPos = null;
    for (const site of freeBack) {
      if (site.launch < entry + 0.015) continue;
      const pos = targetAt(target, site.launch);
      if (pos.z < 0.02) continue;
      const score = (pos.x - site.x) ** 2 + (pos.y - site.y) ** 2 - pos.z * 350000;
      if (score < bestScore) {
        bestScore = score;
        best = site;
        bestPos = pos;
      }
    }
    if (!best) {
      for (const site of freeBack) if (!best || site.launch > best.launch) best = site;
      if (!best) continue;
      bestPos = targetAt(target, best.launch);
    }
    freeBack.delete(best);
    target.leaveAt = best.launch;
    best.ret = { target, launch: best.launch, fromX: bestPos.x, fromY: bestPos.y, fromZ: bestPos.z, ctrl: bendControl(bestPos.x, bestPos.y, best.x, best.y, best.jitter) };
  }

  function charOf(target, clockMs) {
    if (shimmer <= 0) return { glyph: target.pool[target.seed % target.pool.length], dip: 1 };
    const period = 3800 + target.jitter * 4200;
    const offset = ((target.seed * 97) % 1000) / 1000 * period;
    const phase = (clockMs + offset) / period;
    const cycle = Math.floor(phase);
    const fraction = phase - cycle;
    const depth = 0.3 * shimmer;
    const window = 0.06;
    let dip = 1;
    if (fraction < window) dip = 1 - depth * (1 - smooth5(fraction / window));
    else if (fraction > 1 - window) dip = 1 - depth * smooth5((fraction - (1 - window)) / window);
    return { glyph: target.pool[(target.seed + cycle * 31) % target.pool.length], dip };
  }

  function pieceLevelAt(tau, piece) {
    if (tau <= 0.5) return 1 - smooth5((tau - meltStartOf(piece)) / MELT_SPAN);
    return smooth5((tau - refillStartOf(piece)) / REFILL_SPAN);
  }

  function inkLevelAt(tau) {
    let level = 0;
    for (let piece = 0; piece < PIECE_COUNT; piece += 1) level = Math.max(level, pieceLevelAt(tau, piece));
    return level;
  }

  // Tip collapse mirrors the loader's own depart and refill geometry so the
  // arrow shapes shrink to genuinely nothing instead of leaving stubs.
  function tipShapesAt(tau, tipIndex) {
    const tip = tips[tipIndex];
    const piece = bars.length + tipIndex;
    const reveal = tip.reveal;
    const raw = tau <= 0.5
      ? clamp((tau - meltStartOf(piece)) / MELT_SPAN)
      : clamp((tau - refillStartOf(piece)) / REFILL_SPAN);
    const gone = tau <= 0.5 ? raw >= 1 : raw <= 0;
    const full = tau <= 0.5 ? raw <= 0 : raw >= 1;
    if (gone) return [];
    if (full) return [tip.poly];
    const shapes = [];
    const mix = (from, to, progress) => from + (to - from) * progress;
    const mixCap = (from, to, progress) => [mix(from[0], to[0], progress), mix(from[1], to[1], progress)];
    const pushRect = (left, right, top, bottom) => {
      if (right - left <= 0.0001 || bottom - top <= 0.0001) return;
      shapes.push([[left, top], [right, top], [right, bottom], [left, bottom]]);
    };
    const pushStrip = (vertical, top, bottom) => {
      if (Math.abs((bottom[0] + bottom[1]) - (top[0] + top[1])) <= 0.0001) return;
      shapes.push([
        [vertical.x[0], top[0]],
        [vertical.x[1], top[1]],
        [vertical.x[1], bottom[1]],
        [vertical.x[0], bottom[0]],
      ]);
    };
    if (reveal.kind === 'converge') {
      const present = tau <= 0.5 ? 1 - smooth7(raw) : smooth7(raw);
      pushRect(
        reveal.horizontal.x[0],
        mix(reveal.horizontal.x[0], reveal.horizontal.x[1], present),
        reveal.horizontal.y[0],
        reveal.horizontal.y[1],
      );
      pushStrip(
        reveal.vertical,
        mixCap(reveal.farRoot, reveal.vertical.top, present),
        mixCap(reveal.farRoot, reveal.vertical.bottom, present),
      );
      return shapes;
    }
    if (tau <= 0.5) {
      const first = 1 - smooth7(raw / reveal.departSplit);
      const second = 1 - smooth7(raw);
      pushRect(
        mix(reveal.horizontal.x[1], reveal.horizontal.x[0], first),
        reveal.horizontal.x[1],
        reveal.horizontal.y[0],
        reveal.horizontal.y[1],
      );
      pushStrip(reveal.vertical, mixCap(reveal.departSink, reveal.vertical.top, second), reveal.departSink);
      pushStrip(reveal.vertical, reveal.departSink, mixCap(reveal.departSink, reveal.vertical.bottom, first));
      return shapes;
    }
    const verticalPresent = smooth7(raw);
    const horizontalPresent = verticalPresent <= reveal.refillHorizontalJoin
      ? 0
      : smooth7((verticalPresent - reveal.refillHorizontalJoin) / (1 - reveal.refillHorizontalJoin));
    pushStrip(
      reveal.vertical,
      mixCap(reveal.refillRoot, reveal.vertical.top, verticalPresent),
      mixCap(reveal.refillRoot, reveal.vertical.bottom, verticalPresent),
    );
    pushRect(
      mix(reveal.horizontal.x[1], reveal.horizontal.x[0], horizontalPresent),
      reveal.horizontal.x[1],
      reveal.horizontal.y[0],
      reveal.horizontal.y[1],
    );
    return shapes;
  }

  const ringAlphaAt = (tau) => fadeIn(tau, 0.1, 0.28) * (1 - fadeIn(tau, 0.86, 0.945)) * (0.5 + 0.5 * oceanLevel);
  const stragglerFade = (tau) => 1 - fadeIn(tau, 0.93, 0.965);

  function glyphSprites(tau, clockMs) {
    const sprites = [];
    const facingRad = facingLon(tau) * RAD;
    for (const target of targets) {
      let exist = 1;
      if (target.arrivedAt != null && tau < target.arrivedAt) exist = 0;
      if (target.leaveAt != null && tau >= target.leaveAt) exist = 0;
      if (target.leaveAt == null) exist *= stragglerFade(tau);
      if (exist <= 0.01) continue;
      const pos = projectPoint(target, facingRad);
      if (pos.z <= 0.03) continue;
      if (target.kind === 'dot') {
        sprites.push({
          kind: 'dot',
          x: pos.x,
          y: pos.y,
          r: 5.2 * limbRamp(pos.z),
          alpha: 0.3 * oceanLevel * limbRamp(pos.z) * exist,
        });
        continue;
      }
      const { glyph, dip } = charOf(target, clockMs);
      sprites.push({
        kind: 'glyph',
        x: pos.x,
        y: pos.y,
        size: (26 + 12 * target.jitter) * (0.92 + 0.08 * pos.z),
        alpha: 0.92 * limbRamp(pos.z) * exist * dip,
        char: glyph,
        wide: target.wide,
      });
    }
    for (const site of outSites) {
      if (!site.out || tau < site.emit || tau >= site.out.arrive) continue;
      const target = site.out.target;
      const end = targetAt(target, site.out.arrive);
      const u = smooth5((tau - site.emit) / site.flyOut);
      const inv = 1 - u;
      const x = inv * inv * site.x + 2 * inv * u * site.out.ctrl[0] + u * u * end.x;
      const y = inv * inv * site.y + 2 * inv * u * site.out.ctrl[1] + u * u * end.y;
      if (target.kind === 'dot') {
        sprites.push({ kind: 'dot', flight: true, x, y, r: 4 + 1.2 * u, alpha: 0.55 * (1 - u * 0.4) });
        continue;
      }
      const { glyph } = charOf(target, clockMs);
      const birth = smooth5(u / 0.45);
      const settle = smooth5((u - 0.7) / 0.3);
      sprites.push({
        kind: 'glyph',
        flight: true,
        birth,
        chunkW: site.chunkW * (1 - 0.45 * birth),
        chunkH: site.chunkH * (1 - 0.45 * birth),
        rot: site.jitter * Math.PI + (site.jitter - 0.5) * 3.2 * u,
        x,
        y,
        size: (44 + 14 * site.jitter) * (1 - u) + (26 + 12 * target.jitter) * u,
        alpha: 0.95 * (1 - settle) + 0.92 * limbRamp(end.z) * settle,
        char: glyph,
        wide: target.wide,
      });
    }
    for (const site of backSites) {
      if (!site.ret || tau < site.ret.launch || tau >= site.back) continue;
      const target = site.ret.target;
      const u = smooth5((tau - site.ret.launch) / site.flyBack);
      const inv = 1 - u;
      const x = inv * inv * site.ret.fromX + 2 * inv * u * site.ret.ctrl[0] + u * u * site.x;
      const y = inv * inv * site.ret.fromY + 2 * inv * u * site.ret.ctrl[1] + u * u * site.y;
      if (target.kind === 'dot') {
        sprites.push({ kind: 'dot', flight: true, x, y, r: 5.2 - 1.2 * u, alpha: 0.55 * (0.6 + 0.4 * u) });
        continue;
      }
      const { glyph } = charOf(target, clockMs);
      const birth = 1 - smooth5((u - 0.55) / 0.45);
      const settle = smooth5((0.3 - u) / 0.3);
      sprites.push({
        kind: 'glyph',
        flight: true,
        birth,
        chunkW: site.chunkW * (1 - 0.45 * birth),
        chunkH: site.chunkH * (1 - 0.45 * birth),
        rot: site.jitter * Math.PI + (site.jitter - 0.5) * 3.2 * (1 - u),
        x,
        y,
        size: (26 + 12 * target.jitter) * (1 - u) + (44 + 14 * site.jitter) * u,
        alpha: 0.95 * (1 - settle) + 0.92 * limbRamp(site.ret.fromZ) * settle,
        char: glyph,
        wide: target.wide,
      });
    }
    return sprites;
  }

  return {
    options,
    timing,
    facingLon,
    glyphSprites,
    inkLevelAt,
    pieceLevelAt,
    tipShapesAt,
    ringAlphaAt,
    stats: {
      flightsOut: outSites.filter((site) => site.out).length,
      flightsBack: backSites.filter((site) => site.ret).length,
      neededOut: needOut.length,
      neededBack: needBack.length,
    },
  };
}
