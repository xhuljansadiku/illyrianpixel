"use client";

// Glob 2D-canvas (d3-geo, projeksion ortografik) — pa three.js dhe pa Mapbox.
// Rrotullohet vetë, tërhiqet me maus/gisht; vendet e klientëve në ar.
// variant "arcs": harqe drejt Tiranës (Hero). variant "pins": kunja si te "Standorte" (seksioni i lokacioneve).
// focus: kur jepet, globi kthehet butësisht drejt atij vendi dhe e thekson.
import { useEffect, useRef } from "react";
import { geoDistance, geoGraticule10, geoInterpolate, geoOrthographic, geoPath, type GeoPermissibleObjects } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { Locale } from "@/i18n/routing";
import { useReducedMotion } from "@/lib/gsap";
import { CLIENT_CITIES, CLIENT_HQ, CLIENT_COUNTRY_NAMES, type ClientCity } from "@/lib/clientLocations";

const GOLD = "#eace71";
const ACCENT = "#ab8339";

export type GlobeFocus = { country: string; lat: number; lon: number } | null;

type Props = {
  locale: Locale;
  variant?: "arcs" | "pins";
  focus?: GlobeFocus;
  /** Qendra fillestare [lon, lat] */
  start?: [number, number];
  /** Në vend të rrotullimit të plotë, lëkundet rreth `start` */
  sway?: boolean;
};

export default function ClientGlobe({ locale, variant = "arcs", focus = null, start = [-30, 38], sway = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();
  const focusRef = useRef<GlobeFocus>(focus);
  focusRef.current = focus;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let cancelled = false;
    // Performanca (2026-10-20): cikli vizaton vetëm kur globi është në ekran dhe tab-i aktiv —
    // më parë vizatonte 60×/s gjithë kohën dhe zinte ~7.5s CPU në Lighthouse mobile.
    let running = false;
    let inView = false;
    let dataRequested = false;
    let lastFrame = 0;
    // Celular: ~30 fps dhe pa hije te kunjat (shadowBlur është i shtrenjtë)
    const lite = window.matchMedia("(pointer: coarse), (max-width: 767px)").matches;
    let countries: Feature<Geometry, { name: string }>[] = [];
    // rotate() i d3 pret [-lon, -lat] të qendrës
    const rotation: [number, number] = [-start[0], -start[1]];
    let dragging = false;
    let hovering = false;
    let last: [number, number] | null = null;

    const projection = geoOrthographic().clipAngle(90).precision(0.6);
    const path = geoPath(projection, ctx);
    const graticule = geoGraticule10();
    const hq: [number, number] = [CLIENT_HQ.lon, CLIENT_HQ.lat];
    const arcs = CLIENT_CITIES.map((c) => {
      const interp = geoInterpolate([c.lon, c.lat], hq);
      return { type: "LineString", coordinates: Array.from({ length: 49 }, (_, i) => interp(i / 48)) } as GeoPermissibleObjects;
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      projection.scale(Math.min(rect.width, rect.height) / 2 - 14).translate([rect.width / 2, rect.height / 2]);
      // Ndryshimi i madhësisë e fshin canvas-in — rivizato nëse cikli është në pauzë
      if (!running && countries.length > 0) draw(performance.now());
    };

    const centerLonLat = () => projection.invert?.([canvas.clientWidth / 2, canvas.clientHeight / 2]) ?? null;
    const visible = (lon: number, lat: number, center: [number, number] | null) =>
      center ? geoDistance([lon, lat], center) < Math.PI / 2 - 0.05 : false;

    const drawPin = (x: number, y: number, isHq: boolean, active: boolean) => {
      const s = isHq ? 1.25 : active ? 1.15 : 1;
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(s, s);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-2, -5, -8, -9, -8, -15);
      ctx.arc(0, -15, 8, Math.PI, 0);
      ctx.bezierCurveTo(8, -9, 2, -5, 0, 0);
      ctx.closePath();
      if (!lite) {
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 6;
      }
      ctx.fillStyle = isHq ? GOLD : ACCENT;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(0, -15, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#0b0a08";
      ctx.fill();
      ctx.restore();
    };

    const draw = (time: number) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      projection.rotate(rotation);
      const [cx, cy] = projection.translate();
      const r = projection.scale();
      const center = centerLonLat();
      const activeCountry = focusRef.current?.country ?? null;

      const glow = ctx.createRadialGradient(cx, cy, r * 0.9, cx, cy, r * 1.12);
      glow.addColorStop(0, "rgba(171,131,57,0.22)");
      glow.addColorStop(1, "rgba(171,131,57,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.12, 0, Math.PI * 2);
      ctx.fill();

      const sphere = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.35, r * 0.1, cx, cy, r);
      sphere.addColorStop(0, "#1f1a13");
      sphere.addColorStop(1, "#0b0a08");
      ctx.fillStyle = sphere;
      ctx.beginPath();
      path({ type: "Sphere" });
      ctx.fill();

      ctx.beginPath();
      path(graticule);
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 0.6;
      ctx.stroke();

      for (const f of countries) {
        const name = f.properties.name;
        const client = CLIENT_COUNTRY_NAMES.has(name);
        const active = name === activeCountry;
        ctx.beginPath();
        path(f);
        ctx.fillStyle = active ? "rgba(234,206,113,0.75)" : client ? "rgba(171,131,57,0.42)" : "rgba(255,255,255,0.07)";
        ctx.fill();
        ctx.strokeStyle = client ? "rgba(234,206,113,0.7)" : "rgba(255,255,255,0.16)";
        ctx.lineWidth = active ? 1.2 : client ? 0.8 : 0.5;
        ctx.stroke();
      }

      if (variant === "arcs") {
        ctx.setLineDash([6, 8]);
        ctx.lineDashOffset = -(time / 40) % 14;
        ctx.strokeStyle = "rgba(234,206,113,0.85)";
        ctx.lineWidth = 1.4;
        for (const a of arcs) {
          ctx.beginPath();
          path(a);
          ctx.stroke();
        }
        ctx.setLineDash([]);
      }

      const pulse = (time % 2000) / 2000;
      // Etiketat: Tirana e para, pastaj sipas renditjes; ato që përplasen me një të vendosur fshihen
      const placed: { x: number; y: number; w: number; h: number }[] = [];
      const all: ClientCity[] = [CLIENT_HQ, ...CLIENT_CITIES];
      for (const c of all) {
        if (!visible(c.lon, c.lat, center)) continue;
        const p = projection([c.lon, c.lat]);
        if (!p) continue;
        const isHq = c === CLIENT_HQ;
        const active = c.country === activeCountry;

        if (variant === "pins") {
          drawPin(p[0], p[1], isHq, active);
        } else {
          ctx.beginPath();
          ctx.arc(p[0], p[1], (isHq ? 5 : 3.5) + pulse * 10, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(171,131,57,${0.5 * (1 - pulse)})`;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(p[0], p[1], isHq ? 5 : 3, 0, Math.PI * 2);
          ctx.fillStyle = isHq ? ACCENT : GOLD;
          ctx.fill();
        }

        // Te kunjat etiketat dalin vetëm për HQ dhe vendin e zgjedhur (si te referenca — pa zhurmë)
        if (variant === "pins" && !isHq && !active) continue;
        ctx.font = isHq ? "bold 12px ui-monospace, monospace" : "11px ui-monospace, monospace";
        const label = isHq ? `${c[locale]} · HQ` : c[locale];
        const lw = ctx.measureText(label).width;
        const gap = variant === "pins" ? 11 : 7;
        // Pranë skajit të djathtë etiketa shkon majtas, që të mos pritet
        const lx = p[0] + gap + lw > w - 4 ? p[0] - gap - lw : p[0] + gap;
        const ly = p[1] - (variant === "pins" ? 14 : 6);
        const box = { x: lx, y: ly - 11, w: lw, h: 13 };
        const clash = placed.some((o) => box.x < o.x + o.w + 4 && box.x + box.w + 4 > o.x && box.y < o.y + o.h && box.y + box.h > o.y);
        if (clash) continue;
        placed.push(box);
        ctx.fillStyle = isHq ? GOLD : "rgba(255,255,255,0.9)";
        ctx.fillText(label, lx, ly);
      }
    };

    const tick = (time: number) => {
      if (cancelled || !running) return;
      raf = requestAnimationFrame(tick);
      if (lite && time - lastFrame < 32) return;
      // Hapi në "frame 60 fps" — me 30 fps globi lëviz me të njëjtën shpejtësi
      const step = Math.min(3, Math.max(1, (time - lastFrame) / 16.7));
      lastFrame = time;
      const f = focusRef.current;
      if (f && !dragging) {
        // Kthehu butësisht drejt vendit të zgjedhur (rruga më e shkurtër në gjatësi)
        const targetLon = -f.lon;
        const targetLat = -f.lat * 0.8;
        const d = ((targetLon - rotation[0] + 540) % 360) - 180;
        const k = reducedMotion ? 1 : Math.min(1, 0.06 * step);
        rotation[0] += d * k;
        rotation[1] += (targetLat - rotation[1]) * k;
      } else if (!dragging && !hovering && !reducedMotion) {
        if (sway) {
          // Lëkundje e butë mes Nju Jorkut dhe Europës — klientët mbeten gjithmonë në pamje
          const targetLon = -(start[0] + 32 * Math.sin(time / 9000));
          const d = ((targetLon - rotation[0] + 540) % 360) - 180;
          rotation[0] += d * 0.02 * step;
          rotation[1] += (-start[1] - rotation[1]) * 0.02 * step;
        } else {
          rotation[0] += 0.08 * step;
        }
      }
      draw(time);
    };

    const play = () => {
      if (running || cancelled) return;
      running = true;
      lastFrame = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const syncPlayback = () => (inView && !document.hidden ? play() : pause());

    const onDown = (e: PointerEvent) => {
      dragging = true;
      last = [e.clientX, e.clientY];
      canvas.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging || !last) return;
      const k = 75 / projection.scale();
      rotation[0] += (e.clientX - last[0]) * k;
      rotation[1] = Math.max(-75, Math.min(75, rotation[1] - (e.clientY - last[1]) * k));
      last = [e.clientX, e.clientY];
    };
    const onUp = () => {
      dragging = false;
      last = null;
    };
    const onEnter = () => (hovering = true);
    const onLeave = () => (hovering = false);

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("pointerenter", onEnter);
    canvas.addEventListener("pointerleave", onLeave);

    // Të dhënat e vendeve (~100 KB) ngarkohen në chunk më vete, vetëm kur globi afrohet në ekran
    const loadCountries = () => {
      if (dataRequested) return;
      dataRequested = true;
      import("world-atlas/countries-110m.json").then((mod) => {
        if (cancelled) return;
        const topo = (mod.default ?? mod) as unknown as Topology<{ countries: GeometryCollection<{ name: string }> }>;
        countries = (feature(topo, topo.objects.countries) as FeatureCollection<Geometry, { name: string }>).features;
        if (!running) draw(performance.now());
      });
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) loadCountries();
        syncPlayback();
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(canvas);
    document.addEventListener("visibilitychange", syncPlayback);

    return () => {
      cancelled = true;
      pause();
      io.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("pointerenter", onEnter);
      canvas.removeEventListener("pointerleave", onLeave);
    };
    // start është konstante për çdo përdorim; s'duam ta rinisim globin kur ndryshon focus
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, reducedMotion, variant, sway]);

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full cursor-grab touch-none active:cursor-grabbing"
      role="img"
      aria-label={
        locale === "en"
          ? "Globe with our clients' cities: New York, London, Cologne, Nuremberg, Straubing, Milan, Stockholm, Pristina and Tirana"
          : "Glob me qytetet e klientëve: Nju Jork, Londër, Këln, Nyrëmberg, Straubing, Milano, Stokholm, Prishtinë dhe Tiranë"
      }
    />
  );
}
