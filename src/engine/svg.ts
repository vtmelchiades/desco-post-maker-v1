import { BRAND, FORMATS, pillarById } from "../data/brand";
import type { Format, Post } from "../data/types";

/* ───────────────────────────── text measuring ───────────────────────────── */

const FD = BRAND.fonts.display;
const FM = BRAND.fonts.mono;

let measureCtx: CanvasRenderingContext2D | null = null;
const measureCache = new Map<string, number>();

function ctx2d() {
  if (!measureCtx) {
    const c = document.createElement("canvas");
    measureCtx = c.getContext("2d");
  }
  return measureCtx!;
}

export function clearMeasureCache() {
  measureCache.clear();
}

let probeText: SVGTextElement | null = null;

function probe(): SVGTextElement | null {
  if (probeText && probeText.isConnected) return probeText;
  if (typeof document === "undefined" || !document.body) return null;
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.setAttribute("text-rendering", "geometricPrecision");
  svg.style.cssText = "position:absolute;left:-99999px;top:0;width:0;height:0;overflow:hidden;pointer-events:none";
  probeText = document.createElementNS(NS, "text");
  probeText.setAttribute("xml:space", "preserve");
  svg.appendChild(probeText);
  document.body.appendChild(svg);
  return probeText;
}

function measure(text: string, size: number, family: string, italic = false, ls = 0) {
  const key = `${family}|${size}|${italic ? 1 : 0}|${ls}|${text}`;
  let w = measureCache.get(key);
  if (w === undefined) {
    const t = probe();
    if (t) {
      t.setAttribute("font-family", family);
      t.setAttribute("font-size", String(size));
      t.setAttribute("font-style", italic ? "italic" : "normal");
      t.setAttribute("letter-spacing", String(ls));
      t.textContent = text;
      w = t.getComputedTextLength();
    } else {
      const c = ctx2d();
      c.font = `${italic ? "italic " : ""}400 ${size}px ${family}`;
      w = c.measureText(text).width + Math.max(0, text.length - 1) * ls;
    }
    measureCache.set(key, w);
  }
  return w;
}

/* ───────────────────────────── rich runs & wrap ─────────────────────────── */

interface Run {
  text: string;
  em: boolean;
}

export function parseRuns(s: string): Run[] {
  const out: Run[] = [];
  const parts = s.split("*");
  parts.forEach((p, i) => {
    if (p.length) out.push({ text: p, em: i % 2 === 1 });
  });
  return out;
}

export const plain = (s: string) => s.replace(/\*/g, "");

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

interface Token {
  text: string;
  em: boolean;
  glue: boolean;
}

function tokenize(runs: Run[]): Token[] {
  const tokens: Token[] = [];
  let prevEndsWithSpace = true;
  runs.forEach((r) => {
    const startsWithSpace = /^\s/.test(r.text);
    const parts = r.text.split(/\s+/).filter((w) => w.length);
    parts.forEach((word, i) => {
      const glue = i === 0 && !startsWithSpace && !prevEndsWithSpace && tokens.length > 0;
      tokens.push({ text: word, em: r.em, glue });
    });
    prevEndsWithSpace = /\s$/.test(r.text);
  });
  return tokens;
}

function wrapRuns(runs: Run[], maxW: number, size: number, family: string, ls = 0): Run[][] {
  const lines: Run[][] = [];
  let line: Run[] = [];
  let lineW = 0;
  const spaceW = measure(" ", size, family, false, ls);
  tokenize(runs).forEach((tok) => {
    const w = measure(tok.text, size, family, tok.em, ls);
    const needsSpace = line.length > 0 && !tok.glue;
    const add = (needsSpace ? spaceW : 0) + w;
    if (line.length && lineW + add > maxW && !tok.glue) {
      lines.push(line);
      line = [];
      lineW = 0;
    }
    const prefix = line.length && !tok.glue ? " " : "";
    const last = line[line.length - 1];
    if (last && last.em === tok.em) {
      last.text += prefix + tok.text;
    } else if (last && prefix && !tok.em) {
      // keep the separating space attached to the previous run to avoid collapsed leading whitespace
      last.text += " ";
      line.push({ text: tok.text, em: tok.em });
    } else if (last && prefix) {
      last.text += " ";
      line.push({ text: tok.text, em: tok.em });
    } else {
      line.push({ text: tok.text, em: tok.em });
    }
    lineW += (line.length ? (prefix ? spaceW : 0) : 0) + w;
  });
  if (line.length) lines.push(line);
  return lines;
}

function lineWidth(line: Run[], size: number, family: string, ls = 0) {
  return line.reduce((acc, r) => acc + measure(r.text, size, family, r.em, ls), 0);
}

interface TextStyle {
  family: string;
  size: number;
  lh: number;
  fill: string;
  emFill?: string;
  anchor?: "start" | "middle" | "end";
  ls?: number;
  opacity?: number;
  extra?: string;
}

function renderLines(lines: Run[][], x: number, y: number, st: TextStyle) {
  const anchor = st.anchor ?? "start";
  const ls = st.ls ? ` letter-spacing="${st.ls}"` : "";
  const op = st.opacity !== undefined ? ` opacity="${st.opacity}"` : "";
  const emFill = st.emFill ?? st.fill;
  let svg = "";
  lines.forEach((line, i) => {
    const yy = y + i * st.lh;
    const spans = line
      .map((r) =>
        r.em
          ? `<tspan font-style="italic" fill="${emFill}">${esc(r.text)}</tspan>`
          : `<tspan>${esc(r.text)}</tspan>`
      )
      .join("");
    svg += `<text x="${x}" y="${yy.toFixed(1)}" font-family="${st.family}" font-size="${st.size}" fill="${st.fill}" text-anchor="${anchor}"${ls}${op}${st.extra ? " " + st.extra : ""} xml:space="preserve">${spans}</text>`;
  });
  return svg;
}

interface Fitted {
  size: number;
  lines: Run[][];
  height: number;
}

function fit(
  runs: Run[],
  maxW: number,
  maxLines: number,
  maxSize: number,
  minSize: number,
  family: string,
  lhRatio: number,
  ls = 0
): Fitted {
  let size = maxSize;
  let lines = wrapRuns(runs, maxW, size, family, ls);
  while ((lines.length > maxLines || lines.some((l) => lineWidth(l, size, family, ls) > maxW)) && size > minSize) {
    size -= 2;
    lines = wrapRuns(runs, maxW, size, family, ls);
  }
  return { size, lines, height: lines.length * size * lhRatio };
}

/* ───────────────────────────── render context ───────────────────────────── */

export interface RenderOptions {
  format: Format;
  slide?: number;
  /** image href for the background (URL or data URL). null = transparent (live canvas beneath). */
  bgHref: string | null;
  animate?: boolean;
  /**
   * Freezes every looping animation at this instant (in seconds) by baking the
   * computed transforms into the markup instead of emitting CSS keyframes.
   * Required for frame-by-frame video capture, where CSS animation cannot be
   * seeked. Leave undefined for the live preview and for static exports.
   */
  timeSec?: number;
  fontCss?: string;
  forExport?: boolean;
}

interface Ctx {
  W: number;
  H: number;
  P: number;
  top: number;
  bottom: number;
  uid: string;
  post: Post;
  fmt: Format;
  bg: string | null;
  animate: boolean;
  /** Baked animation instant in seconds, or null to emit CSS keyframes. */
  time: number | null;
  slide: number;
  ink: string;
  dim: string;
  mute: string;
  accent: string;
  line: string;
  surface: string;
  paper: boolean;
  forExport: boolean;
}

const pad2 = (n: number) => String(n).padStart(2, "0");

function filters(uid: string) {
  return `
<filter id="${uid}-mono" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="0.1"/><feComponentTransfer><feFuncR type="linear" slope="1.18" intercept="-0.08"/><feFuncG type="linear" slope="1.18" intercept="-0.08"/><feFuncB type="linear" slope="1.18" intercept="-0.08"/></feComponentTransfer></filter>
<filter id="${uid}-duotone" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="table" tableValues="0.03 0.16 0.83"/><feFuncG type="table" tableValues="0.03 0.2 1"/><feFuncB type="table" tableValues="0.03 0.04 0"/></feComponentTransfer></filter>
<filter id="${uid}-color" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="0.78"/><feComponentTransfer><feFuncR type="linear" slope="1.1" intercept="-0.05"/><feFuncG type="linear" slope="1.1" intercept="-0.05"/><feFuncB type="linear" slope="1.1" intercept="-0.05"/></feComponentTransfer></filter>
<linearGradient id="${uid}-fadeB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#080808" stop-opacity="0"/><stop offset="0.45" stop-color="#080808" stop-opacity="0.35"/><stop offset="1" stop-color="#080808" stop-opacity="0.94"/></linearGradient>
<linearGradient id="${uid}-fadeT" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#080808" stop-opacity="0.7"/><stop offset="1" stop-color="#080808" stop-opacity="0"/></linearGradient>
<linearGradient id="${uid}-fadeR" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#080808" stop-opacity="0"/><stop offset="1" stop-color="#080808" stop-opacity="0.85"/></linearGradient>`;
}

function imageEl(c: Ctx, href: string, x: number, y: number, w: number, h: number, filter?: string) {
  const f = filter ? ` filter="url(#${c.uid}-${filter})"` : "";
  return `<image xlink:href="${href}" href="${href}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice"${f}/>`;
}

function treatmentOf(c: Ctx) {
  const bg = c.post.background;
  return bg.type === "photo" ? bg.treatment : undefined;
}

function mono(
  text: string,
  x: number,
  y: number,
  size: number,
  fill: string,
  opts: { anchor?: "start" | "middle" | "end"; ls?: number; upper?: boolean; opacity?: number; extra?: string } = {}
) {
  const t = opts.upper === false ? text : text.toUpperCase();
  const ls = opts.ls ?? size * 0.14;
  return `<text x="${x}" y="${y}" font-family="${FM}" font-size="${size}" fill="${fill}" letter-spacing="${ls.toFixed(2)}" text-anchor="${opts.anchor ?? "start"}"${opts.opacity !== undefined ? ` opacity="${opts.opacity}"` : ""}${opts.extra ? " " + opts.extra : ""}>${esc(t)}</text>`;
}

function monoBlock(text: string, x: number, y: number, size: number, maxW: number, fill: string, anchor: "start" | "end" = "start") {
  const lines = wrapRuns([{ text: plain(text), em: false }], maxW, size, FM, 0);
  return {
    svg: renderLines(lines, x, y, { family: FM, size, lh: size * 1.5, fill, anchor }),
    height: lines.length * size * 1.5,
    lines: lines.length,
  };
}

function brandMark(c: Ctx, x: number, y: number, ink: string, size = 40) {
  return `<g id="brand-mark"><circle cx="${x + size * 0.22}" cy="${y - size * 0.3}" r="${size * 0.2}" fill="${c.accent}"/><text x="${x + size * 0.58}" y="${y}" font-family="${FD}" font-size="${size}" fill="${ink}" letter-spacing="-0.5">Desco</text></g>`;
}

function chrome(c: Ctx, opts: { hideBrand?: boolean; ink?: string } = {}) {
  const ink = opts.ink ?? c.ink;
  const pillar = pillarById(c.post.pillar);
  const yTop = c.top + c.P + 14;
  const yBot = c.H - c.bottom - c.P;
  let s = `<g id="META">`;
  s += `<rect x="${c.P}" y="${yTop - 12}" width="11" height="11" fill="${c.accent}"/>`;
  s += mono(`Desco / ${pillar.short} — ${c.post.tag}`, c.P + 24, yTop - 2, 15, ink, { opacity: 0.85 });
  s += mono(`N°${pad2(c.post.id)} / 50`, c.W - c.P, yTop - 2, 15, ink, { anchor: "end", opacity: 0.85 });
  s += `<line x1="${c.P}" y1="${yTop + 16}" x2="${c.W - c.P}" y2="${yTop + 16}" stroke="${c.line}" stroke-width="1"/>`;
  if (!opts.hideBrand) s += brandMark(c, c.P, yBot, ink, 38);
  s += mono(`${BRAND.city} — ${BRAND.coords}`, c.W - c.P, yBot - 18, 13, ink, { anchor: "end", opacity: 0.6 });
  s += mono(`${BRAND.handle} · ${BRAND.est}`, c.W - c.P, yBot + 2, 13, ink, { anchor: "end", opacity: 0.6 });
  s += `</g>`;
  return s;
}

function bgLayer(c: Ctx, extraOverlay = "") {
  let s = `<g id="BG"><rect width="${c.W}" height="${c.H}" fill="${c.paper ? BRAND.colors.paper : BRAND.colors.bg}"${c.bg === null && !c.paper ? ' fill-opacity="0"' : ""}/></g>`;
  s += `<g id="MEDIA">`;
  if (c.bg) s += imageEl(c, c.bg, 0, 0, c.W, c.H, treatmentOf(c));
  s += `</g>`;
  if (extraOverlay) s += `<g id="OVERLAY">${extraOverlay}</g>`;
  return s;
}

/* ───────────────────────────── archetypes ───────────────────────────────── */

function brutalist(c: Ctx) {
  const { W, H, P } = c;
  let s = bgLayer(
    c,
    `<rect width="${W}" height="${H}" fill="url(#${c.uid}-fadeB)"/><rect width="${W}" height="${H * 0.35}" fill="url(#${c.uid}-fadeT)"/>`
  );
  // grid
  s += `<g id="GRID" stroke="${c.line}" stroke-width="1">`;
  s += `<line x1="${P}" y1="0" x2="${P}" y2="${H}"/><line x1="${W - P}" y1="0" x2="${W - P}" y2="${H}"/>`;
  s += `<line x1="${W * 0.62}" y1="${c.top + P + 30}" x2="${W * 0.62}" y2="${H * 0.45}"/>`;
  for (let y = c.top + P + 60; y < H - c.bottom - P - 40; y += 24) {
    const major = Math.round((y - c.top - P - 60) / 24) % 5 === 0;
    s += `<line x1="${W - P}" y1="${y}" x2="${W - P + (major ? 22 : 10)}" y2="${y}" stroke-opacity="${major ? 0.9 : 0.5}"/>`;
  }
  s += `</g>`;
  // huge index
  const idxSize = Math.round(W * 0.3);
  s += `<g id="INDEX"><text x="${W - P - 8}" y="${c.top + P + idxSize * 0.86}" font-family="${FD}" font-size="${idxSize}" fill="none" stroke="${c.ink}" stroke-width="1.4" stroke-opacity="0.55" text-anchor="end" letter-spacing="-8">${pad2(c.post.id)}</text></g>`;
  // headline
  const runs = parseRuns(c.post.headline);
  const maxW = W - P * 2 - 30;
  const f = fit(runs, maxW, 5, c.fmt === "story" ? 168 : 150, 84, FD, 0.92, -2);
  const sub = monoBlock(c.post.subheadline, P, 0, 20, W * 0.6, c.dim);
  const gap = 46;
  const footY = H - c.bottom - P - 70;
  const subY = footY - sub.height + 20 * 1.5;
  const headBottom = subY - 20 * 1.5 - gap;
  const headTop = headBottom - f.height;
  s += `<g id="TYPE">`;
  s += `<rect x="${P}" y="${headTop - 40}" width="64" height="4" fill="${c.accent}"/>`;
  s += renderLines(f.lines, P - 4, headTop + f.size * 0.78, { family: FD, size: f.size, lh: f.size * 0.92, fill: c.ink, emFill: c.accent, ls: -2 });
  s += `<text x="${P}" y="${subY}" font-family="${FM}" font-size="20" fill="${c.accent}">→</text>`;
  s += monoBlock(c.post.subheadline, P + 34, subY, 20, W * 0.62, c.dim).svg;
  s += mono(`${c.post.meta.client} · ${c.post.meta.discipline} · ${c.post.meta.year}`, W - P, headTop - 36, 13, c.ink, { anchor: "end", opacity: 0.55 });
  s += `</g>`;
  s += chrome(c);
  return s;
}

/* ─────────────────────── animation timing (bakeable) ────────────────────── */

/** Solves a CSS `cubic-bezier(x1,y1,x2,y2)` timing function for a given progress. */
function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const slopeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x: number) => {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const dx = sampleX(t) - x;
      if (Math.abs(dx) < 1e-6) break;
      const d = slopeX(t);
      if (Math.abs(d) < 1e-6) break;
      t -= dx / d;
    }
    t = Math.min(1, Math.max(0, t));
    return ((ay * t + by) * t + cy) * t;
  };
}

const PULSE_EASE = cubicBezier(0.45, 0, 0.55, 1);

/** Normalized progress [0,1) of a looping animation of `dur` seconds at time `t`. */
const loopProgress = (t: number, dur: number) => (((t % dur) + dur) % dur) / dur;

/** Marquee `translateX` at time `t` — mirrors `@keyframes mq` (linear, infinite). */
const marqueeShift = (t: number, dur: number, unitW: number, reverse: boolean) => {
  const p = loopProgress(t, dur);
  return -unitW * (reverse ? 1 - p : p);
};

/** Equalizer bar `scaleY` at time `t` — mirrors `@keyframes pulse` (alternate). */
const pulseScale = (t: number, delay: number) => {
  const te = t - delay;
  if (te <= 0) return 0.15;
  const iteration = Math.floor(te / 2.6);
  let p = (te % 2.6) / 2.6;
  if (iteration % 2 === 1) p = 1 - p;
  return 0.15 + 0.85 * PULSE_EASE(p);
};

/** `● REC` opacity at time `t` — mirrors `@keyframes blink` with `steps(2,end)`. */
const blinkOpacity = (t: number) => (loopProgress(t, 1.2) < 0.5 ? 1 : 0);

function kinetic(c: Ctx) {
  const { W, H, P } = c;
  const uid = c.uid;
  let s = bgLayer(c, `<rect width="${W}" height="${H}" fill="#080808" fill-opacity="0.42"/><rect width="${W}" height="${H}" fill="url(#${uid}-fadeB)" opacity="0.7"/>`);
  // `null` = live CSS keyframes; a number = every loop frozen at that instant so
  // the frame can be rasterized deterministically (video capture).
  const t = c.time;
  const play = c.animate ? "running" : "paused";
  const text = plain(c.post.headline).replace(/\.$/, "");
  const unit = `${text}  —  `;
  const bandSize = 132;
  const unitW = measure(unit, bandSize, FD, false, -2);
  const reps = Math.ceil((W * 2) / unitW) + 2;
  const repeated = Array.from({ length: reps }, () => unit).join("");
  const bars = 28;
  const mqDur = [unitW / 90, unitW / 70, unitW / 110];
  const mqReverse = [false, true, false];
  const spinDur = 22;
  if (t === null) {
    s += `<style>
.${uid}-mq1{animation:${uid}-mq ${mqDur[0].toFixed(1)}s linear infinite;animation-play-state:${play}}
.${uid}-mq2{animation:${uid}-mq ${mqDur[1].toFixed(1)}s linear infinite reverse;animation-play-state:${play}}
.${uid}-mq3{animation:${uid}-mq ${mqDur[2].toFixed(1)}s linear infinite;animation-play-state:${play}}
@keyframes ${uid}-mq{to{transform:translateX(${-unitW.toFixed(1)}px)}}
.${uid}-ring{animation:${uid}-spin ${spinDur}s linear infinite;animation-play-state:${play};transform-origin:${(W / 2).toFixed(1)}px ${(H * 0.5).toFixed(1)}px}
@keyframes ${uid}-spin{to{transform:rotate(360deg)}}
.${uid}-bar{transform-box:fill-box;transform-origin:bottom;animation:${uid}-pulse 2.6s cubic-bezier(.45,0,.55,1) infinite alternate;animation-play-state:${play}}
@keyframes ${uid}-pulse{from{transform:scaleY(0.15)}to{transform:scaleY(1)}}
.${uid}-blink{animation:${uid}-blink 1.2s steps(2,end) infinite;animation-play-state:${play}}
@keyframes ${uid}-blink{50%{opacity:0}}
</style>`;
  }
  // marquee bands (outline)
  const bandY = [c.top + P + 230, H * 0.5 + 40, H - c.bottom - P - 210];
  s += `<g id="MARQUEE">`;
  bandY.forEach((y, i) => {
    const x0 = i === 1 ? -unitW : 0;
    const band =
      t === null
        ? `<g class="${uid}-mq${i + 1}">`
        : `<g transform="translate(${marqueeShift(t, mqDur[i], unitW, mqReverse[i]).toFixed(2)} 0)">`;
    s += `${band}<text x="${x0}" y="${y}" font-family="${FD}" font-size="${bandSize}" fill="none" stroke="${c.ink}" stroke-width="1.1" stroke-opacity="${i === 1 ? 0.28 : 0.5}" letter-spacing="-2" xml:space="preserve">${esc(repeated)}</text></g>`;
  });
  s += `</g>`;
  // rotating ring
  const cx = W / 2;
  const cy = H * 0.5;
  const r = Math.min(W, H) * 0.31;
  const ringText = "DESCO · LABORATÓRIO DE ESTRATÉGIA · DESIGN · RUPTURA VISUAL · BAURU/SP · EST. 2015 · ";
  const ringAttr =
    t === null
      ? ` class="${uid}-ring"`
      : ` transform="rotate(${(loopProgress(t, spinDur) * 360).toFixed(3)} ${cx.toFixed(1)} ${cy.toFixed(1)})"`;
  s += `<g id="RING"${ringAttr}><defs><path id="${uid}-circ" d="M ${cx} ${cy} m -${r} 0 a ${r} ${r} 0 1 1 ${r * 2} 0 a ${r} ${r} 0 1 1 -${r * 2} 0"/></defs>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${r - 26}" fill="none" stroke="${c.accent}" stroke-width="1" stroke-opacity="0.7" stroke-dasharray="2 8"/>`;
  s += `<text font-family="${FM}" font-size="15" fill="${c.accent}" letter-spacing="4"><textPath xlink:href="#${uid}-circ" href="#${uid}-circ">${esc(ringText)}</textPath></text></g>`;
  // central headline
  const f = fit(parseRuns(c.post.headline), W - P * 2 - 40, 4, 112, 64, FD, 0.94, -1.5);
  const hy = cy - f.height / 2 + f.size * 0.8;
  s += `<g id="TYPE">`;
  s += `<rect x="${P + 20}" y="${cy - f.height / 2 - 34}" width="${W - P * 2 - 40}" height="${f.height + 72}" fill="#080808" fill-opacity="0.55"/>`;
  s += renderLines(f.lines, W / 2, hy, { family: FD, size: f.size, lh: f.size * 0.94, fill: c.ink, emFill: c.accent, anchor: "middle", ls: -1.5 });
  s += mono(plain(c.post.subheadline), W / 2, cy + f.height / 2 + 66, 15, c.dim, { anchor: "middle", upper: false, ls: 0.5 });
  s += `</g>`;
  // equalizer bars
  const barW = 6;
  const span = W - P * 2;
  const step = span / (bars - 1);
  const baseY = H - c.bottom - P - 92;
  s += `<g id="BARS">`;
  for (let i = 0; i < bars; i++) {
    const h = 26 + Math.abs(Math.sin(i * 0.7 + c.post.id)) * 54;
    const delay = i * 0.09;
    const x = (P + i * step - barW / 2).toFixed(1);
    const fill = i % 7 === 0 ? c.accent : c.ink;
    const opacity = i % 7 === 0 ? 1 : 0.55;
    if (t === null) {
      s += `<rect class="${uid}-bar" x="${x}" y="${baseY - h}" width="${barW}" height="${h}" fill="${fill}" opacity="${opacity}" style="animation-delay:${delay.toFixed(2)}s"/>`;
    } else {
      // scaleY about the bar's bottom edge, baked into y/height
      const bh = h * pulseScale(t, delay);
      s += `<rect x="${x}" y="${(baseY - bh).toFixed(2)}" width="${barW}" height="${bh.toFixed(2)}" fill="${fill}" opacity="${opacity}"/>`;
    }
  }
  s += `</g>`;
  const rec = t === null ? { extra: `class="${uid}-blink"` } : { opacity: blinkOpacity(t) };
  s += `<g id="STATUS">${mono("● REC", W - P, c.top + P + 80, 13, c.accent, { anchor: "end", ...rec })}${mono("LOOP / 00:00:24", W - P, c.top + P + 102, 13, c.ink, { anchor: "end", opacity: 0.55 })}</g>`;
  s += chrome(c);
  return s;
}

function split(c: Ctx) {
  const { W, H, P } = c;
  const cutY = c.fmt === "story" ? H * 0.5 : H * 0.56;
  const diag = 96;
  let s = `<g id="BG"><rect width="${W}" height="${H}" fill="#0c0c0c"/></g>`;
  s += `<defs><clipPath id="${c.uid}-clip"><polygon points="0,0 ${W},0 ${W},${cutY - diag} 0,${cutY}"/></clipPath></defs>`;
  s += `<g id="MEDIA" clip-path="url(#${c.uid}-clip)">`;
  if (c.bg) s += imageEl(c, c.bg, 0, 0, W, cutY, treatmentOf(c));
  else s += `<rect width="${W}" height="${cutY}" fill="#080808" fill-opacity="0"/>`;
  s += `<rect width="${W}" height="${cutY}" fill="url(#${c.uid}-fadeT)" opacity="0.8"/>`;
  s += `</g>`;
  s += `<g id="OVERLAY"><polygon points="0,${cutY} ${W},${cutY - diag} ${W},${cutY - diag + 5} 0,${cutY + 5}" fill="${c.accent}"/></g>`;
  // side stamp
  s += `<g id="STAMP" transform="rotate(-90 ${W - P + 22} ${cutY - diag - 40})">${mono(`CASE STUDY — ${c.post.meta.client}`, W - P + 22, cutY - diag - 40, 13, c.ink, { anchor: "start", opacity: 0.7 })}</g>`;
  // circle marker at cut
  s += `<g id="MARK"><circle cx="${P + 18}" cy="${cutY - 60}" r="34" fill="#080808" stroke="${c.accent}" stroke-width="1"/><text x="${P + 18}" y="${cutY - 51}" font-family="${FM}" font-size="24" fill="${c.accent}" text-anchor="middle">↓</text></g>`;
  // text block
  const blockTop = cutY + 70;
  const runs = parseRuns(c.post.headline);
  const rows: [string, string][] = [
    ["Cliente", c.post.meta.client],
    ["Disciplina", c.post.meta.discipline],
    ["Ano", c.post.meta.year],
  ];
  const rowH = 46;
  const tableBottom = H - c.bottom - P - 78;
  const tableTop = tableBottom - rows.length * rowH;
  const subProbe = monoBlock(c.post.subheadline, P, 0, 19, W - P * 2, c.dim);
  const available = tableTop - 40 - blockTop - 40 - subProbe.height - 44;
  let maxSize = c.fmt === "story" ? 104 : 92;
  let f = fit(runs, W - P * 2, 4, maxSize, 44, FD, 0.94, -1.5);
  while (f.height > available && maxSize > 44) {
    maxSize -= 4;
    f = fit(runs, W - P * 2, 4, maxSize, 44, FD, 0.94, -1.5);
  }
  s += `<g id="TYPE">`;
  s += mono(c.post.tag, P, blockTop, 14, c.accent);
  s += renderLines(f.lines, P - 3, blockTop + 40 + f.size * 0.8, { family: FD, size: f.size, lh: f.size * 0.94, fill: c.ink, emFill: c.accent, ls: -1.5 });
  const subY = blockTop + 40 + f.height + 44;
  const sub = monoBlock(c.post.subheadline, P, subY, 19, W - P * 2, c.dim);
  s += sub.svg;
  s += `</g>`;
  // data table
  s += `<g id="DATA">`;
  rows.forEach(([k, v], i) => {
    const y = tableTop + i * rowH;
    s += `<line x1="${P}" y1="${y}" x2="${W - P}" y2="${y}" stroke="${c.line}"/>`;
    s += mono(k, P, y + 29, 13, c.ink, { opacity: 0.5 });
    s += mono(v, P + 200, y + 29, 15, c.ink, { upper: false, ls: 0, opacity: 0.95 });
    s += mono(pad2(i + 1), W - P, y + 29, 13, c.accent, { anchor: "end" });
  });
  s += `<line x1="${P}" y1="${tableBottom}" x2="${W - P}" y2="${tableBottom}" stroke="${c.line}"/>`;
  s += `</g>`;
  s += chrome(c);
  return s;
}

function stat(c: Ctx) {
  const { W, H, P } = c;
  const st = c.post.stat ?? { value: "01", label: "" };
  let s = bgLayer(c, `<rect width="${W}" height="${H}" fill="#080808" fill-opacity="${c.post.background.type === "photo" ? 0.66 : 0.3}"/><rect width="${W}" height="${H}" fill="url(#${c.uid}-fadeB)" opacity="0.8"/>`);
  // technical frame
  const fx = P - 24;
  const fy = c.top + P + 60;
  const fw = W - fx * 2;
  const fh = H - c.bottom - P - 120 - fy;
  s += `<g id="GRID" stroke="${c.line}" stroke-width="1" fill="none">`;
  s += `<rect x="${fx}" y="${fy}" width="${fw}" height="${fh}"/>`;
  const cross = (x: number, y: number) => `<line x1="${x - 14}" y1="${y}" x2="${x + 14}" y2="${y}" stroke="${c.accent}"/><line x1="${x}" y1="${y - 14}" x2="${x}" y2="${y + 14}" stroke="${c.accent}"/>`;
  s += cross(fx, fy) + cross(fx + fw, fy) + cross(fx, fy + fh) + cross(fx + fw, fy + fh);
  s += `<line x1="${W / 2}" y1="${fy}" x2="${W / 2}" y2="${fy + 26}"/><line x1="${W / 2}" y1="${fy + fh - 26}" x2="${W / 2}" y2="${fy + fh}"/>`;
  s += `</g>`;
  // big value
  const valRuns = [{ text: st.value, em: false }];
  const valMaxW = W - P * 2;
  const vf = fit(valRuns, valMaxW, 1, c.fmt === "story" ? 560 : 470, 120, FD, 0.86, -12);
  const cy = fy + fh * (c.fmt === "story" ? 0.4 : 0.42);
  s += `<g id="STAT">`;
  s += renderLines(vf.lines, W / 2, cy + vf.size * 0.3, { family: FD, size: vf.size, lh: vf.size, fill: c.accent, anchor: "middle", ls: -12 });
  const labelY = cy + vf.size * 0.3 + 74;
  s += `<line x1="${P + 40}" y1="${labelY - 40}" x2="${W - P - 40}" y2="${labelY - 40}" stroke="${c.line}"/>`;
  const lab = wrapRuns([{ text: st.label, em: false }], W - P * 2 - 80, 17, FM, 3);
  s += renderLines(lab, W / 2, labelY, { family: FM, size: 17, lh: 28, fill: c.ink, anchor: "middle", ls: 3 });
  s += `<line x1="${P + 40}" y1="${labelY + lab.length * 28 - 4}" x2="${W - P - 40}" y2="${labelY + lab.length * 28 - 4}" stroke="${c.line}"/>`;
  s += mono("FIG. 01", fx + 20, fy + 34, 13, c.ink, { opacity: 0.55 });
  s += mono(`DATA / ${c.post.meta.year}`, fx + fw - 20, fy + 34, 13, c.ink, { anchor: "end", opacity: 0.55 });
  s += `</g>`;
  // headline & sub
  const f = fit(parseRuns(c.post.headline), fw - 80, 3, 60, 40, FD, 0.98, -1);
  const sub = monoBlock(c.post.subheadline, fx + 40, 0, 16, fw - 80, c.dim);
  const subBase = fy + fh - 40 - (sub.lines - 1) * 24;
  const headBase = subBase - sub.lines * 24 - 24 - (f.lines.length - 1) * f.size * 0.98;
  s += `<g id="TYPE">`;
  s += renderLines(f.lines, fx + 40, headBase, { family: FD, size: f.size, lh: f.size * 0.98, fill: c.ink, emFill: c.accent, ls: -1 });
  s += monoBlock(c.post.subheadline, fx + 40, subBase, 16, fw - 80, c.dim).svg;
  s += `</g>`;
  s += chrome(c);
  return s;
}

function minimal(c: Ctx) {
  const { W, H } = c;
  const ink = c.paper ? BRAND.colors.ink : c.ink;
  const dim = c.paper ? "rgba(8,8,8,0.6)" : c.dim;
  const line = c.paper ? "rgba(8,8,8,0.35)" : c.line;
  let s = `<g id="BG"><rect width="${W}" height="${H}" fill="${c.paper ? BRAND.colors.paper : BRAND.colors.bg}"/></g>`;
  const inset = 46;
  const fx = inset;
  const fy = c.top + inset;
  const fw = W - inset * 2;
  const fh = H - c.bottom - c.top - inset * 2;
  // image tile
  const iw = Math.round(fw * 0.46);
  const ih = Math.round(iw * 1.18);
  const ix = fx + fw - iw - 40;
  const iy = fy + 92;
  s += `<g id="MEDIA">`;
  if (c.bg) s += imageEl(c, c.bg, ix, iy, iw, ih, treatmentOf(c));
  else s += `<rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" fill="#080808" fill-opacity="0"/>`;
  s += `<rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" fill="none" stroke="${line}"/>`;
  s += `</g>`;
  s += `<g id="GRID" fill="none" stroke="${line}" stroke-width="1">`;
  s += `<rect x="${fx}" y="${fy}" width="${fw}" height="${fh}"/>`;
  s += `<rect x="${fx + 12}" y="${fy + 12}" width="${fw - 24}" height="${fh - 24}" stroke-opacity="0.45"/>`;
  s += `<line x1="${fx + 12}" y1="${iy + ih + 60}" x2="${ix - 40}" y2="${iy + ih + 60}"/>`;
  s += `</g>`;
  // vertical side text
  s += `<g id="SIDE" transform="rotate(90 ${fx + fw - 26} ${fy + 40})">${mono(`${BRAND.name} — ${BRAND.tagline}`, fx + fw - 26, fy + 40, 12, dim, { ls: 3 })}</g>`;
  // small caption next to image
  s += `<g id="CAPTION">`;
  s += mono(`FIG. ${pad2(c.post.id)}`, fx + 40, iy + 14, 12, dim);
  s += mono(c.post.meta.client, fx + 40, iy + 36, 12, dim, { upper: false, ls: 0 });
  s += `<circle cx="${fx + 48}" cy="${iy + ih - 6}" r="8" fill="${c.accent}"/>`;
  s += `</g>`;
  // headline lower-left
  const runs = parseRuns(c.post.headline);
  const f = fit(runs, fw - 80, 4, c.fmt === "story" ? 112 : 96, 56, FD, 0.96, -1.5);
  const subY = fy + fh - 60;
  const sub = monoBlock(c.post.subheadline, fx + 40, 0, 15, fw * 0.6, dim);
  const subBase = subY - (sub.lines - 1) * 22.5;
  let headBase = subBase - sub.lines * 22.5 - 36 - (f.lines.length - 1) * f.size * 0.96;
  let ff = f;
  let maxS = ff.size;
  while (headBase - ff.size * 0.8 < iy + ih + 80 && maxS > 48) {
    maxS -= 4;
    ff = fit(runs, fw - 80, 4, maxS, 48, FD, 0.96, -1.5);
    headBase = subBase - sub.lines * 22.5 - 36 - (ff.lines.length - 1) * ff.size * 0.96;
  }
  s += `<g id="TYPE">`;
  s += renderLines(ff.lines, fx + 37, headBase, { family: FD, size: ff.size, lh: ff.size * 0.96, fill: ink, emFill: c.paper ? ink : c.accent, ls: -1.5 });
  s += monoBlock(c.post.subheadline, fx + 40, subBase, 15, fw * 0.6, dim).svg;
  s += mono(c.post.tag, fx + fw - 40, subY, 12, dim, { anchor: "end" });
  s += `</g>`;
  // chrome (custom for frame)
  s += `<g id="META">`;
  s += brandMark(c, fx + 36, fy + 58, ink, 32);
  s += mono(`/ ${pillarById(c.post.pillar).short}`, fx + 150, fy + 50, 12, dim);
  s += mono(`N°${pad2(c.post.id)} / 50`, ix - 40, fy + 50, 12, dim, { anchor: "end" });
  s += mono(`${BRAND.city} — ${BRAND.coords}`, ix - 40, fy + 70, 11, dim, { anchor: "end" });
  s += `</g>`;
  return s;
}

function carousel(c: Ctx) {
  const { W, H, P } = c;
  const slides = c.post.slides ?? [];
  const N = slides.length;
  const i = c.slide;
  const slide = slides[i] ?? slides[0];
  const isPhoto = c.post.background.type === "photo";
  let s = `<g id="BG"><rect width="${W}" height="${H}" fill="#0b0b0b"${c.bg === null ? ' fill-opacity="0"' : ""}/></g>`;
  s += `<g id="MEDIA">`;
  if (c.bg) {
    if (isPhoto) {
      // image spans slides 0–1 continuously
      if (i <= 1) s += imageEl(c, c.bg, -i * W, 0, W * 2, H, treatmentOf(c));
    } else {
      s += imageEl(c, c.bg, 0, 0, W, H);
    }
  }
  s += `</g>`;
  s += `<g id="OVERLAY"><rect width="${W}" height="${H}" fill="url(#${c.uid}-fadeB)"/>${i === 1 && isPhoto ? `<rect width="${W}" height="${H}" fill="#080808" fill-opacity="0.35"/>` : ""}</g>`;
  // ghost headline across all slides
  const ghost = plain(c.post.headline).toUpperCase();
  const totalW = N * W - P * 2;
  const gw100 = measure(ghost, 100, FD, false, 2);
  const gsize = Math.min(340, Math.floor((100 * totalW) / gw100));
  const ghostY = c.top + P + 110 + gsize * 0.75;
  s += `<g id="GHOST"><text x="${P - i * W}" y="${ghostY}" font-family="${FD}" font-size="${gsize}" fill="none" stroke="${c.ink}" stroke-width="1.2" stroke-opacity="0.32" letter-spacing="2">${esc(ghost)}</text></g>`;
  // continuous rail with ticks
  const railY = c.fmt === "story" ? H * 0.5 + 10 : H * 0.47;
  s += `<g id="RAIL">`;
  s += `<line x1="0" y1="${railY}" x2="${W}" y2="${railY}" stroke="${c.accent}" stroke-width="1"/>`;
  const tickStep = 75;
  for (let gx = 0; gx <= N * W; gx += tickStep) {
    const lx = gx - i * W;
    if (lx < -10 || lx > W + 10) continue;
    const major = (gx / tickStep) % 4 === 0;
    s += `<line x1="${lx}" y1="${railY}" x2="${lx}" y2="${railY + (major ? 22 : 10)}" stroke="${c.accent}" stroke-opacity="${major ? 1 : 0.5}"/>`;
    if (major) s += mono(String(gx / 10).padStart(4, "0"), lx + 6, railY + 40, 11, c.accent, { opacity: 0.8 });
  }
  // progress marker across slides
  const progX = ((i + 0.5) / N) * N * W - i * W;
  s += `<circle cx="${progX}" cy="${railY}" r="7" fill="${c.accent}"/>`;
  s += `</g>`;
  // border arrows continuity
  s += `<g id="ARROWS" stroke="${c.ink}" stroke-width="1.5" fill="none">`;
  if (i < N - 1) s += `<line x1="${W - 170}" y1="${railY - 60}" x2="${W + 30}" y2="${railY - 60}"/>`;
  if (i > 0) s += `<line x1="-30" y1="${railY - 60}" x2="${P - 10}" y2="${railY - 60}"/><polyline points="${P - 26},${railY - 70} ${P - 10},${railY - 60} ${P - 26},${railY - 50}"/>`;
  s += `</g>`;
  // slide content
  s += `<g id="TYPE">`;
  if (i === 0) {
    const f = fit(parseRuns(slide.headline), W - P * 2 - 20, 5, c.fmt === "story" ? 134 : 118, 72, FD, 0.92, -2);
    const body = monoBlock(slide.body, P, 0, 18, W * 0.7, c.dim);
    const bodyBase = H - c.bottom - P - 90 - (body.lines - 1) * 27;
    const headBase = bodyBase - body.lines * 27 - 40 - (f.lines.length - 1) * f.size * 0.92;
    s += mono(slide.kicker, P, headBase - f.size * 0.8 - 30, 14, c.accent);
    s += renderLines(f.lines, P - 4, headBase, { family: FD, size: f.size, lh: f.size * 0.92, fill: c.ink, emFill: c.accent, ls: -2 });
    s += monoBlock(slide.body, P, bodyBase, 18, W * 0.7, c.dim).svg;
    s += mono("Deslize →", W - P, bodyBase, 14, c.accent, { anchor: "end" });
  } else {
    const num = pad2(i);
    const numY = railY + 200;
    s += `<text x="${P - 6}" y="${numY}" font-family="${FD}" font-size="190" font-style="italic" fill="${c.accent}" letter-spacing="-8">${num}</text>`;
    s += mono(slide.kicker, P + 230, numY - 120, 14, c.accent);
    s += `<line x1="${P + 230}" y1="${numY - 100}" x2="${W - P}" y2="${numY - 100}" stroke="${c.line}"/>`;
    const f = fit(parseRuns(slide.headline), W - P * 2, 4, 88, 54, FD, 0.94, -1.5);
    const headTop = numY + 40;
    s += renderLines(f.lines, P - 3, headTop + f.size * 0.8, { family: FD, size: f.size, lh: f.size * 0.94, fill: c.ink, emFill: c.accent, ls: -1.5 });
    const bodyY = headTop + f.height + 44;
    const body = monoBlock(slide.body, P, bodyY, 19, W - P * 2 - 40, c.dim);
    s += body.svg;
    if (i === N - 1) {
      const ctaY = Math.min(bodyY + body.height + 60, H - c.bottom - P - 92);
      s += `<rect x="${P}" y="${ctaY - 22}" width="${W - P * 2}" height="52" fill="${c.accent}"/>`;
      s += mono(`→ Salve · Compartilhe · ${BRAND.handle}`, P + 22, ctaY + 12, 15, "#080808");
      s += mono("FIM", W - P - 22, ctaY + 12, 15, "#080808", { anchor: "end" });
    } else {
      s += mono("→", W - P, H - c.bottom - P - 92, 28, c.accent, { anchor: "end" });
    }
  }
  s += mono(`${pad2(i + 1)} / ${pad2(N)}`, W / 2, c.top + P + 12, 15, c.ink, { anchor: "middle", opacity: 0.85 });
  s += `</g>`;
  s += chrome(c);
  return s;
}

/* ───────────────────────────── public API ───────────────────────────────── */

export function slideCount(post: Post) {
  return post.archetype === "carousel" ? (post.slides?.length ?? 1) : 1;
}

/**
 * Renders only the treated background image, sized to the post canvas.
 *
 * The video exporter composites in two layers: this one is rasterized once (it
 * never moves), and the animated foreground is rendered per frame with
 * `bgHref: null` so it stays transparent where the background shows through.
 */
export function renderBackgroundSVG(post: Post, format: Format, bgHref: string): string {
  const { w: W, h: H } = FORMATS[format];
  const uid = `p${post.id}${format[0]}bg`;
  const paper = post.theme === "paper" && post.archetype === "minimal";
  const treatment = post.background.type === "photo" ? post.background.treatment : undefined;
  const filter = treatment ? ` filter="url(#${uid}-${treatment})"` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>${filters(uid)}</defs>
<rect width="${W}" height="${H}" fill="${paper ? BRAND.colors.paper : BRAND.colors.bg}"/>
<image xlink:href="${bgHref}" href="${bgHref}" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice"${filter}/>
</svg>`;
}

export function renderPostSVG(post: Post, opts: RenderOptions): string {
  const fmt = opts.format;
  const { w: W, h: H } = FORMATS[fmt];
  const story = fmt === "story";
  const slide = opts.slide ?? 0;
  const uid = `p${post.id}${fmt[0]}${slide}${opts.forExport ? "x" : ""}`;
  const paper = post.theme === "paper" && post.archetype === "minimal";
  const c: Ctx = {
    W,
    H,
    P: 72,
    top: story ? 210 : 0,
    bottom: story ? 250 : 0,
    uid,
    post,
    fmt,
    bg: opts.bgHref,
    animate: opts.animate ?? true,
    time: opts.timeSec ?? null,
    slide,
    ink: BRAND.colors.fg,
    dim: BRAND.colors.fgDim,
    mute: BRAND.colors.fgMute,
    accent: BRAND.colors.accent,
    line: BRAND.colors.lineStrong,
    surface: BRAND.colors.surface,
    paper,
    forExport: !!opts.forExport,
  };
  let body = "";
  switch (post.archetype) {
    case "brutalist":
      body = brutalist(c);
      break;
    case "kinetic":
      body = kinetic(c);
      break;
    case "split":
      body = split(c);
      break;
    case "stat":
      body = stat(c);
      break;
    case "minimal":
      body = minimal(c);
      break;
    case "carousel":
      body = carousel(c);
      break;
  }
  const fontStyle = opts.fontCss ? `<style type="text/css"><![CDATA[${opts.fontCss}]]></style>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" text-rendering="geometricPrecision" data-post="${post.id}" data-format="${fmt}" data-slide="${slide}">
<title>Desco — Post ${pad2(post.id)} — ${esc(plain(post.headline))}</title>
<desc>${esc(post.tag)} · ${fmt === "feed" ? "1050×1350" : "1050×1920"} · ${post.archetype}</desc>
<defs>${filters(uid)}</defs>${fontStyle}
${body}
</svg>`;
}
