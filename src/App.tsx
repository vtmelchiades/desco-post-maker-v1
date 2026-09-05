import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, Layers, Package, Play, Pause, Zap, Image as ImageIcon, Grid3X3 } from "lucide-react";
import ThreeBackground from "./components/ThreeBackground";
import PostCard from "./components/PostCard";
import PostModal from "./components/PostModal";
import { ARCHETYPES, BRAND, PILLARS } from "./data/brand";
import { POST_COUNT, postsData } from "./data/posts";
import type { Archetype, Format, PillarId } from "./data/types";
import { normalizeUpload } from "./engine/assets";
import { exportMasterZip, exportPillarZip, type ExportProgress, type ExportSettings, type Overrides } from "./engine/exporter";
import { clearMeasureCache } from "./engine/svg";

type PillarFilter = "all" | PillarId;
type ArchFilter = "all" | Archetype;

export default function App() {
  const [format, setFormat] = useState<Format>("feed");
  const [pillar, setPillar] = useState<PillarFilter>("all");
  const [arch, setArch] = useState<ArchFilter>("all");
  const [motion, setMotion] = useState(true);
  const [scale, setScale] = useState<1 | 2 | 3>(2);
  const [overrides, setOverrides] = useState<Overrides>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [progress, setProgress] = useState<ExportProgress | null>(null);
  const [busy, setBusy] = useState(false);
  const [fontsTick, setFontsTick] = useState(0);

  // re-measure text once the brand web fonts are available
  useEffect(() => {
    let alive = true;
    const bump = () => {
      if (!alive) return;
      clearMeasureCache();
      setFontsTick((t) => t + 1);
    };
    const loaded = (family: string, style: string) =>
      Array.from(document.fonts ?? []).some(
        (f) => f.family.replace(/["']/g, "") === family && f.style === style && f.status === "loaded"
      );
    const allLoaded = () =>
      loaded("Instrument Serif", "normal") && loaded("Instrument Serif", "italic") && loaded("JetBrains Mono", "normal");
    let ticks = 0;
    const poll = setInterval(() => {
      ticks += 1;
      if (allLoaded() || ticks > 60) {
        clearInterval(poll);
        bump();
      }
    }, 400);
    const onDone = () => bump();
    if (document.fonts) {
      document.fonts.addEventListener("loadingdone", onDone);
      Promise.all([
        document.fonts.load("400 40px 'Instrument Serif'"),
        document.fonts.load("italic 400 40px 'Instrument Serif'"),
        document.fonts.load("400 16px 'JetBrains Mono'"),
      ])
        .then(bump)
        .catch(bump);
    }
    return () => {
      alive = false;
      clearInterval(poll);
      document.fonts?.removeEventListener("loadingdone", onDone);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = selected !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  const filtered = useMemo(
    () => postsData.filter((p) => (pillar === "all" || p.pillar === pillar) && (arch === "all" || p.archetype === arch)),
    [pillar, arch]
  );

  const counts = useMemo(() => {
    const byPillar: Record<string, number> = {};
    const byArch: Record<string, number> = {};
    postsData.forEach((p) => {
      byPillar[p.pillar] = (byPillar[p.pillar] ?? 0) + 1;
      byArch[p.archetype] = (byArch[p.archetype] ?? 0) + 1;
    });
    return { byPillar, byArch };
  }, []);

  const shaderCount = postsData.filter((p) => p.background.type === "shader").length;

  const settings: ExportSettings = useMemo(
    () => ({ scale, overrides, onProgress: setProgress }),
    [scale, overrides]
  );

  const handleUpload = useCallback(async (id: number, file: File) => {
    try {
      const dataUrl = await normalizeUpload(file);
      setOverrides((o) => ({ ...o, [id]: dataUrl }));
    } catch (err) {
      console.error(err);
      alert("Não foi possível ler a imagem.");
    }
  }, []);

  const resetUpload = useCallback((id: number) => {
    setOverrides((o) => {
      const next = { ...o };
      delete next[id];
      return next;
    });
  }, []);

  const runExport = async (fn: () => Promise<void>) => {
    if (busy) return;
    setBusy(true);
    setProgress({ label: "Preparando fontes e imagens…", done: 0, total: 1 });
    try {
      await fn();
    } catch (err) {
      console.error(err);
      alert(`Falha na exportação: ${(err as Error).message}`);
    } finally {
      setBusy(false);
      setTimeout(() => setProgress(null), 1800);
    }
  };

  const selectedPost = selected !== null ? postsData.find((p) => p.id === selected) ?? null : null;
  const selectedIndex = selectedPost ? filtered.findIndex((p) => p.id === selectedPost.id) : -1;
  const goPrev = useCallback(() => {
    if (selectedIndex < 0) return;
    const list = filtered.length ? filtered : postsData;
    const i = (selectedIndex - 1 + list.length) % list.length;
    setSelected(list[i].id);
  }, [filtered, selectedIndex]);
  const goNext = useCallback(() => {
    if (selectedIndex < 0) return;
    const list = filtered.length ? filtered : postsData;
    const i = (selectedIndex + 1) % list.length;
    setSelected(list[i].id);
  }, [filtered, selectedIndex]);

  const pct = progress ? Math.round((progress.done / Math.max(1, progress.total)) * 100) : 0;

  return (
    <div className="app">
      <ThreeBackground />
      <div className="grain" aria-hidden="true" />

      <header className="topbar">
        <div className="topbar__brand">
          <span className="dot" />
          <span className="display-mark">Desco</span>
          <span className="mono-label dim">/ Post Engine</span>
        </div>
        <div className="topbar__center mono-label dim">
          <span>{POST_COUNT} posts</span>
          <span>·</span>
          <span>{PILLARS.length} pilares</span>
          <span>·</span>
          <span>{ARCHETYPES.length} arquétipos</span>
          <span>·</span>
          <span>{shaderCount} WebGL / {POST_COUNT - shaderCount} foto</span>
        </div>
        <div className="topbar__actions">
          <div className="seg">
            <button className={format === "feed" ? "is-on" : ""} onClick={() => setFormat("feed")}>
              Feed 4:5
            </button>
            <button className={format === "story" ? "is-on" : ""} onClick={() => setFormat("story")}>
              Story 9:16
            </button>
          </div>
          <div className="seg" title="Escala do PNG exportado">
            {([1, 2, 3] as const).map((s) => (
              <button key={s} className={scale === s ? "is-on" : ""} onClick={() => setScale(s)}>
                {s}x
              </button>
            ))}
          </div>
          <button className="btn btn--ghost" onClick={() => setMotion((m) => !m)} title="Ligar/desligar animações no grid">
            {motion ? <Pause size={13} /> : <Play size={13} />}
            Motion
          </button>
          <button className="btn btn--accent" disabled={busy} onClick={() => runExport(() => exportMasterZip(postsData, settings))}>
            <Package size={13} /> Master ZIP · {POST_COUNT} posts
          </button>
        </div>
      </header>

      <section className="hero">
        <div className="hero__left">
          <p className="mono-label accent">Diagnóstico do ecossistema · desco-teste.vercel.app</p>
          <h1 className="hero__title">
            Marcas não precisam de mais barulho. <em>Precisam de um ponto de vista.</em>
          </h1>
          <p className="hero__lead">
            Sistema generativo de {POST_COUNT} publicações calibrado na identidade da Desco — {BRAND.tagline.toLowerCase()}, {BRAND.city}, {BRAND.est}.
            Clique em qualquer post para editar, trocar o fundo por upload, navegar lâminas e exportar SVG editável no Illustrator, PNG e ZIP.
          </p>
        </div>
        <div className="hero__right">
          <div className="diag">
            <div className="diag__row">
              <span className="diag__k">Paleta</span>
              <span className="diag__v swatches">
                {[BRAND.colors.bg, BRAND.colors.surface, BRAND.colors.fg, BRAND.colors.accent].map((c) => (
                  <span key={c} className="swatch" style={{ background: c }} title={c}>
                    <i>{c}</i>
                  </span>
                ))}
              </span>
            </div>
            <div className="diag__row">
              <span className="diag__k">Tipografia</span>
              <span className="diag__v">
                <span className="font-display-sample">Instrument Serif <em>italic</em></span>
                <span className="mono-label">JetBrains Mono 300/400</span>
              </span>
            </div>
            <div className="diag__row">
              <span className="diag__k">KV</span>
              <span className="diag__v mono-small dim">
                Dark industrial · grain analógico · WebGL com aberração cromática · marquee · cursor custom · fotografia dessaturada com contraste alto
              </span>
            </div>
            <div className="diag__row">
              <span className="diag__k">Tom de voz</span>
              <span className="diag__v mono-small dim">
                Sentenças curtas, afirmativas e provocadoras. Tese antes da estética. Recusa como posicionamento. Interior não é periferia.
              </span>
            </div>
            <div className="diag__row">
              <span className="diag__k">Pilares</span>
              <span className="diag__v mono-small dim">
                Manifesto · Estratégia & Posicionamento · Identidade & Design · Campanha & Filme · Tom de Voz & Conteúdo · Casos · Interior & Cultura
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="filters">
        <div className="filters__row">
          <span className="filters__label mono-label dim">
            <Layers size={12} /> Pilar
          </span>
          <div className="filters__chips">
            <button className={`chipbtn ${pillar === "all" ? "is-on" : ""}`} onClick={() => setPillar("all")}>
              Todos <b>{POST_COUNT}</b>
            </button>
            {PILLARS.map((p) => (
              <button key={p.id} className={`chipbtn ${pillar === p.id ? "is-on" : ""}`} onClick={() => setPillar(p.id)} title={p.description}>
                <span className="accent">{p.code}</span> {p.short} <b>{counts.byPillar[p.id]}</b>
              </button>
            ))}
          </div>
          {pillar !== "all" && (
            <button className="btn" disabled={busy} onClick={() => runExport(() => exportPillarZip(pillar, postsData, settings))}>
              <Download size={13} /> Baixar pilar ({counts.byPillar[pillar]})
            </button>
          )}
        </div>
        <div className="filters__row">
          <span className="filters__label mono-label dim">
            <Grid3X3 size={12} /> Arquétipo
          </span>
          <div className="filters__chips">
            <button className={`chipbtn ${arch === "all" ? "is-on" : ""}`} onClick={() => setArch("all")}>
              Todos
            </button>
            {ARCHETYPES.map((a) => (
              <button key={a.id} className={`chipbtn ${arch === a.id ? "is-on" : ""}`} onClick={() => setArch(a.id)} title={a.description}>
                {a.label} <b>{counts.byArch[a.id]}</b>
              </button>
            ))}
          </div>
          <span className="mono-label dim hidden lg:inline-flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <Zap size={11} /> {shaderCount} shader
            </span>
            <span className="inline-flex items-center gap-1">
              <ImageIcon size={11} /> {POST_COUNT - shaderCount} foto
            </span>
          </span>
        </div>
      </section>

      <main className="grid-wrap">
        <div className="grid-head">
          <span className="mono-label dim">
            {filtered.length} {filtered.length === 1 ? "post" : "posts"} · {format === "feed" ? "1050×1350" : "1050×1920"}
          </span>
          <span className="mono-label dim">Arraste uma imagem sobre qualquer card para substituir o fundo</span>
        </div>
        <div className={`post-grid ${format === "story" ? "post-grid--story" : ""}`}>
          {filtered.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              format={format}
              override={overrides[p.id]}
              motion={motion}
              fontsTick={fontsTick}
              onOpen={setSelected}
              onUpload={handleUpload}
            />
          ))}
        </div>
      </main>

      <footer className="foot">
        <div className="mono-label dim">
          {BRAND.name} — {BRAND.tagline} · {BRAND.city} · {BRAND.coords} · {BRAND.est}
        </div>
        <div className="mono-label dim">
          Matriz por pilar:{" "}
          {PILLARS.map((p) => `${p.code} ${p.short} (${counts.byPillar[p.id]})`).join(" · ")}
        </div>
      </footer>

      {selectedPost && (
        <PostModal
          post={selectedPost}
          format={format}
          override={overrides[selectedPost.id]}
          scale={scale}
          fontsTick={fontsTick}
          busy={busy}
          onClose={() => setSelected(null)}
          onFormat={setFormat}
          onUpload={handleUpload}
          onResetUpload={resetUpload}
          onPrev={goPrev}
          onNext={goNext}
          settings={settings}
        />
      )}

      {progress && (
        <div className="toast" role="status">
          <div className="toast__row">
            <span className="mono-label accent">
              <Download size={12} /> Exportando
            </span>
            <span className="mono-label dim">
              {progress.done}/{progress.total} · {pct}%
            </span>
          </div>
          <div className="toast__bar">
            <i style={{ width: `${pct}%` }} />
          </div>
          <div className="mono-small dim truncate">{progress.label}</div>
        </div>
      )}
    </div>
  );
}
