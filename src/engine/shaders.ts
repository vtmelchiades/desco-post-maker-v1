import type { ShaderId } from "../data/types";

const VERT = `
attribute vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const NOISE = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform float u_seed;
uniform float u_offset;
uniform float u_slides;

vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec2 mod289(vec2 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec3 permute(vec3 x){ return mod289(((x*34.0)+1.0)*x); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
float fbm(vec2 p){
  float v = 0.0; float a = 0.5;
  for(int i=0;i<5;i++){ v += a * snoise(p); p = p*2.02 + vec2(17.3, 9.1); a *= 0.5; }
  return v;
}
vec2 world(){
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / u_res.y;
  return vec2((uv.x + u_offset) * aspect, uv.y);
}
const vec3 BG = vec3(0.031, 0.031, 0.031);
const vec3 ACCENT = vec3(0.831, 1.0, 0.0);
const vec3 MOSS = vec3(0.09, 0.14, 0.03);
const vec3 GRAPH = vec3(0.16, 0.17, 0.15);
float grain(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }
`;

const LIQUID = `${NOISE}
void main(){
  vec2 p = world() * 1.35 + u_seed;
  float t = u_time * 0.08;
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t*0.7));
  vec2 r = vec2(fbm(p + 4.0*q + vec2(1.7, 9.2) + t*0.35), fbm(p + 4.0*q + vec2(8.3, 2.8) - t*0.2));
  float n = fbm(p + 3.5*r);
  float v = n * 0.5 + 0.5;
  vec3 col = mix(BG, MOSS, smoothstep(0.25, 0.75, v));
  col = mix(col, GRAPH, smoothstep(0.6, 0.95, length(q)) * 0.6);
  float vein = smoothstep(0.015, 0.0, abs(v - 0.55)) + smoothstep(0.02, 0.0, abs(v - 0.32)) * 0.6;
  col += ACCENT * vein * 0.85;
  col += ACCENT * smoothstep(0.85, 1.05, v) * 0.35;
  col = mix(col, BG, smoothstep(0.55, 1.15, length(gl_FragCoord.xy / u_res - 0.5) * 1.35) * 0.55);
  col += (grain(gl_FragCoord.xy + u_time) - 0.5) * 0.035;
  gl_FragColor = vec4(col, 1.0);
}
`;

const MESH = `${NOISE}
vec3 blob(vec2 p, vec2 c, float r, vec3 col, float k){
  float d = length(p - c);
  return col * exp(-d*d / (r*r)) * k;
}
void main(){
  vec2 p = world();
  float t = u_time * 0.12;
  float s = u_seed * 0.37;
  vec3 col = BG;
  col += blob(p, vec2(0.25 + 0.15*sin(t+s), 0.75 + 0.1*cos(t*0.8+s)), 0.45, GRAPH*1.6, 1.0);
  col += blob(p, vec2(0.7 + 0.12*cos(t*0.6+s), 0.35 + 0.15*sin(t*0.9+s)), 0.5, MOSS*2.2, 1.0);
  col += blob(p, vec2(0.55 + 0.2*sin(t*0.5+s*2.0), 0.85 + 0.08*cos(t*1.1)), 0.32, vec3(0.05,0.07,0.02)*3.0, 1.0);
  col += blob(p, vec2(0.15 + 0.1*cos(t*0.7+s), 0.2 + 0.1*sin(t*0.4+s)), 0.22, ACCENT, 0.26);
  col += blob(p, vec2(0.82 + 0.06*sin(t*1.3+s), 0.86 + 0.05*cos(t*0.9)), 0.08, ACCENT, 0.55);
  float n = fbm(p * 2.5 + u_seed + t*0.3);
  col += n * 0.02;
  col += (grain(gl_FragCoord.xy + u_time) - 0.5) * 0.04;
  gl_FragColor = vec4(col, 1.0);
}
`;

const GRID = `${NOISE}
void main(){
  vec2 p = world();
  float t = u_time * 0.07;
  vec2 q = p * 1.6 + u_seed;
  float n = fbm(q + vec2(t, -t*0.6)) * 0.5 + 0.5;
  n += fbm(q * 0.5 - t*0.3) * 0.25;
  float levels = 14.0;
  float f = fract(n * levels);
  float w = fwidth(n * levels) * 1.4;
  float line = 1.0 - smoothstep(0.0, w, f) + smoothstep(1.0 - w, 1.0, f);
  float major = step(fract(n * levels / 4.0), 1.0/4.0 + 0.001) * step(1.0/4.0 - 1.0/levels, fract(n * levels / 4.0));
  vec3 col = BG;
  col += ACCENT * line * (0.35 + 0.5 * major);
  vec2 g = fract(p * 8.0);
  float gl = (1.0 - smoothstep(0.0, 0.012, g.x)) + (1.0 - smoothstep(0.0, 0.012, g.y));
  col += vec3(1.0) * gl * 0.05;
  float vign = smoothstep(0.35, 1.1, length(gl_FragCoord.xy / u_res - vec2(0.5, 0.55)) * 1.3);
  col = mix(col, BG, vign * 0.8);
  col += (grain(gl_FragCoord.xy + u_time) - 0.5) * 0.03;
  gl_FragColor = vec4(col, 1.0);
}
`;

const AURORA = `${NOISE}
void main(){
  vec2 p = world();
  float t = u_time * 0.1;
  float x = p.x * 1.4 + u_seed;
  float band = 0.0;
  for(int i=0;i<4;i++){
    float fi = float(i);
    float n = snoise(vec2(x * (1.0 + fi*0.35) + t * (0.4 + fi*0.15), fi*3.1 + p.y * 0.35 - t*0.2));
    band += smoothstep(0.35, 0.95, n) * (0.35 - fi*0.06);
  }
  float yfade = smoothstep(0.0, 0.35, p.y) * (1.0 - smoothstep(0.55, 1.0, p.y));
  float m = band * (0.35 + 0.65 * yfade);
  vec3 col = BG;
  col += MOSS * 3.0 * m;
  col += ACCENT * pow(m, 2.2) * 0.9;
  float haze = fbm(p * 1.2 + t) * 0.5 + 0.5;
  col += GRAPH * haze * 0.18;
  col += (grain(gl_FragCoord.xy + u_time) - 0.5) * 0.04;
  gl_FragColor = vec4(col, 1.0);
}
`;

/* ── Raymarching / SDF ─────────────────────────────────────────────────────
 * No mesh, no vertices: the surface is found by marching a ray and asking a
 * distance function how far it is safe to step. Everything below is a pure
 * function of (pixel, time, seed) — the video exporter renders frames out of a
 * stateless clock, so nothing here may accumulate between calls.
 */
const SDF = `
float smin(float a, float b, float k){
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}
float sdSphere(vec3 p, float r){ return length(p) - r; }
float sdTorus(vec3 p, vec2 t){ return length(vec2(length(p.xz) - t.x, p.y)) - t.y; }
float sdRoundBox(vec3 p, vec3 b, float r){
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
}
/** Cheap studio environment: a dark room with one bright strip and an accent bounce. */
vec3 env(vec3 r){
  float y = r.y * 0.5 + 0.5;
  vec3 c = mix(vec3(0.02), vec3(0.62), smoothstep(0.42, 0.98, y));
  c += vec3(0.9) * smoothstep(0.86, 0.995, y) * 1.5;
  c += ACCENT * 0.5 * smoothstep(0.55, 0.0, y) * smoothstep(0.3, 0.9, r.x * 0.5 + 0.5);
  c += MOSS * 2.0 * smoothstep(0.5, 0.0, y);
  return c;
}
`;

/** Liquid chrome — metaballs fused by a smooth minimum, mirror material, heavy fresnel. */
const CHROME = `${NOISE}${SDF}
float map(vec3 p){
  float t = u_time * 0.22 + u_seed;
  float d = sdSphere(p - vec3(sin(t) * 0.62, cos(t * 0.81) * 0.42, 0.0), 0.72);
  d = smin(d, sdSphere(p - vec3(cos(t * 1.13) * 0.74, sin(t * 0.67) * 0.52, sin(t * 0.9) * 0.35), 0.56), 0.52);
  d = smin(d, sdSphere(p - vec3(sin(t * 0.63 + 2.1) * 0.55, cos(t * 1.27) * 0.63, -0.25), 0.46), 0.46);
  d = smin(d, sdSphere(p - vec3(cos(t * 0.44 + 4.0) * 0.9, sin(t * 0.53 + 1.0) * 0.8, 0.3), 0.34), 0.4);
  // surface tension ripples, so the metal reads as liquid and not as plastic
  d += 0.035 * snoise(p.xy * 3.1 + t * 0.6) + 0.018 * snoise(p.yz * 6.0 - t * 0.4);
  return d;
}
vec3 nrm(vec3 p){
  vec2 e = vec2(0.0025, 0.0);
  return normalize(vec3(map(p + e.xyy) - map(p - e.xyy), map(p + e.yxy) - map(p - e.yxy), map(p + e.yyx) - map(p - e.yyx)));
}
void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
  uv.x += u_offset * 1.1;
  vec3 ro = vec3(0.0, 0.0, 3.1);
  vec3 rd = normalize(vec3(uv * 1.25, -1.5));
  float d = 0.0;
  float hit = 0.0;
  vec3 p = ro;
  for(int i = 0; i < 72; i++){
    p = ro + rd * d;
    float s = map(p);
    if(s < 0.0016){ hit = 1.0; break; }
    if(d > 7.0) break;
    d += s * 0.82;
  }
  vec3 col = BG + MOSS * 0.5 * smoothstep(0.9, -0.4, length(uv));
  if(hit > 0.5){
    vec3 n = nrm(p);
    vec3 r = reflect(rd, n);
    float fres = pow(1.0 - max(dot(n, -rd), 0.0), 4.0);
    col = env(r) * 0.92;
    col += vec3(1.0) * pow(max(dot(r, normalize(vec3(0.4, 0.9, 0.35))), 0.0), 90.0) * 1.9;
    col += ACCENT * fres * 0.55;
    col = mix(col, col * 1.35, fres);
  }
  col += (grain(gl_FragCoord.xy + u_time) - 0.5) * 0.035;
  gl_FragColor = vec4(col, 1.0);
}
`;

/** Inflated Y2K type — rounded volumes blown up like foil balloons, glossy dielectric. */
const INFLATE = `${NOISE}${SDF}
float map(vec3 p){
  float t = u_time * 0.3 + u_seed * 0.7;
  vec3 q = p;
  q.xy = mat2(cos(t * 0.2), -sin(t * 0.2), sin(t * 0.2), cos(t * 0.2)) * q.xy;
  float ring = sdTorus(q - vec3(0.0, 0.05, 0.0), vec2(0.78, 0.34 + 0.03 * sin(t * 1.7)));
  float bar = sdRoundBox(q - vec3(0.0, -0.02, 0.0), vec3(0.1, 0.62, 0.1), 0.3);
  float d = smin(ring, bar, 0.34);
  float blob = sdSphere(q - vec3(sin(t * 0.9) * 1.05, cos(t * 0.7) * 0.72, 0.35), 0.3);
  d = smin(d, blob, 0.42);
  // the "inflation": a low-frequency swell that never lets the surface look rigid
  d -= 0.045 * (0.5 + 0.5 * sin(t * 1.3 + q.y * 2.0));
  return d;
}
vec3 nrm(vec3 p){
  vec2 e = vec2(0.003, 0.0);
  return normalize(vec3(map(p + e.xyy) - map(p - e.xyy), map(p + e.yxy) - map(p - e.yxy), map(p + e.yyx) - map(p - e.yyx)));
}
void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
  uv.x += u_offset * 1.1;
  vec3 ro = vec3(0.0, 0.0, 3.4);
  vec3 rd = normalize(vec3(uv * 1.2, -1.6));
  float d = 0.0; float hit = 0.0; vec3 p = ro;
  for(int i = 0; i < 64; i++){
    p = ro + rd * d;
    float s = map(p);
    if(s < 0.002){ hit = 1.0; break; }
    if(d > 8.0) break;
    d += s * 0.85;
  }
  vec3 col = BG + MOSS * 0.6 * smoothstep(1.1, -0.2, length(uv));
  if(hit > 0.5){
    vec3 n = nrm(p);
    vec3 r = reflect(rd, n);
    vec3 l = normalize(vec3(0.45, 0.85, 0.6));
    float fres = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);
    float diff = max(dot(n, l), 0.0);
    col = mix(vec3(0.055, 0.06, 0.05), ACCENT * 0.34, diff * 0.8);
    col += env(r) * 0.3;
    col += vec3(1.0) * pow(max(dot(r, l), 0.0), 140.0) * 2.4;      // the hot balloon highlight
    col += vec3(0.85, 1.0, 0.55) * pow(max(dot(r, normalize(vec3(-0.6, 0.4, 0.7))), 0.0), 40.0) * 0.5;
    col += ACCENT * fres * 0.42;
  }
  col += (grain(gl_FragCoord.xy + u_time) - 0.5) * 0.03;
  gl_FragColor = vec4(col, 1.0);
}
`;

/** Domain warping — fbm feeding the coordinates of fbm, twice. Organic, never repeats. */
const WARP = `${NOISE}
void main(){
  vec2 p = world() * 0.42 + u_seed * 0.7;
  float t = u_time * 0.045;
  vec2 q = vec2(fbm(p + vec2(0.0, 1.3) + t), fbm(p + vec2(5.2, 1.3) - t * 0.6));
  vec2 r = vec2(fbm(p + 1.7 * q + vec2(1.7, 9.2) + t * 0.7), fbm(p + 1.7 * q + vec2(8.3, 2.8) - t * 0.4));
  float f = fbm(p + 1.5 * r);
  float v = clamp(f * 0.75 + 0.5, 0.0, 1.0);
  float relief = length(r);
  vec3 col = mix(BG, MOSS * 1.5, smoothstep(0.16, 0.70, v));
  col = mix(col, GRAPH * 1.35, smoothstep(0.66, 0.95, v));
  col = mix(col, vec3(0.74, 0.76, 0.70), smoothstep(0.93, 1.0, v) * 0.4);
  col += ACCENT * smoothstep(0.86, 1.0, v) * (0.3 + 0.7 * relief);
  // contour lines pulled from the warped field, so the topography reads as measured
  float band = abs(fract(f * 1.3 + t) - 0.5);
  col += ACCENT * 0.34 * smoothstep(0.035, 0.0, band) * smoothstep(0.2, 0.65, v);
  col += (grain(gl_FragCoord.xy + u_time) - 0.5) * 0.035;
  gl_FragColor = vec4(col, 1.0);
}
`;

/** Curl-noise advection — divergence-free flow, so it smears like ink instead of blurring. */
const CURL = `${NOISE}
vec2 curl(vec2 p){
  float e = 0.09;
  float n1 = fbm(p + vec2(0.0, e));
  float n2 = fbm(p - vec2(0.0, e));
  float n3 = fbm(p + vec2(e, 0.0));
  float n4 = fbm(p - vec2(e, 0.0));
  return vec2(n1 - n2, n4 - n3) / (2.0 * e);
}
void main(){
  vec2 p = world() * 1.9 + u_seed * 0.4;
  float t = u_time * 0.05;
  // Walk the sample point backwards along the flow: a stateless stand-in for
  // advection, which normally needs a frame buffer carrying the previous step.
  vec2 q = p;
  for(int i = 0; i < 14; i++){
    q -= curl(q + vec2(t, -t * 0.7)) * 0.028;
  }
  float f = fbm(q * 1.6 + t);
  float v = f * 0.5 + 0.5;
  float streak = smoothstep(0.35, 0.95, abs(fbm(q * 3.2 - t * 1.4)));
  vec3 col = mix(BG, MOSS * 1.35, smoothstep(0.2, 0.82, v));
  col += GRAPH * streak * 0.55;
  col += ACCENT * smoothstep(0.90, 1.0, v) * 0.85;
  col += ACCENT * 0.16 * streak * smoothstep(0.62, 0.95, v);
  col += (grain(gl_FragCoord.xy + u_time) - 0.5) * 0.04;
  gl_FragColor = vec4(col, 1.0);
}
`;

/** Ordered dithering — an 8×8 Bayer matrix quantising a warped field to few levels. */
const DITHER = `${NOISE}
float bayer8(vec2 c){
  vec2 t = floor(mod(c, 8.0));
  float a = 0.0;
  for(int i = 0; i < 3; i++){
    vec2 b = mod(t, 2.0);
    a = a * 4.0 + b.y * 2.0 + mod(b.x + b.y, 2.0);   // position LSB lands in the index MSB: the bit reversal that makes it Bayer
    t = floor(t * 0.5);
  }
  return (a + 0.5) / 64.0;
}
void main(){
  vec2 p = world() * 0.62 + u_seed * 0.5;
  float t = u_time * 0.05;
  vec2 q = vec2(fbm(p + t), fbm(p + vec2(4.1, 2.3) - t));
  float v = fbm(p + 1.8 * q) * 0.8 + 0.5;
  // widen the tonal range first: a flat field quantises to one flat step
  v = clamp(smoothstep(0.05, 0.95, v), 0.0, 1.0);
  float px = max(u_res.y / 150.0, 1.0);            // dither cell scales with output, so it survives export
  float th = bayer8(gl_FragCoord.xy / px);
  float lv = 3.0;                                  // few levels — the pattern is the image, not an artefact
  float q1 = floor(v * lv + th) / lv;              // quantise with the threshold as the error term
  // This is a ground for type, so the acid stays a minority: three steps of
  // near-black, one narrow band of accent at the very top of the range.
  // The tone ramp follows the quantised steps, but the accent is gated on the
  // continuous field: keyed to q1 it would flood every pixel of the top step.
  vec3 col = mix(BG, MOSS * 1.15, smoothstep(0.0, 0.55, q1));
  col = mix(col, GRAPH * 1.1, smoothstep(0.55, 0.9, q1));
  col = mix(col, ACCENT * 0.9, step(0.99, q1) * smoothstep(0.93, 0.995, v));
  gl_FragColor = vec4(col, 1.0);
}
`;

/** Halftone — a rotated dot screen whose dot radius tracks luminance, print-style. */
const HALFTONE = `${NOISE}
float dots(vec2 uv, float ang, float freq, float lum){
  float c = cos(ang), s = sin(ang);
  vec2 r = mat2(c, -s, s, c) * uv * freq;
  vec2 g = fract(r) - 0.5;
  float aa = 1.6 * freq / u_res.y;                 // one pixel, in cell units
  return smoothstep(aa, -aa, length(g) - sqrt(clamp(lum, 0.0, 1.0)) * 0.46);
}
void main(){
  vec2 p = world() * 0.6 + u_seed * 0.3;
  float t = u_time * 0.045;
  vec2 q = vec2(fbm(p + t * 0.8), fbm(p + vec2(3.7, 1.1) - t));
  float v = clamp(fbm(p + 1.6 * q) * 0.8 + 0.48, 0.0, 1.0);
  v = smoothstep(0.12, 0.95, v);
  vec2 uv = gl_FragCoord.xy / u_res.y;
  float freq = 30.0;
  float k = dots(uv, 0.2618, freq, smoothstep(0.42, 1.0, v));       // 15°, the ink screen angle
  float a = dots(uv + 0.013, 1.3090, freq * 0.86, smoothstep(0.93, 1.0, v)); // 75°, the accent screen
  vec3 col = BG + MOSS * 0.55 * v;
  col = mix(col, vec3(0.74, 0.75, 0.71), k * 0.5);
  col = mix(col, ACCENT, a * 0.85);
  col += (grain(gl_FragCoord.xy + u_time) - 0.5) * 0.03;
  gl_FragColor = vec4(col, 1.0);
}
`;

const SOURCES: Record<ShaderId, string> = {
  liquid: LIQUID,
  mesh: MESH,
  grid: GRID,
  aurora: AURORA,
  chrome: CHROME,
  inflate: INFLATE,
  warp: WARP,
  curl: CURL,
  dither: DITHER,
  halftone: HALFTONE,
};

export const SHADER_LABELS: Record<ShaderId, string> = {
  liquid: "Liquid Simplex Warp",
  mesh: "Organic Gradient Mesh",
  grid: "Topographic Contours",
  aurora: "Vertical Aurora Field",
  chrome: "Liquid Chrome · SDF Raymarch",
  inflate: "Inflated Y2K · SDF Raymarch",
  warp: "Domain Warping · FBM",
  curl: "Curl-Noise Advection",
  dither: "Bayer 8×8 Ordered Dither",
  halftone: "Rotated Halftone Screen",
};

interface Program {
  prog: WebGLProgram;
  uRes: WebGLUniformLocation | null;
  uTime: WebGLUniformLocation | null;
  uSeed: WebGLUniformLocation | null;
  uOffset: WebGLUniformLocation | null;
  uSlides: WebGLUniformLocation | null;
}

export class ShaderRenderer {
  readonly canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext | null;
  private programs = new Map<ShaderId, Program>();
  private buffer: WebGLBuffer | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.gl =
      (canvas.getContext("webgl", {
        preserveDrawingBuffer: true,
        antialias: false,
        premultipliedAlpha: false,
      }) as WebGLRenderingContext | null) ?? null;
    if (this.gl) {
      const gl = this.gl;
      gl.getExtension("OES_standard_derivatives");
      this.buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW
      );
    }
  }

  get available() {
    return !!this.gl;
  }

  private compile(id: ShaderId): Program | null {
    const gl = this.gl;
    if (!gl) return null;
    const cached = this.programs.get(id);
    if (cached) return cached;
    if (gl.isContextLost()) return null;
    const make = (type: number, src: string) => {
      const sh = gl.createShader(type);
      if (!sh) return null;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error("Shader compile error", id, gl.getShaderInfoLog(sh));
      }
      return sh;
    };
    const fragSrc =
      id === "grid"
        ? "#extension GL_OES_standard_derivatives : enable\n" + SOURCES[id]
        : SOURCES[id];
    const prog = gl.createProgram();
    const vs = make(gl.VERTEX_SHADER, VERT);
    const fs = make(gl.FRAGMENT_SHADER, fragSrc);
    if (!prog || !vs || !fs) return null;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.bindAttribLocation(prog, 0, "a_pos");
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("Program link error", gl.getProgramInfoLog(prog));
    }
    const p: Program = {
      prog,
      uRes: gl.getUniformLocation(prog, "u_res"),
      uTime: gl.getUniformLocation(prog, "u_time"),
      uSeed: gl.getUniformLocation(prog, "u_seed"),
      uOffset: gl.getUniformLocation(prog, "u_offset"),
      uSlides: gl.getUniformLocation(prog, "u_slides"),
    };
    this.programs.set(id, p);
    return p;
  }

  render(
    id: ShaderId,
    w: number,
    h: number,
    time: number,
    seed: number,
    offset = 0,
    slides = 1
  ) {
    const gl = this.gl;
    if (!gl) return false;
    const p = this.compile(id);
    if (!p) return false;
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    gl.viewport(0, 0, w, h);
    gl.useProgram(p.prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(p.uRes, w, h);
    gl.uniform1f(p.uTime, time);
    gl.uniform1f(p.uSeed, seed);
    gl.uniform1f(p.uOffset, offset);
    gl.uniform1f(p.uSlides, slides);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    return true;
  }

  /** Releases GPU programs. Keeps the context alive so the same canvas can be reused. */
  dispose(loseContext = false) {
    const gl = this.gl;
    if (!gl) return;
    this.programs.forEach((p) => gl.deleteProgram(p.prog));
    this.programs.clear();
    if (this.buffer) gl.deleteBuffer(this.buffer);
    this.buffer = null;
    if (loseContext) gl.getExtension("WEBGL_lose_context")?.loseContext();
    this.gl = null;
  }
}

let offscreen: ShaderRenderer | null = null;
const snapshotCache = new Map<string, string>();

function getOffscreen() {
  if (!offscreen) {
    const c = document.createElement("canvas");
    c.width = 4;
    c.height = 4;
    offscreen = new ShaderRenderer(c);
  }
  return offscreen;
}

/** Fallback CSS-like gradient rendered on 2D canvas when WebGL is unavailable. */
function fallbackGradient(w: number, h: number, seed: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "#080808");
  g.addColorStop(0.55, "#101508");
  g.addColorStop(1, "#1a2404");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  const rg = ctx.createRadialGradient(
    w * (0.3 + (seed % 5) * 0.1),
    h * 0.7,
    0,
    w * 0.5,
    h * 0.6,
    w * 0.9
  );
  rg.addColorStop(0, "rgba(212,255,0,0.28)");
  rg.addColorStop(1, "rgba(212,255,0,0)");
  ctx.fillStyle = rg;
  ctx.fillRect(0, 0, w, h);
  return c.toDataURL("image/jpeg", 0.9);
}

/**
 * Renders a static frame of the shader and returns a JPEG data URL.
 * Results are memoized by (id, size, seed, offset, time).
 */
export function shaderSnapshot(
  id: ShaderId,
  w: number,
  h: number,
  seed: number,
  offset = 0,
  slides = 1,
  time = 4.2
): string {
  const key = `${id}|${w}x${h}|${seed}|${offset}|${slides}|${time}`;
  const hit = snapshotCache.get(key);
  if (hit) return hit;
  const r = getOffscreen();
  let url: string;
  if (r.available && r.render(id, w, h, time, seed, offset, slides)) {
    url = r.canvas.toDataURL("image/jpeg", 0.92);
  } else {
    url = fallbackGradient(w, h, seed);
  }
  snapshotCache.set(key, url);
  return url;
}
