// Decoders for the packed base64 arrays in the generated data files.
// Encoders live in globe/pack-lib.mjs; formats are described there.
const bytesOf = (b64) => {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new DataView(bytes.buffer);
};

export function nums(b64) {
  const v = bytesOf(b64);
  const scale = 2 ** v.getUint8(0);
  const out = new Array((v.byteLength - 1) / 4);
  for (let i = 0; i < out.length; i++) out[i] = v.getInt32(1 + i * 4, true) / scale;
  return out;
}

export function points(b64) {
  const v = bytesOf(b64);
  const mode = v.getUint8(0);
  const scale = 2 ** v.getUint8(1);
  const count = v.getUint32(2, true);
  let offset = 6;
  const xs = new Array(count);
  const ys = new Array(count);
  xs[0] = v.getInt32(offset, true);
  ys[0] = v.getInt32(offset + 4, true);
  offset += 8;
  const readEscapable = () => {
    const small = v.getInt8(offset);
    offset += 1;
    if (small !== -128) return small;
    const wide = v.getInt16(offset, true);
    offset += 2;
    return wide;
  };
  if (mode === 1) {
    for (let i = 1; i < count; i++) {
      xs[i] = xs[i - 1] + v.getInt16(offset, true);
      ys[i] = ys[i - 1] + v.getInt16(offset + 2, true);
      offset += 4;
    }
  } else {
    xs[1] = xs[0] + v.getInt16(offset, true);
    ys[1] = ys[0] + v.getInt16(offset + 2, true);
    offset += 4;
    for (let i = 2; i < count; i++) {
      xs[i] = 2 * xs[i - 1] - xs[i - 2] + readEscapable();
      ys[i] = 2 * ys[i - 1] - ys[i - 2] + readEscapable();
    }
  }
  const out = new Array(count);
  for (let i = 0; i < count; i++) out[i] = [xs[i] / scale, ys[i] / scale];
  return out;
}

export function grid16(b64, scale) {
  const v = bytesOf(b64);
  const out = new Array(v.byteLength / 4);
  for (let i = 0; i < out.length; i++) {
    out[i] = [v.getInt16(i * 4, true) / scale, v.getInt16(i * 4 + 2, true) / scale];
  }
  return out;
}

export function bytes(b64) {
  const v = bytesOf(b64);
  return Array.from(new Uint8Array(v.buffer));
}
