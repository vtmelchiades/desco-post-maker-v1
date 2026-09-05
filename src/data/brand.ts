import type { ArchetypeInfo, Pillar } from "./types";

/**
 * Diagnóstico do ecossistema Desco (desco-teste.vercel.app)
 * — extraído diretamente do CSS/JS do site-alvo.
 */
export const BRAND = {
  name: "Desco",
  tagline: "Laboratório de estratégia, design e ruptura visual",
  manifesto:
    "Marcas não precisam de mais barulho. Precisam de um ponto de vista.",
  city: "Bauru/SP",
  coords: "22°19'S 49°04'W",
  est: "Est. 2015",
  handle: "@desco.lab",
  site: "desco.com.br",
  colors: {
    bg: "#080808",
    surface: "#121212",
    surface2: "#181818",
    fg: "#ecece6",
    fgDim: "rgba(236,236,230,0.55)",
    fgMute: "rgba(236,236,230,0.32)",
    accent: "#d4ff00",
    accentDim: "rgba(212,255,0,0.16)",
    line: "rgba(255,255,255,0.10)",
    lineStrong: "rgba(255,255,255,0.22)",
    paper: "#ecece6",
    ink: "#080808",
  },
  fonts: {
    display: "'Instrument Serif', 'Times New Roman', Georgia, serif",
    mono: "'JetBrains Mono', 'SFMono-Regular', Menlo, Consolas, monospace",
  },
};

export const PILLARS: Pillar[] = [
  {
    id: "manifesto",
    code: "01",
    label: "Manifesto & Ponto de Vista",
    short: "Manifesto",
    description:
      "As quatro regras que valem mais que qualquer processo desenhado em slide.",
  },
  {
    id: "estrategia",
    code: "02",
    label: "Estratégia & Posicionamento",
    short: "Estratégia",
    description: "Diagnóstico · Plataforma · Arquitetura de marca.",
  },
  {
    id: "identidade",
    code: "03",
    label: "Identidade & Design",
    short: "Identidade",
    description: "Identidade · Sistemas · Embalagem.",
  },
  {
    id: "campanha",
    code: "04",
    label: "Campanha & Filme",
    short: "Campanha",
    description: "Criação · Direção · Produção.",
  },
  {
    id: "conteudo",
    code: "05",
    label: "Tom de Voz & Conteúdo",
    short: "Conteúdo",
    description: "Tom de voz · Editorial · Comunidade.",
  },
  {
    id: "casos",
    code: "06",
    label: "Casos Selecionados",
    short: "Casos",
    description:
      "Tintas, alimentos, energia, futebol, educação e imobiliário. O mesmo critério.",
  },
  {
    id: "interior",
    code: "07",
    label: "Interior & Cultura Desco",
    short: "Interior",
    description: "Bauru por escolha. DescoCreators. Filosofia operacional.",
  },
];

export const ARCHETYPES: ArchetypeInfo[] = [
  {
    id: "brutalist",
    label: "Editorial Brutalist",
    description: "Títulos colossais, grid assimétrico, metadados mono.",
  },
  {
    id: "kinetic",
    label: "Motion & Kinetic",
    description: "Tipografia em loop contínuo e formas vetoriais em movimento.",
  },
  {
    id: "split",
    label: "Split-Screen / Case",
    description: "Corte geométrico entre fotografia e bloco de dados.",
  },
  {
    id: "stat",
    label: "Data Metric / Big Stat",
    description: "Número dramático como protagonista.",
  },
  {
    id: "minimal",
    label: "Minimal Poster",
    description: "Espaço negativo, moldura de precisão, tipografia refinada.",
  },
  {
    id: "carousel",
    label: "Carrossel Contínuo",
    description: "3–5 lâminas com continuidade panorâmica entre bordas.",
  },
];

export const FORMATS = {
  feed: { w: 1050, h: 1350, label: "Feed 4:5", file: "post_feed_1050x1350" },
  story: { w: 1050, h: 1920, label: "Story 9:16", file: "post_story_1050x1920" },
} as const;

export const pillarById = (id: string) =>
  PILLARS.find((p) => p.id === id) ?? PILLARS[0];

export const archetypeById = (id: string) =>
  ARCHETYPES.find((a) => a.id === id) ?? ARCHETYPES[0];

export const photoUrl = (id: number, w = 1600) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
