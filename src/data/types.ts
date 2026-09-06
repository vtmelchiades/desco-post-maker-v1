export type PillarId =
  | "manifesto"
  | "estrategia"
  | "identidade"
  | "campanha"
  | "conteudo"
  | "casos"
  | "interior"
  | "decada"
  | "laboratorio";

export type Archetype =
  | "brutalist"
  | "kinetic"
  | "split"
  | "stat"
  | "minimal"
  | "carousel";

export type ShaderId =
  | "liquid"
  | "mesh"
  | "grid"
  | "aurora"
  | "chrome"
  | "inflate"
  | "warp"
  | "curl"
  | "dither"
  | "halftone";

export type Treatment = "mono" | "duotone" | "color";

/**
 * `liquid` — turbulence-driven displacement, type reads as poured glass.
 * `frost`  — coarser displacement plus a blur bleed, frosted-glass refraction.
 */
export type TypeEffect = "liquid" | "frost";

export type Format = "feed" | "story";

export interface PhotoBackground {
  type: "photo";
  /** Pexels/Unsplash photo id */
  id: number;
  treatment: Treatment;
  credit: string;
}

export interface ShaderBackground {
  type: "shader";
  shader: ShaderId;
  seed: number;
}

export type Background = PhotoBackground | ShaderBackground;

export interface Slide {
  kicker: string;
  headline: string;
  body: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Post {
  id: number;
  slug: string;
  pillar: PillarId;
  archetype: Archetype;
  theme: "dark" | "paper";
  tag: string;
  headline: string;
  subheadline: string;
  stat?: Stat;
  slides?: Slide[];
  meta: { client: string; discipline: string; year: string };
  /**
   * Show the city/coordinates/handle colophon. Left unset it falls to a default
   * that puts it on a minority of posts, so it stays a signature and not a
   * template footer.
   */
  colophon?: boolean;
  /**
   * Optional SVG filter applied to the headline group. Unlike a raster effect,
   * this leaves the `<text>` elements intact — the type stays live and editable
   * in the exported SVG, and the distortion travels with it.
   */
  effect?: TypeEffect;
  caption: string;
  imagePrompt: string;
  background: Background;
}

export interface Pillar {
  id: PillarId;
  code: string;
  label: string;
  short: string;
  description: string;
}

export interface ArchetypeInfo {
  id: Archetype;
  label: string;
  description: string;
}
