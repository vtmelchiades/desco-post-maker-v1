export type PillarId =
  | "manifesto"
  | "estrategia"
  | "identidade"
  | "campanha"
  | "conteudo"
  | "casos"
  | "interior";

export type Archetype =
  | "brutalist"
  | "kinetic"
  | "split"
  | "stat"
  | "minimal"
  | "carousel";

export type ShaderId = "liquid" | "mesh" | "grid" | "aurora";

export type Treatment = "mono" | "duotone" | "color";

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
