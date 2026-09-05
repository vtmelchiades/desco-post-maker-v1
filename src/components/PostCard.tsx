import { memo, useMemo, useState, type DragEvent } from "react";
import { Layers, Play, Upload, Zap, Image as ImageIcon } from "lucide-react";
import { archetypeById, FORMATS, photoUrl, pillarById } from "../data/brand";
import type { Format, Post } from "../data/types";
import { shaderSnapshot } from "../engine/shaders";
import { renderPostSVG, slideCount } from "../engine/svg";

interface Props {
  post: Post;
  format: Format;
  override?: string;
  motion: boolean;
  fontsTick: number;
  onOpen: (id: number) => void;
  onUpload: (id: number, file: File) => void;
}

const pad2 = (n: number) => String(n).padStart(2, "0");

function PostCard({ post, format, override, motion, fontsTick, onOpen, onUpload }: Props) {
  const [dragging, setDragging] = useState(false);
  const { w, h } = FORMATS[format];
  const n = slideCount(post);

  const bgHref = useMemo(() => {
    if (override) return override;
    const bg = post.background;
    if (bg.type === "photo") return photoUrl(bg.id, post.archetype === "carousel" ? 1200 : 900);
    return shaderSnapshot(bg.shader, Math.round(w / 2), Math.round(h / 2), bg.seed, 0, n);
  }, [override, post, w, h, n]);

  const svg = useMemo(
    () => renderPostSVG(post, { format, slide: 0, bgHref, animate: motion }),
    // fontsTick forces re-measure once webfonts are loaded
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [post, format, bgHref, motion, fontsTick]
  );

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) onUpload(post.id, file);
  };

  const pillar = pillarById(post.pillar);
  const arch = archetypeById(post.archetype);

  return (
    <article
      className={`post-card ${dragging ? "is-dragging" : ""}`}
      onClick={() => onOpen(post.id)}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onOpen(post.id);
      }}
      aria-label={`Abrir post ${pad2(post.id)}`}
    >
      <div className="post-card__frame" style={{ aspectRatio: `${w} / ${h}` }}>
        <div className="post-card__svg" dangerouslySetInnerHTML={{ __html: svg }} />
        <div className="post-card__hover">
          <div className="post-card__hover-top">
            <span className="chip chip--accent">{arch.label}</span>
            {n > 1 && (
              <span className="chip">
                <Layers size={11} /> {n} lâminas
              </span>
            )}
            {post.archetype === "kinetic" && (
              <span className="chip">
                <Play size={11} /> loop
              </span>
            )}
            {post.background.type === "shader" ? (
              <span className="chip">
                <Zap size={11} /> WebGL
              </span>
            ) : (
              <span className="chip">
                <ImageIcon size={11} /> foto
              </span>
            )}
            {override && <span className="chip chip--accent">upload</span>}
          </div>
          <div className="post-card__hover-bottom">
            <span className="mono-label">Abrir / editar →</span>
            <span className="mono-label dim">
              <Upload size={11} /> arraste uma imagem
            </span>
          </div>
        </div>
        {dragging && (
          <div className="post-card__drop">
            <Upload size={22} />
            <span>Soltar para substituir o fundo</span>
          </div>
        )}
      </div>
      <footer className="post-card__meta">
        <span className="mono-label">N°{pad2(post.id)}</span>
        <span className="mono-label dim truncate">{pillar.short}</span>
        <span className="mono-label dim">{format === "feed" ? "4:5" : "9:16"}</span>
      </footer>
    </article>
  );
}

export default memo(PostCard);
