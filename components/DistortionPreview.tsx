"use client";

// Shader distortion për preview-n cursor-follow të projekteve (desktop only).
// Efekti: imazhi "shtrihet" lehtë sipas shpejtësisë së mouse-it (stretch + RGB shift)
// dhe ndërrimet mes projekteve bëhen me crossfade + zoom në WebGL.
//
// Dizajn i sigurt: canvas-i mbivendoset mbi <Image>-n ekzistues dhe bëhet i dukshëm
// vetëm kur tekstura është ngarkuar me sukses — çdo dështim (WebGL i padisponueshëm,
// CORS, imazh që mungon) bie në heshtje te fallback-u i thjeshtë me <Image>.

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTexA;
  uniform sampler2D uTexB;
  uniform float uProgress;
  uniform float uVelo;
  uniform vec2 uRes;
  uniform vec2 uImgA;
  uniform vec2 uImgB;

  // object-fit: cover në shader
  vec2 cover(vec2 uv, vec2 res, vec2 img) {
    float rs = res.x / res.y;
    float ri = img.x / img.y;
    vec2 newUv = uv;
    if (rs < ri) {
      float s = rs / ri;
      newUv.x = uv.x * s + (1.0 - s) * 0.5;
    } else {
      float s = ri / rs;
      newUv.y = uv.y * s + (1.0 - s) * 0.5;
    }
    return newUv;
  }

  vec4 rgbShift(sampler2D tex, vec2 uv, float amount) {
    return vec4(
      texture2D(tex, uv + vec2(amount, 0.0)).r,
      texture2D(tex, uv).g,
      texture2D(tex, uv - vec2(amount, 0.0)).b,
      1.0
    );
  }

  void main() {
    vec2 uv = vUv;

    // Stretch vertikal sipas shpejtësisë — më i fortë në qendër të imazhit
    float d = uVelo * 0.22;
    uv.y -= d * sin(uv.x * 3.14159) * (0.5 - abs(uv.y - 0.5));

    vec2 uvA = cover(uv, uRes, uImgA);
    vec2 uvB = cover(uv, uRes, uImgB);

    // Imazhi hyrës vjen me një zoom të lehtë që qetësohet
    uvB = (uvB - 0.5) * (1.0 - 0.10 * (1.0 - uProgress)) + 0.5;

    float shift = uVelo * 0.012;
    vec4 a = rgbShift(uTexA, uvA, shift);
    vec4 b = rgbShift(uTexB, uvB, shift);

    float p = smoothstep(0.0, 1.0, uProgress);
    gl_FragColor = mix(a, b, p);
  }
`;

type GLState = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.Camera;
  material: THREE.ShaderMaterial;
  hasFirst: boolean;
  veloTarget: number;
  raf: number;
};

export default function DistortionPreview({ src, active }: { src: string | null; active: boolean }) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const stateRef = useRef<GLState | null>(null);
  const activeRef = useRef(active);
  const [ready, setReady] = useState(false);

  activeRef.current = active;

  // Init një herë: renderer + skenë + plan me shader
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "low-power" });
    } catch {
      return; // WebGL i padisponueshëm — mbetet fallback-u me <Image>
    }
    renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    const blank = new THREE.DataTexture(new Uint8Array([13, 13, 12, 255]), 1, 1);
    blank.needsUpdate = true;

    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: {
        uTexA: { value: blank },
        uTexB: { value: blank },
        uProgress: { value: 1 },
        uVelo: { value: 0 },
        uRes: { value: new THREE.Vector2(320, 220) },
        uImgA: { value: new THREE.Vector2(1, 1) },
        uImgB: { value: new THREE.Vector2(1, 1) },
      },
    });

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

    const state: GLState = { renderer, scene, camera, material, hasFirst: false, veloTarget: 0, raf: 0 };
    stateRef.current = state;

    const resize = () => {
      const w = mount.clientWidth || 320;
      const h = mount.clientHeight || 220;
      renderer.setSize(w, h, false);
      (material.uniforms.uRes.value as THREE.Vector2).set(w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    // Shpejtësia e mouse-it → intensiteti i distorsionit
    let lastX = 0;
    let lastY = 0;
    let lastT = performance.now();
    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      const dt = Math.max(8, now - lastT);
      const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      state.veloTarget = Math.min(1, (dist / dt) * 0.55);
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = now;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const tick = () => {
      state.raf = requestAnimationFrame(tick);
      const u = material.uniforms;
      state.veloTarget *= 0.92; // qetësim natyral kur mouse-i ndalon
      u.uVelo.value += (state.veloTarget - u.uVelo.value) * 0.12;
      u.uProgress.value += (1 - u.uProgress.value) * 0.09;
      if (activeRef.current || u.uProgress.value < 0.999) {
        renderer.render(scene, camera);
      }
    };
    tick();

    return () => {
      cancelAnimationFrame(state.raf);
      window.removeEventListener("pointermove", onMove);
      ro.disconnect();
      material.dispose();
      blank.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
      stateRef.current = null;
    };
  }, []);

  // Në çdo ndërrim imazhi: ngarko teksturën dhe nis crossfade-in
  useEffect(() => {
    if (!src) return;
    const state = stateRef.current;
    if (!state) return;

    let disposed = false;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    loader.load(
      src,
      (tex) => {
        if (disposed || !stateRef.current) {
          tex.dispose();
          return;
        }
        tex.colorSpace = THREE.SRGBColorSpace;
        const u = stateRef.current.material.uniforms;
        const img = tex.image as { width?: number; height?: number };
        const w = img?.width || 1;
        const h = img?.height || 1;
        if (!stateRef.current.hasFirst) {
          u.uTexA.value = tex;
          u.uTexB.value = tex;
          (u.uImgA.value as THREE.Vector2).set(w, h);
          (u.uImgB.value as THREE.Vector2).set(w, h);
          u.uProgress.value = 1;
          stateRef.current.hasFirst = true;
        } else {
          u.uTexA.value = u.uTexB.value;
          (u.uImgA.value as THREE.Vector2).copy(u.uImgB.value as THREE.Vector2);
          u.uTexB.value = tex;
          (u.uImgB.value as THREE.Vector2).set(w, h);
          u.uProgress.value = 0;
        }
        setReady(true);
      },
      undefined,
      () => {
        // Gabim ngarkimi (CORS/404) — canvas-i mbetet i fshehur, <Image> e mbulon
      }
    );
    return () => {
      disposed = true;
    };
  }, [src]);

  return (
    <div
      ref={mountRef}
      aria-hidden
      className={`absolute inset-0 z-[1] transition-opacity duration-200 ${ready ? "opacity-100" : "opacity-0"}`}
    />
  );
}
