import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../..', import.meta.url));
const publicDir = join(root, 'public');

const ASTRO_DEFAULT_MARK = 'M50.4 78.5';

type Raster = {
  width: number;
  height: number;
  colorType: number;
  channels: number;
  pixels: Buffer;
};

function paeth(left: number, up: number, upLeft: number): number {
  const estimate = left + up - upLeft;
  const leftDistance = Math.abs(estimate - left);
  const upDistance = Math.abs(estimate - up);
  const upLeftDistance = Math.abs(estimate - upLeft);
  if (leftDistance <= upDistance && leftDistance <= upLeftDistance) return left;
  if (upDistance <= upLeftDistance) return up;
  return upLeft;
}

function decodePng(buf: Buffer): Raster {
  assert.equal(buf.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  let offset = 8;
  let width = 0;
  let height = 0;
  let colorType = 0;
  const idat: Buffer[] = [];
  while (offset < buf.length) {
    const length = buf.readUInt32BE(offset);
    const type = buf.toString('ascii', offset + 4, offset + 8);
    const data = buf.subarray(offset + 8, offset + 8 + length);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      colorType = data[9];
    } else if (type === 'IDAT') {
      idat.push(data);
    } else if (type === 'IEND') {
      break;
    }
    offset += 12 + length;
  }

  const channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[colorType];
  assert.ok(channels, `unsupported PNG color type ${colorType}`);
  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * channels;
  const pixels = Buffer.alloc(height * stride);
  let source = 0;
  for (let y = 0; y < height; y += 1) {
    const filter = raw[source];
    source += 1;
    const row = y * stride;
    for (let x = 0; x < stride; x += 1) {
      const value = raw[source];
      source += 1;
      const left = x >= channels ? pixels[row + x - channels] : 0;
      const up = y > 0 ? pixels[row - stride + x] : 0;
      const upLeft = y > 0 && x >= channels ? pixels[row - stride + x - channels] : 0;
      let reconstructed = value;
      if (filter === 1) reconstructed = (value + left) & 255;
      else if (filter === 2) reconstructed = (value + up) & 255;
      else if (filter === 3) reconstructed = (value + Math.floor((left + up) / 2)) & 255;
      else if (filter === 4) reconstructed = (value + paeth(left, up, upLeft)) & 255;
      else assert.equal(filter, 0, `unsupported PNG filter ${filter}`);
      pixels[row + x] = reconstructed;
    }
  }

  return { width, height, colorType, channels, pixels };
}

function colorCounts(raster: Raster): { teal: number; pink: number; green: number } {
  let teal = 0;
  let pink = 0;
  let green = 0;
  const { pixels, channels } = raster;
  for (let index = 0; index < pixels.length; index += channels) {
    const red = pixels[index] ?? 0;
    const greenChannel = channels > 1 ? (pixels[index + 1] ?? 0) : red;
    const blue = channels > 2 ? (pixels[index + 2] ?? 0) : red;
    const alpha = channels === 4 ? (pixels[index + 3] ?? 255) : 255;
    if (alpha < 200) continue;
    if (greenChannel > 90 && blue > 90 && blue + greenChannel > red * 2 && red < 180) teal += 1;
    if (red > 170 && blue > 120 && greenChannel < 190 && red > greenChannel + 20) pink += 1;
    if (greenChannel > 140 && red < 120 && blue < 120 && greenChannel > red + 40) green += 1;
  }
  return { teal, pink, green };
}

function icoSizes(buf: Buffer): number[] {
  assert.equal(buf.readUInt16LE(0), 0);
  assert.equal(buf.readUInt16LE(2), 1);
  const count = buf.readUInt16LE(4);
  const sizes: number[] = [];
  for (let index = 0; index < count; index += 1) {
    const width = buf[6 + index * 16] || 256;
    sizes.push(width);
  }
  return sizes;
}

describe('search favicon uses the Fal mark', () => {
  it('points Google at a large Fal PNG before any smaller icon', () => {
    const layout = readFileSync(join(root, 'src/layouts/Layout.astro'), 'utf8');
    const iconLinks = [...layout.matchAll(/<link rel="(?:icon|shortcut icon|apple-touch-icon)"[^>]*>/g)].map(
      (match) => match[0],
    );
    assert.deepEqual(iconLinks, [
      '<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png" />',
      '<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48.png" />',
      '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />',
      '<link rel="shortcut icon" href="/favicon.ico" />',
      '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />',
    ]);
  });

  it('renders the teal Fal heart in every favicon, not the Beauty Corner mark', () => {
    const expected: Record<string, { width: number; height: number }> = {
      'favicon-32.png': { width: 32, height: 32 },
      'favicon-48.png': { width: 48, height: 48 },
      'favicon-192.png': { width: 192, height: 192 },
      'apple-touch-icon.png': { width: 180, height: 180 },
    };

    for (const [file, size] of Object.entries(expected)) {
      const raster = decodePng(readFileSync(join(publicDir, file)));
      const counts = colorCounts(raster);
      assert.equal(raster.width, size.width, file);
      assert.equal(raster.height, size.height, file);
      assert.ok(counts.teal > raster.width * raster.height * 0.15, `${file} teal ${counts.teal}`);
      assert.equal(counts.pink, 0, `${file} still has Beauty Corner pink`);
      assert.equal(counts.green, 0, `${file} still has Beauty Corner green`);
    }
  });

  it('keeps the apple touch icon opaque so mobile home screens do not paint it black', () => {
    const raster = decodePng(readFileSync(join(publicDir, 'apple-touch-icon.png')));
    assert.equal(raster.colorType, 2);
    const corner = [raster.pixels[0], raster.pixels[1], raster.pixels[2]];
    assert.deepEqual(corner, [255, 255, 255]);
  });

  it('serves a real multi-size Fal icon from /favicon.ico', () => {
    const ico = readFileSync(join(publicDir, 'favicon.ico'));
    assert.deepEqual(icoSizes(ico), [16, 32, 48, 192]);
    const largestOffset = 6 + 3 * 16;
    const bytes = ico.readUInt32LE(largestOffset + 8);
    const offset = ico.readUInt32LE(largestOffset + 12);
    const frame = decodePng(ico.subarray(offset, offset + bytes));
    const counts = colorCounts(frame);
    assert.equal(frame.width, 192);
    assert.ok(counts.teal > 1000);
    assert.equal(counts.pink, 0);
  });

  it('does not keep the Astro default mark in favicon.svg', () => {
    const svg = readFileSync(join(publicDir, 'favicon.svg'), 'utf8');
    assert.doesNotMatch(svg, new RegExp(ASTRO_DEFAULT_MARK));
    assert.match(svg, /Fal Clinic/);
    assert.match(svg, /image\/png/);
  });
});
