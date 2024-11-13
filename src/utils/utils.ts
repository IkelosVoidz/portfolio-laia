import { atom } from 'jotai';
import { BufferGeometry, Float32BufferAttribute, NormalBufferAttributes } from 'three';

export const selectedBookAtom = atom<number | null>(null);

export function RoundEdgedBoxFlat(
  width: number,
  height: number,
  thickness: number,
  radius: number,
  smoothness: number
): BufferGeometry<NormalBufferAttributes> {
  const wi = width / 2 - radius;
  const hi = height / 2 - radius;
  const w2 = width / 2;
  const h2 = height / 2;

  let ul = radius / width;
  let ur = (width - radius) / width;
  const vl = radius / height;
  const vh = (height - radius) / height;

  let phia, phib, xc, yc, uc, vc, cosa, sina, cosb, sinb;

  let positions = [];
  let uvs = [];

  let t2 = thickness / 2;
  let u0 = ul;
  let u1 = ur;
  let u2 = 0;
  let u3 = 1;
  let sign = 1;

  for (let k = 0; k < 2; k++) {
    positions.push(
      -wi,
      -h2,
      t2,
      wi,
      -h2,
      t2,
      wi,
      h2,
      t2,
      -wi,
      -h2,
      t2,
      wi,
      h2,
      t2,
      -wi,
      h2,
      t2,
      -w2,
      -hi,
      t2,
      -wi,
      -hi,
      t2,
      -wi,
      hi,
      t2,
      -w2,
      -hi,
      t2,
      -wi,
      hi,
      t2,
      -w2,
      hi,
      t2,
      wi,
      -hi,
      t2,
      w2,
      -hi,
      t2,
      w2,
      hi,
      t2,
      wi,
      -hi,
      t2,
      w2,
      hi,
      t2,
      wi,
      hi,
      t2
    );

    uvs.push(
      u0,
      0,
      u1,
      0,
      u1,
      1,
      u0,
      0,
      u1,
      1,
      u0,
      1,
      u2,
      vl,
      u0,
      vl,
      u0,
      vh,
      u2,
      vl,
      u0,
      vh,
      u2,
      vh,
      u1,
      vl,
      u3,
      vl,
      u3,
      vh,
      u1,
      vl,
      u3,
      vh,
      u1,
      vh
    );

    phia = 0;

    for (let i = 0; i < smoothness * 4; i++) {
      phib = (Math.PI * 2 * (i + 1)) / (4 * smoothness);

      cosa = Math.cos(phia);
      sina = Math.sin(phia);
      cosb = Math.cos(phib);
      sinb = Math.sin(phib);

      xc = i < smoothness || i >= 3 * smoothness ? wi : -wi;
      yc = i < 2 * smoothness ? hi : -hi;

      positions.push(
        xc,
        yc,
        t2,
        xc + radius * cosa,
        yc + radius * sina,
        t2,
        xc + radius * cosb,
        yc + radius * sinb,
        t2
      );

      uc = i < smoothness || i >= 3 * smoothness ? u1 : u0;
      vc = i < 2 * smoothness ? vh : vl;

      uvs.push(uc, vc, uc + sign * ul * cosa, vc + vl * sina, uc + sign * ul * cosb, vc + vl * sinb);

      phia = phib;
    }

    t2 = -t2;
    u0 = ur;
    u1 = ul;
    u2 = 1;
    u3 = 0;
    sign = -1;
  }

  t2 = thickness / 2;

  positions.push(
    -wi,
    -h2,
    t2,
    -wi,
    -h2,
    -t2,
    wi,
    -h2,
    -t2,
    -wi,
    -h2,
    t2,
    wi,
    -h2,
    -t2,
    wi,
    -h2,
    t2,
    w2,
    -hi,
    t2,
    w2,
    -hi,
    -t2,
    w2,
    hi,
    -t2,
    w2,
    -hi,
    t2,
    w2,
    hi,
    -t2,
    w2,
    hi,
    t2,
    wi,
    h2,
    t2,
    wi,
    h2,
    -t2,
    -wi,
    h2,
    -t2,
    wi,
    h2,
    t2,
    -wi,
    h2,
    -t2,
    -wi,
    h2,
    t2,
    -w2,
    hi,
    t2,
    -w2,
    hi,
    -t2,
    -w2,
    -hi,
    -t2,
    -w2,
    hi,
    t2,
    -w2,
    -hi,
    -t2,
    -w2,
    -hi,
    t2
  );

  const cf = 2 * (width + height - 4 * radius + Math.PI * radius);
  const cc4 = (Math.PI * radius) / 2 / cf;
  u0 = 0;
  u1 = (2 * wi) / cf;
  u2 = u1 + cc4;
  u3 = u2 + (2 * hi) / cf;

  const u4 = u3 + cc4;
  const u5 = u4 + (2 * wi) / cf;
  const u6 = u5 + cc4;
  const u7 = u6 + (2 * hi) / cf;

  uvs.push(
    u0,
    1,
    0,
    0,
    u1,
    0,
    u0,
    1,
    u1,
    0,
    u1,
    1,
    u2,
    1,
    u2,
    0,
    u3,
    0,
    u2,
    1,
    u3,
    0,
    u3,
    1,
    u4,
    1,
    u4,
    0,
    u5,
    0,
    u4,
    1,
    u5,
    0,
    u5,
    1,
    u6,
    1,
    u6,
    0,
    u7,
    0,
    u6,
    1,
    u7,
    0,
    u7,
    1
  );

  phia = 0;
  let u, j, j1;
  const ccs = cc4 / smoothness;

  for (let i = 0; i < smoothness * 4; i++) {
    phib = (Math.PI * 2 * (i + 1)) / (4 * smoothness);

    cosa = Math.cos(phia);
    sina = Math.sin(phia);
    cosb = Math.cos(phib);
    sinb = Math.sin(phib);

    xc = i < smoothness || i >= 3 * smoothness ? wi : -wi;
    yc = i < 2 * smoothness ? hi : -hi;

    positions.push(
      xc + radius * cosa,
      yc + radius * sina,
      t2,
      xc + radius * cosa,
      yc + radius * sina,
      -t2,
      xc + radius * cosb,
      yc + radius * sinb,
      -t2
    );
    positions.push(
      xc + radius * cosa,
      yc + radius * sina,
      t2,
      xc + radius * cosb,
      yc + radius * sinb,
      -t2,
      xc + radius * cosb,
      yc + radius * sinb,
      t2
    );

    u = i < smoothness ? u3 : i < 2 * smoothness ? u5 : i < 3 * smoothness ? u7 : u1;

    j = i % smoothness;
    j1 = j + 1;

    uvs.push(u + j * ccs, 1, u + j * ccs, 0, u + j1 * ccs, 0);
    uvs.push(u + j * ccs, 1, u + j1 * ccs, 0, u + j1 * ccs, 1);

    phia = phib;
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(new Float32Array(positions), 3));
  geometry.setAttribute('uv', new Float32BufferAttribute(new Float32Array(uvs), 2));

  const vtc = (6 + 4 * smoothness) * 3;
  geometry.addGroup(0, vtc, 0);
  geometry.addGroup(vtc, vtc, 1);
  geometry.addGroup(2 * vtc, 24 + 2 * 3 * 4 * smoothness, 2);

  geometry.computeVertexNormals();

  return geometry;
}
