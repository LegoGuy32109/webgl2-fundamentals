export function oklchToRgb(hue: number, chroma: number, lightness: number) {
  const hr = hue * Math.PI / 180;

  const a = chroma * Math.cos(hr);
  const b = chroma * Math.sin(hr);

  // OKLab -> LMS
  const l_ = lightness + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = lightness - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = lightness - 0.0894841775 * a - 1.2914855480 * b;

  // cube
  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;

  // LMS -> linear RGB
  let r = +4.0767416621 * l3 -
    3.3077115913 * m3 +
    0.2309699292 * s3;

  let g = -1.2684380046 * l3 +
    2.6097574011 * m3 -
    0.3413193965 * s3;

  let b2 = -0.0041960863 * l3 -
    0.7034186147 * m3 +
    1.7076147010 * s3;

  // linear -> sRGB
  const gamma = (x: number) =>
    x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;

  r = gamma(r);
  g = gamma(g);
  b2 = gamma(b2);

  return [
    Math.max(0, Math.min(1, r)),
    Math.max(0, Math.min(1, g)),
    Math.max(0, Math.min(1, b2)),
  ];
}

export function getRandomLch(
  hue?: number,
  chroma?: number,
  lightness?: number,
) {
  const h = hue ?? Math.random() * 360;
  const c = chroma ?? 0.12 + Math.random() * 0.2;
  const l = lightness ?? 0.6 + Math.random() * 0.4;
  return { hue: h, chroma: c, lightness: l };
}
