import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  FileCode2,
  FileText,
  Image as ImageIcon,
  Package,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { archetypeById, FORMATS, photoUrl, pillarById } from "../data/brand";
import type { Format, Post } from "../data/types";
import { ShaderRenderer, shaderSnapshot, SHADER_LABELS } from "../engine/shaders";
import { renderPostSVG, slideCount } from "../engine/svg";
import { captionFile, downloadPNG, downloadSVG, downloadText, exportPostZip, promptFile, type ExportSettings } from "../engine/exporter";

interface Props {
  post: Post;
  format: Format;
  override?: string;
  scale: 1 | 2 | 3;
  fontsTick: number;
  busy: boolean;
  onClose: () => void;
  onFormat: (f: Format) => void;
  onUpload: (id: number, file: File) => void;
  onResetUpload: (id: number) => void;
  onPrev: () => void;
  onNext: () => void;
  settings: ExportSettings;
}

const pad2 = (n: number) => String(n).padStart(2, "0");

export default function PostModal({
  post,
  format,
  override,
  scale,
  fontsTick,
  busy,
  onClose,
  onFormat,
  onUpload,
  onResetUpload,
  onPrev,
  onNext,
  settings,
}: Props) {
  const [slide, setSlide] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [tab, setTab] = useState<"legenda" | "prompt" | "dados">("legenda");
  const [dragging, setDragging] = useState(false);
  const [localBusy, setLocalBusy] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const n = slideCount(post);
  const { w, h } = FORMATS[format];

  useEffect(() => setSlide(0), [post.id]);

  const liveShader =
    !override &&
    post.background.type === "shader" &&
    post.archetype !== "minimal" &&
    post.archetype !== "split";

  const bgHref = useMemo(() => {
    if (override) return override;
    const bg = post.background;
    if (bg.type === "photo") return photoUrl(bg.id, post.archetype === "carousel" ? 2000 : 1400);
    if (liveShader) return null;
    return shaderSnapshot(bg.shader, Math.round(w / 2), Math.round(h / 2), bg.seed, slide, n);
  }, [override, post, liveShader, w, h, slide, n]);

  const svg = useMemo(
    () => renderPostSVG(post, { format, slide, bgHref, animate: playing }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [post, format, slide, bgHref, playing, fontsTick]
  );

  // live WebGL shader loop (single renderer per canvas mount; slide/play read from refs)
  const slideRef = useRef(slide);
  const playingRef = useRef(playing);
  slideRef.current = slide;
  playingRef.current = playing;
  const shaderKey = post.background.type === "shader" ? `${post.background.shader}-${post.background.seed}` : "";
  useEffect(() => {
    if (!liveShader || !canvasRef.current || post.background.type !== "shader") return;
    const bg = post.background;
    const renderer = new ShaderRenderer(canvasRef.current);
    let raf = 0;
    let t = 4.2;
    let last = performance.now();
    const cw = Math.round(w / 2);
    const ch = Math.round(h / 2);
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (playingRef.current) t += dt;
      renderer.render(bg.shader, cw, ch, t, bg.seed, slideRef.current, n);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveShader, shaderKey, w, h, n]);

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") {
        if (n > 1 && slide < n - 1) setSlide((s) => s + 1);
        else onNext();
      }
      if (e.key === "ArrowLeft") {
        if (n > 1 && slide > 0) setSlide((s) => s - 1);
        else onPrev();
      }
      if (e.key === " " && post.archetype === "kinetic") {
        e.preventDefault();
        setPlaying((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onNext, onPrev, n, slide, post.archetype]);

  const handleFile = useCallback(
    (file?: File | null) => {
      if (file && file.type.startsWith("image/")) onUpload(post.id, file);
    },
    [onUpload, post.id]
  );

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const run = async (label: string, fn: () => Promise<void>) => {
    if (busy || localBusy) return;
    setLocalBusy(label);
    try {
      await fn();
    } catch (err) {
      console.error(err);
      alert(`Falha ao exportar: ${(err as Error).message}`);
    } finally {
      setLocalBusy(null);
    }
  };

  const pillar = pillarById(post.pillar);
  const arch = archetypeById(post.archetype);
  const isBusy = busy || !!localBusy;

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={`Post ${pad2(post.id)}`}>
      <div className="modal__backdrop" onClick={onClose} />
      <div className="modal__panel">
        <header className="modal__head">
          <div className="flex items-center gap-4">
            <span className="mono-label accent">N°{pad2(post.id)} / 50</span>
            <span className="mono-label dim">{pillar.code} · {pillar.label}</span>
            <span className="chip chip--accent">{arch.label}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="icon-btn" onClick={onPrev} title="Post anterior (←)">
              <ChevronLeft size={16} />
            </button>
            <button className="icon-btn" onClick={onNext} title="Próximo post (→)">
              <ChevronRight size={16} />
            </button>
            <button className="icon-btn" onClick={onClose} title="Fechar (Esc)">
              <X size={16} />
            </button>
          </div>
        </header>

        <div className="modal__body">
          {/* preview */}
          <div className="modal__preview">
            <div
              className={`preview-stage ${dragging ? "is-dragging" : ""}`}
              style={{ aspectRatio: `${w} / ${h}` }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
            >
              {liveShader && <canvas ref={canvasRef} className="preview-stage__gl" />}
              <div className="preview-stage__svg" dangerouslySetInnerHTML={{ __html: svg }} />
              {dragging && (
                <div className="post-card__drop">
                  <Upload size={26} />
                  <span>Soltar para substituir o fundo</span>
                </div>
              )}
              {n > 1 && (
                <>
                  <button
                    className="stage-nav stage-nav--l"
                    disabled={slide === 0}
                    onClick={() => setSlide((s) => Math.max(0, s - 1))}
                    aria-label="Lâmina anterior"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    className="stage-nav stage-nav--r"
                    disabled={slide === n - 1}
                    onClick={() => setSlide((s) => Math.min(n - 1, s + 1))}
                    aria-label="Próxima lâmina"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>
            <div className="preview-toolbar">
              <div className="seg">
                <button className={format === "feed" ? "is-on" : ""} onClick={() => onFormat("feed")}>
                  Feed 1050×1350
                </button>
                <button className={format === "story" ? "is-on" : ""} onClick={() => onFormat("story")}>
                  Story 1050×1920
                </button>
              </div>
              {n > 1 && (
                <div className="dots" aria-label="Lâminas">
                  {Array.from({ length: n }, (_, i) => (
                    <button key={i} className={i === slide ? "is-on" : ""} onClick={() => setSlide(i)} aria-label={`Lâmina ${i + 1}`} />
                  ))}
                  <span className="mono-label dim ml-2">
                    {pad2(slide + 1)}/{pad2(n)}
                  </span>
                </div>
              )}
              {(post.archetype === "kinetic" || liveShader) && (
                <button className="btn btn--ghost" onClick={() => setPlaying((p) => !p)}>
                  {playing ? <Pause size={13} /> : <Play size={13} />}
                  {playing ? "Pausar loop" : "Reproduzir"}
                </button>
              )}
            </div>
          </div>

          {/* side panel */}
          <aside className="modal__side">
            <div className="side-block">
              <h3 className="display-h">{post.headline.replace(/\*/g, "")}</h3>
              <p className="mono-small dim">{post.subheadline}</p>
            </div>

            <div className="side-block">
              <div className="side-title">Fundo</div>
              <div className="mono-small dim mb-3">
                {override
                  ? "Imagem enviada pelo usuário (substitui o fundo original)."
                  : post.background.type === "photo"
                    ? `Fotografia · ${post.background.credit} · tratamento ${post.background.treatment}`
                    : `WebGL · ${SHADER_LABELS[post.background.shader]} · seed ${post.background.seed}`}
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="btn" onClick={() => fileRef.current?.click()}>
                  <Upload size={13} /> Enviar imagem
                </button>
                {override && (
                  <button className="btn btn--ghost" onClick={() => onResetUpload(post.id)}>
                    <RotateCcw size={13} /> Restaurar original
                  </button>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    handleFile(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </div>
            </div>

            <div className="side-block">
              <div className="side-title">Exportar</div>
              <div className="grid grid-cols-2 gap-2">
                <button className="btn btn--accent" disabled={isBusy} onClick={() => run("svg", () => downloadSVG(post, format, slide, settings))}>
                  <FileCode2 size={13} /> Exportar SVG (Illustrator)
                </button>
                <button className="btn" disabled={isBusy} onClick={() => run("png", () => downloadPNG(post, format, slide, settings))}>
                  <ImageIcon size={13} /> PNG {scale}x
                </button>
                <button className="btn" disabled={isBusy} onClick={() => run("zip", () => exportPostZip(post, settings))}>
                  <Package size={13} /> ZIP do post
                </button>
                <button className="btn btn--ghost" disabled={isBusy} onClick={() => downloadText(`${pad2(post.id)}_legenda.txt`, captionFile(post))}>
                  <FileText size={13} /> legenda.txt
                </button>
                <button className="btn btn--ghost" disabled={isBusy} onClick={() => downloadText(`${pad2(post.id)}_image_prompt.txt`, promptFile(post))}>
                  <Sparkles size={13} /> image_prompt.txt
                </button>
              </div>
              <p className="mono-small dim mt-3">
                ZIP: /feed/{FORMATS.feed.file}.png|svg · /story/{FORMATS.story.file}.png|svg · legenda.txt · image_prompt.txt
                {n > 1 ? ` · ${n} lâminas por formato` : ""}
              </p>
              {localBusy && (
                <p className="mono-small accent mt-2 flex items-center gap-2">
                  <Download size={12} /> Gerando {localBusy.toUpperCase()}…
                </p>
              )}
            </div>

            <div className="side-block side-block--grow">
              <div className="tabs">
                <button className={tab === "legenda" ? "is-on" : ""} onClick={() => setTab("legenda")}>
                  Legenda
                </button>
                <button className={tab === "prompt" ? "is-on" : ""} onClick={() => setTab("prompt")}>
                  Prompt
                </button>
                <button className={tab === "dados" ? "is-on" : ""} onClick={() => setTab("dados")}>
                  Dados
                </button>
              </div>
              <div className="tab-body">
                {tab === "legenda" && <pre>{post.caption}</pre>}
                {tab === "prompt" && <pre>{post.imagePrompt}</pre>}
                {tab === "dados" && (
                  <dl className="data-list">
                    <dt>ID</dt>
                    <dd>{pad2(post.id)} · {post.slug}</dd>
                    <dt>Pilar</dt>
                    <dd>{pillar.code} · {pillar.label}</dd>
                    <dt>Arquétipo</dt>
                    <dd>{arch.label}</dd>
                    <dt>Cliente</dt>
                    <dd>{post.meta.client}</dd>
                    <dt>Disciplina</dt>
                    <dd>{post.meta.discipline}</dd>
                    <dt>Ano</dt>
                    <dd>{post.meta.year}</dd>
                    <dt>Tema</dt>
                    <dd>{post.theme}</dd>
                    <dt>Formatos</dt>
                    <dd>1050×1350 · 1050×1920{n > 1 ? ` · ${n} lâminas` : ""}</dd>
                    {post.stat && (
                      <>
                        <dt>Stat</dt>
                        <dd>{post.stat.value} — {post.stat.label}</dd>
                      </>
                    )}
                  </dl>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
