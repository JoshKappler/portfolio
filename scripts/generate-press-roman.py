"""Bakes public/fonts/press-roman-{regular,bold}.woff2 from Gelasio
(SIL OFL 1.1, metrics-compatible with Georgia, so the tuned justified
squares keep their exact line wraps).

The press character lives in the outlines: every contour is flattened to
a fine polyline, then each point rides two bands of seeded value noise,
a low band that bends stems and baselines (warble) and a high band that
roughens the edges (wear). Vector outlines rasterize the same in every
engine, which live SVG filters do not. Advance widths are untouched.
Deterministic: rerunning reproduces the committed files byte for byte.

Run: scripts/fontenv/bin/python scripts/generate-press-roman.py
(venv with fonttools + brotli)
"""
import hashlib
import math
import sys
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.subset import Subsetter, Options

SRC = Path(sys.argv[1])
OUT_DIR = Path(__file__).resolve().parent.parent / "public" / "fonts"
FAMILY = "Press Roman"

WARBLE_WAVELENGTH = 1000
WARBLE_AMPLITUDE = 62
WEAR_WAVELENGTH = 240
WEAR_AMPLITUDE = 36
FLATTEN_STEP = 22

KEEP = "U+0020-007E,U+00A0-00FF,U+2013-2014,U+2018-201F,U+2026,U+00B7,U+2022"


def noise_field(seed, wavelength):
    def rnd(ix, iy):
        h = hashlib.md5(f"{seed}:{ix}:{iy}".encode()).digest()
        return int.from_bytes(h[:4], "big") / 0xFFFFFFFF

    def sample(x, y):
        fx, fy = x / wavelength, y / wavelength
        x0, y0 = math.floor(fx), math.floor(fy)
        tx, ty = fx - x0, fy - y0
        tx = tx * tx * (3 - 2 * tx)
        ty = ty * ty * (3 - 2 * ty)
        a, b = rnd(x0, y0), rnd(x0 + 1, y0)
        c, d = rnd(x0, y0 + 1), rnd(x0 + 1, y0 + 1)
        return (a + (b - a) * tx + (c - a) * ty + (a - b - c + d) * tx * ty) * 2 - 1

    return sample


def flatten_contours(pen_value):
    contours, current = [], None
    last = None
    for op, args in pen_value:
        if op == "moveTo":
            current = [args[0]]
            last = args[0]
        elif op == "lineTo":
            current.append(args[0])
            last = args[0]
        elif op == "qCurveTo":
            pts = list(args)
            if pts[-1] is None:
                pts[-1] = current[0]
            offs = pts[:-1]
            end = pts[-1]
            start = last
            expanded = []
            for i, off in enumerate(offs):
                nxt = offs[i + 1] if i + 1 < len(offs) else end
                seg_end = nxt if i + 1 == len(offs) else (
                    (off[0] + nxt[0]) / 2, (off[1] + nxt[1]) / 2)
                length = math.dist(start, seg_end) + math.dist(start, off)
                steps = max(2, int(length / FLATTEN_STEP))
                for s in range(1, steps + 1):
                    t = s / steps
                    mt = 1 - t
                    expanded.append((
                        mt * mt * start[0] + 2 * mt * t * off[0] + t * t * seg_end[0],
                        mt * mt * start[1] + 2 * mt * t * off[1] + t * t * seg_end[1]))
                start = seg_end
            current.extend(expanded)
            last = end
        elif op == "curveTo":
            c1, c2, end = args
            start = last
            length = math.dist(start, c1) + math.dist(c1, c2) + math.dist(c2, end)
            steps = max(2, int(length / FLATTEN_STEP))
            for s in range(1, steps + 1):
                t = s / steps
                mt = 1 - t
                current.append((
                    mt**3 * start[0] + 3 * mt * mt * t * c1[0] + 3 * mt * t * t * c2[0] + t**3 * end[0],
                    mt**3 * start[1] + 3 * mt * mt * t * c1[1] + 3 * mt * t * t * c2[1] + t**3 * end[1]))
            last = end
        elif op == "closePath":
            if current and math.dist(current[0], current[-1]) < 1:
                current.pop()
            contours.append(current)
            current = None
    return contours


def distort(font, weight_tag):
    glyf = font["glyf"]
    glyph_set = font.getGlyphSet()
    upm_scale = font["head"].unitsPerEm / 2048
    for name in font.getGlyphOrder():
        glyph = glyf[name]
        if glyph.numberOfContours == 0:
            continue
        rec = DecomposingRecordingPen(glyph_set)
        glyph_set[name].draw(rec)
        contours = flatten_contours(rec.value)
        if not contours:
            continue
        wx = noise_field(f"{weight_tag}:{name}:wx", WARBLE_WAVELENGTH * upm_scale)
        wy = noise_field(f"{weight_tag}:{name}:wy", WARBLE_WAVELENGTH * upm_scale)
        gx = noise_field(f"{weight_tag}:{name}:gx", WEAR_WAVELENGTH * upm_scale)
        gy = noise_field(f"{weight_tag}:{name}:gy", WEAR_WAVELENGTH * upm_scale)
        wa = WARBLE_AMPLITUDE * upm_scale
        ga = WEAR_AMPLITUDE * upm_scale
        pen = TTGlyphPen(None)
        for contour in contours:
            out = []
            for x, y in contour:
                out.append((
                    round(x + wx(x, y) * wa + gx(x, y) * ga),
                    round(y + wy(x, y) * wa + gy(x, y) * ga)))
            pen.moveTo(out[0])
            for pt in out[1:]:
                pen.lineTo(pt)
            pen.closePath()
        glyf[name] = pen.glyph()


def rename(font, subfamily):
    name = font["name"]
    ps = FAMILY.replace(" ", "") + "-" + subfamily
    for nid, value in ((1, FAMILY), (2, subfamily), (3, f"{FAMILY} {subfamily}"),
                       (4, f"{FAMILY} {subfamily}"), (6, ps), (16, FAMILY),
                       (17, subfamily)):
        name.setName(value, nid, 3, 1, 0x409)


for weight, subfamily, slug in ((400, "Regular", "regular"), (700, "Bold", "bold")):
    font = TTFont(SRC)
    instantiateVariableFont(font, {"wght": weight}, inplace=True)
    opts = Options()
    opts.unicodes = []
    opts.drop_tables += ["FFTM", "DSIG"]
    opts.hinting = False
    subsetter = Subsetter(opts)
    unicodes = []
    for part in KEEP.split(","):
        bounds = part.replace("U+", "").split("-")
        lo = int(bounds[0], 16)
        hi = int(bounds[-1], 16)
        unicodes.extend(range(lo, hi + 1))
    subsetter.populate(unicodes=unicodes)
    subsetter.subset(font)
    distort(font, slug)
    rename(font, subfamily)
    font.flavor = "woff2"
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out = OUT_DIR / f"press-roman-{slug}.woff2"
    font.save(out)
    print(out.name, out.stat().st_size, "bytes")
