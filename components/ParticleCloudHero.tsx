"use client";

import { useRef, useMemo, useEffect, useState, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import Link from "next/link";
import { useReducedMotion } from "@/lib/gsap";

const SERVICES = ["Website", "E-Commerce", "SEO", "Google Ads", "Branding", "Social Media"];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
}

// Soft radial-gradient sprite so points/glow render as discs instead of hard squares.
function useDiscTexture() {
  return useMemo(() => {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.4, "rgba(255,255,255,0.7)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);
}

function ParticleDust() {
  const groupRef = useRef<THREE.Group>(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const isMobile = useIsMobile();
  const discTexture = useDiscTexture();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.current = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY.current = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const { positions, colors } = useMemo(() => {
    const particleCount = isMobile ? 220 : 550;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorAccent = new THREE.Color("#ab8339");
    const colorAccentLight = new THREE.Color("#eace71");
    const colorWhite = new THREE.Color("#ffffff");

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const radius = 4.5 + Math.random() * 4;

      positions[i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
      positions[i * 3 + 1] = Math.cos(phi) * radius * 0.6;
      positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius - 2;

      const colorChoice = Math.random();
      const color =
        colorChoice < 0.45
          ? colorAccent.clone().lerp(colorAccentLight, Math.random())
          : colorWhite.clone().lerp(colorAccent, Math.random() * 0.3);

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return { positions, colors };
  }, [isMobile]);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.00012;
    groupRef.current.rotation.y += (mouseX.current * 0.12 - groupRef.current.rotation.y) * 0.04;
    groupRef.current.rotation.x += (mouseY.current * 0.08 - groupRef.current.rotation.x) * 0.04;
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={isMobile ? 0.16 : 0.13}
          map={discTexture}
          vertexColors
          sizeAttenuation
          transparent
          opacity={0.55}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

// Abstract faceted gold gem — reads as "premium/digital/precise" without a literal tech cliche.
function BrandGem() {
  const groupRef = useRef<THREE.Group>(null);
  const gemMeshRef = useRef<THREE.Mesh>(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const isMobile = useIsMobile();
  const haloTexture = useDiscTexture();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.current = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY.current = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y += 0.0028;
    groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.08;
    groupRef.current.rotation.y += (mouseX.current * 0.25 - groupRef.current.rotation.y * 0.02);
    groupRef.current.position.y = (isMobile ? -0.5 : 0.1) + Math.sin(t * 0.6) * 0.08;
  });

  const positionX = isMobile ? 0 : 2.6;
  const scale = isMobile ? 0.72 : 1;

  return (
    <group ref={groupRef} position={[positionX, isMobile ? -0.5 : 0.1, 0]} scale={scale}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} color="#fff3d6" />
      <pointLight position={[-3, -2, 4]} intensity={0.6} color="#ab8339" />
      {/* fill light facing the camera so the visible facets don't read dark/brown */}
      <pointLight position={[0, 0.5, 6]} intensity={0.9} color="#fff6df" />

      {/* soft halo behind the gem */}
      <sprite scale={[6.2, 6.2, 1]} position={[0, 0, -0.8]}>
        <spriteMaterial
          map={haloTexture}
          color="#e0aa3f"
          transparent
          opacity={0.48}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>

      <mesh ref={gemMeshRef}>
        <icosahedronGeometry args={[1.65, 0]} />
        <meshStandardMaterial
          color="#e8b84b"
          metalness={0.55}
          roughness={0.2}
          flatShading
          emissive="#c89b2e"
          emissiveIntensity={0.3}
        />
      </mesh>
      <mesh scale={1.012}>
        <icosahedronGeometry args={[1.65, 0]} />
        <meshBasicMaterial color="#f6e3a3" wireframe transparent opacity={0.5} />
      </mesh>

      <ServiceNodes occluder={gemMeshRef} isMobile={isMobile} />
    </group>
  );
}

// Small gold nodes orbiting the gem, each labelled with one of our services —
// ties the abstract visual back to "what we actually do" instead of pure decoration.
// Positions are hand-spread (not a flat equatorial ring) so labels never bunch up
// or overlap each other as the gem rotates, and they auto-occlude behind the gem mesh.
function ServiceNodes({ occluder, isMobile }: { occluder: RefObject<THREE.Mesh>; isMobile: boolean }) {
  const radius = isMobile ? 2.1 : 2.5;
  const heightOffsets = [0.75, -0.35, 0.55, -0.75, 0.3, -0.55];

  return (
    <>
      {SERVICES.map((label, i) => {
        const angle = (i / SERVICES.length) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = heightOffsets[i % heightOffsets.length];
        return (
          <group key={label} position={[x, y, z]}>
            <mesh>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshStandardMaterial color="#f6e3a3" emissive="#ab8339" emissiveIntensity={0.7} />
            </mesh>
            <Html center distanceFactor={isMobile ? 7.5 : 8.5} occlude={[occluder]} style={{ pointerEvents: "none" }}>
              <span className="whitespace-nowrap rounded-full border border-accent/40 bg-black/55 px-2 py-1 text-[9px] tracking-[0.06em] text-accent/90 backdrop-blur-sm md:px-2.5 md:py-1 md:text-[10px] md:tracking-[0.08em]">
                {label}
              </span>
            </Html>
          </group>
        );
      })}
    </>
  );
}

export default function ParticleCloudHero() {
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    import("gsap").then(({ default: gsap }) => {
      const headlineWords = headlineRef.current?.querySelectorAll(".headline-word");

      if (headlineWords?.length && !reducedMotion) {
        gsap.set(headlineWords, { yPercent: 105, opacity: 0, willChange: "transform, opacity" });
        gsap.to(headlineWords, {
          yPercent: 0,
          opacity: 1,
          duration: 1.05,
          stagger: 0.12,
          delay: 0.08,
          ease: "power4.out"
        });
      }

      if (!reducedMotion) {
        gsap.fromTo(
          badgeRef.current,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, delay: 0.18, ease: "power2.inOut" }
        );

        gsap.fromTo(
          paragraphRef.current,
          { y: 18, opacity: 0, filter: "blur(4px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.7, delay: 0.38, ease: "power2.inOut" }
        );

        gsap.fromTo(
          ".particle-hero-cta > *",
          { opacity: 0, y: 22, filter: "blur(6px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            stagger: 0.1,
            duration: 0.7,
            ease: "power2.inOut",
            delay: 0.5
          }
        );
      }
    });
  }, [mounted, reducedMotion]);

  return (
    <section
      id="hero"
      className="cinematic-section section-tone-hero relative overflow-hidden lg:min-h-screen"
    >
      <div className="hero-layout section-wrap relative z-10 grid items-center gap-12 lg:min-h-[100svh] lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div className="hero-copy space-y-7 text-center md:space-y-8 lg:pl-14 lg:text-left">
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2.5 rounded-full border border-accent/45 bg-accent/10 px-4 py-1.5 text-[11px] tracking-[0.22em] text-accent"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            ILLYRIAN PIXEL
          </div>

          <h1
            ref={headlineRef}
            className="hero-headline-trigger cadence-title font-display relative max-w-[18ch] text-[clamp(2.6rem,5.5vw,4.8rem)] font-bold leading-[1.14] md:leading-[1.04] tracking-[-0.015em] md:tracking-[-0.03em]"
          >
            <span className="headline-mask block overflow-hidden">
              <span className="headline-word block">
                Ktheje biznesin në{" "}
                <span className="hero-brand-word">
                  <span className="hero-brand-accent text-accent inline-block font-black uppercase">
                    brand.
                  </span>
                </span>
              </span>
            </span>
            <span className="sr-only"> Website, SEO dhe Marketing për biznese shqiptare</span>
          </h1>

          <div ref={paragraphRef} className="cadence-body space-y-4">
            <p className="font-body text-[1.05rem] font-light leading-[1.75] tracking-[0.01em] text-white/62">
              {"Ndërtojmë Website & E-Commerce moderne, dominojmë Google me SEO dhe rrisim shitjet përmes Reklamave, Social Media & Branding."}
            </p>
            <p className="font-body text-[0.9rem] font-medium tracking-[0.02em] text-accent/85 text-center lg:text-left">
              {"Plan konkret brenda 24 orëve, 100% pa pagesë."}
            </p>
            <p className="font-body text-[0.83rem] font-light tracking-[0.02em] text-white/38 text-center lg:text-left">
              {"Ju fokusohuni te biznesi. Klientët i sjellim ne."}
            </p>
          </div>

          <div ref={ctaRef} className="particle-hero-cta hero-cta-row justify-center lg:justify-start">
            <Link
              href="/contact"
              data-magnetic="true"
              className="interactive-button ip-cta-primary ip-cta-primary--lg"
            >
              Merr ofertë falas
            </Link>
            <a href="/projektet" data-magnetic="true" className="luxury-link">
              Shiko projektet <span aria-hidden>→</span>
            </a>
          </div>
        </div>

        {/* Right column is empty in the DOM on desktop — the gem renders inside the
            full-bleed Canvas behind everything, offset to sit visually in this area. */}
        <div className="hidden h-[460px] lg:block" aria-hidden />
      </div>

      {/* On mobile this is an in-flow block directly below the text (its own space,
          not a background). On desktop it pops out via lg:absolute to full-bleed behind everything. */}
      <div className="hero-visual relative z-0 h-[340px] w-full overflow-hidden lg:absolute lg:inset-0 lg:h-auto lg:w-auto lg:overflow-visible">
        {mounted && !reducedMotion ? (
          <Canvas
            camera={{ position: [0, 0, 9], fov: 42 }}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            style={{ background: "transparent" }}
          >
            <ParticleDust />
            <BrandGem />
          </Canvas>
        ) : (
          <div className="hero-grid absolute inset-0 opacity-80" />
        )}
        <div className="pointer-events-none absolute inset-0 z-[1] hero-depth-vignette" aria-hidden />
      </div>

      <div className="hero-scroll-cue" aria-hidden>
        <span>Zbulo më shumë</span>
        <span className="hero-scroll-cue-chevron" />
      </div>
    </section>
  );
}
