// Regenerates every site icon from one source image.
//
//   node scripts/make-icons.mjs
//
// Source: public/apple-touch-icon.png (square PNG, 180px or larger).
// Output: app/favicon.ico   16/32/48px, for browser tabs and bookmarks
//         app/icon.png      180px, for browsers that prefer a PNG icon
//         app/apple-icon.png 180px with the corners filled, because iOS
//                           paints transparent pixels black
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const SOURCE = 'public/apple-touch-icon.png';
const ICO_SIZES = [16, 32, 48];

const resize = (size) =>
  sharp(SOURCE).resize(size, size, { kernel: 'lanczos3' }).png({ compressionLevel: 9 });

// An .ico file is a small directory followed by one PNG per size.
function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);

  let offset = header.length + images.length * 16;
  const entries = images.map(({ size, data }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size, 0); // width
    entry.writeUInt8(size, 1); // height
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    return entry;
  });

  return Buffer.concat([header, ...entries, ...images.map((image) => image.data)]);
}

const icoImages = await Promise.all(
  ICO_SIZES.map(async (size) => ({ size, data: await resize(size).toBuffer() }))
);
await writeFile('app/favicon.ico', buildIco(icoImages));

await resize(180).toFile('app/icon.png');

// Fill the transparent corners with the icon's own background colour,
// sampled from the middle of its top edge.
const { data: pixel } = await sharp(SOURCE)
  .ensureAlpha()
  .extract({ left: Math.floor((await sharp(SOURCE).metadata()).width / 2), top: 2, width: 1, height: 1 })
  .raw()
  .toBuffer({ resolveWithObject: true });
const background = { r: pixel[0], g: pixel[1], b: pixel[2] };

await sharp(SOURCE)
  .resize(180, 180, { kernel: 'lanczos3' })
  .flatten({ background })
  .png({ compressionLevel: 9 })
  .toFile('app/apple-icon.png');

console.log('Wrote app/favicon.ico, app/icon.png, app/apple-icon.png');
