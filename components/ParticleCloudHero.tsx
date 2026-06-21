"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Link from "next/link";
import { useReducedMotion } from "@/lib/gsap";

function ParticleCloud() {
  const mesh = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseMove = (e: MouseEvent) => {
    mouseX.current = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY.current = -(e.clientY / window.innerHeight) * 2 + 1;
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Generate particle positions forming an organic cloud shape
  const { positions, colors } = useMemo(() => {
    const particleCount = isMobile ? 2000 : 5000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Brand colors (accent gold + light gold + white)
    const colorAccent = new THREE.Color("#ab8339"); // Gold
    const colorAccentLight = new THREE.Color("#eace71"); // Light gold
    const colorWhite = new THREE.Color("#ffffff");

    for (let i = 0; i < particleCount; i++) {
      // Create organic cloud shape using noise-like distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const radius = 3 + Math.random() * 2.5;

      // Add some deformation to make it less perfect sphere
      const deform = Math.sin(theta * 3) * Math.cos(phi * 2) * 0.6;

      positions[i * 3] = Math.sin(phi) * Math.cos(theta) * (radius + deform);
      positions[i * 3 + 1] = Math.cos(phi) * (radius + deform * 0.5);
      positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * (radius + deform);

      // Color gradient: mostly gold/light-gold, some white for contrast
      const colorChoice = Math.random();
      let color;
      if (colorChoice < 0.5) {
        color = colorAccent.clone().lerp(colorAccentLight, Math.random());
      } else {
        color = colorWhite.clone().lerp(colorAccent, Math.random() * 0.4);
      }

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return { positions, colors };
  }, [isMobile]);

  // Starfield background - small static points
  const starPositions = useMemo(() => {
    const positions = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    return positions;
  }, []);

  useFrame(() => {
    if (!groupRef.current || !mesh.current) return;

    // Auto-rotate
    groupRef.current.rotation.x += 0.0002;
    groupRef.current.rotation.y += 0.0004;

    // Subtle mouse parallax
    groupRef.current.rotation.y += (mouseX.current * 0.3 - groupRef.current.rotation.y) * 0.05;
    groupRef.current.rotation.x += (mouseY.current * 0.3 - groupRef.current.rotation.x) * 0.05;
  });

  return (
    <group ref={groupRef}>
      {/* Starfield */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.08} color="#e0e0e0" sizeAttenuation transparent opacity={0.3} />
      </points>

      {/* Main particle cloud */}
      <points ref={mesh}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={isMobile ? 0.12 : 0.08}
          vertexColors
          sizeAttenuation
          transparent
          opacity={0.8}
          toneMapped={false}
        />
      </points>
    </group>
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

    // Import GSAP dynamically
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

  if (!mounted) return null;

  return (
    <section
      id="hero"
      className="cinematic-section section-tone-hero relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0A0A0A] to-[#0F0F0F]"
    >
      {/* Three.js Canvas Background */}
      <div className="absolute inset-0 z-0">
        {!reducedMotion ? (
          <Canvas
            camera={{ position: [0, 0, 8], fov: 45 }}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            style={{ background: "transparent" }}
          >
            <ParticleCloud />
          </Canvas>
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-accent/5 to-transparent" />
        )}
      </div>

      {/* Depth vignette overlay */}
      <div className="pointer-events-none absolute inset-0 z-[1] hero-depth-vignette" aria-hidden />

      {/* Content - Hero text overlay */}
      <div className="relative z-10 section-wrap grid min-h-[100svh] items-center gap-12 lg:grid-cols-1">
        <div className="hero-copy space-y-7 text-center md:space-y-8 lg:text-center">
          <div ref={badgeRef} className="inline-flex items-center justify-center gap-2.5 rounded-full border border-accent/45 bg-accent/10 px-4 py-1.5 text-[11px] tracking-[0.22em] text-accent mx-auto">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            ILLYRIAN PIXEL
          </div>

          <h1
            ref={headlineRef}
            className="hero-headline-trigger cadence-title font-display relative max-w-[22ch] mx-auto text-[clamp(2.6rem,5.5vw,4.8rem)] font-bold leading-[1.14] md:leading-[1.04] tracking-[-0.015em] md:tracking-[-0.03em]"
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
            <span className="sr-only">Website, SEO dhe Marketing për biznese shqiptare</span>
          </h1>

          <div ref={paragraphRef} className="cadence-body space-y-4">
            <p className="font-body text-[1.05rem] font-light leading-[1.75] tracking-[0.01em] text-white/62">
              Ndërtojmë Website & E-Commerce moderne, dominojmë Google me SEO dhe rrisim shitjet përmes Reklamave, Social Media & Branding.
            </p>
            <p className="font-body text-[0.9rem] font-medium tracking-[0.02em] text-accent/85">
              Plan konkret brenda 24 orëve, 100% pa pagesë.
            </p>
            <p className="font-body text-[0.83rem] font-light tracking-[0.02em] text-white/38">
              Ju fokusohuni te biznesi. Klientët i sjellim ne.
            </p>
          </div>

          <div ref={ctaRef} className="particle-hero-cta flex flex-wrap items-center justify-center gap-4">
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
      </div>

      {/* Scroll cue */}
      <div className="hero-scroll-cue" aria-hidden>
        <span>Zbulo më shumë</span>
        <span className="hero-scroll-cue-chevron" />
      </div>
    </section>
  );
}
