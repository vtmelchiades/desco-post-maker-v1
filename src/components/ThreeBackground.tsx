import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Subtle point-field that reacts to the cursor with physical inertia
 * (spring + damping on a virtual "probe" that displaces the mesh).
 */
export default function ThreeBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, host.clientWidth / host.clientHeight, 0.1, 100);
    camera.position.set(0, 7.5, 13);
    camera.lookAt(0, 0, 0);

    const cols = 110;
    const rows = 60;
    const spacing = 0.34;
    const count = cols * rows;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const base = new Float32Array(count * 2);
    const fg = new THREE.Color("#ecece6");
    const accent = new THREE.Color("#d4ff00");
    let i = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = (c - cols / 2) * spacing;
        const z = (r - rows / 2) * spacing;
        positions[i * 3] = x;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = z;
        base[i * 2] = x;
        base[i * 2 + 1] = z;
        const isAccent = (c * 7 + r * 13) % 41 === 0;
        const col = isAccent ? accent : fg;
        colors[i * 3] = col.r;
        colors[i * 3 + 1] = col.g;
        colors[i * 3 + 2] = col.b;
        i++;
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.035,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    // physics probe with inertia
    const target = new THREE.Vector2(0, 0);
    const probe = new THREE.Vector2(0, 0);
    const vel = new THREE.Vector2(0, 0);
    let energy = 0;
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const ndc = new THREE.Vector2();
    const hit = new THREE.Vector3();

    const onPointer = (clientX: number, clientY: number) => {
      const rect = host.getBoundingClientRect();
      ndc.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
      raycaster.setFromCamera(ndc, camera);
      if (raycaster.ray.intersectPlane(plane, hit)) target.set(hit.x, hit.z);
    };
    const onMove = (e: PointerEvent) => onPointer(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      if (e.touches[0]) onPointer(e.touches[0].clientX, e.touches[0].clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });

    const onResize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let raf = 0;
    let running = true;
    const onVisibility = () => {
      running = document.visibilityState === "visible";
      if (running) loop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const pos = geo.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;

    const loop = () => {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      const t = clock.getElapsedTime();
      // spring towards target, damped
      const ax = (target.x - probe.x) * 0.09;
      const ay = (target.y - probe.y) * 0.09;
      vel.x = (vel.x + ax) * 0.82;
      vel.y = (vel.y + ay) * 0.82;
      probe.x += vel.x;
      probe.y += vel.y;
      const speed = Math.min(1.6, vel.length() * 6);
      energy += (speed - energy) * 0.06;
      for (let k = 0; k < count; k++) {
        const bx = base[k * 2];
        const bz = base[k * 2 + 1];
        const wave = Math.sin(bx * 0.55 + t * 0.6) * Math.cos(bz * 0.7 - t * 0.45) * 0.28;
        const dx = bx - probe.x;
        const dz = bz - probe.y;
        const d2 = dx * dx + dz * dz;
        const bump = Math.exp(-d2 / 3.2) * (0.5 + energy * 1.4);
        arr[k * 3 + 1] = wave + bump;
      }
      pos.needsUpdate = true;
      points.rotation.y = Math.sin(t * 0.05) * 0.08;
      camera.position.x += (probe.x * 0.06 - camera.position.x) * 0.02;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      running = false;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={ref} className="gl-bg" aria-hidden="true" />;
}
