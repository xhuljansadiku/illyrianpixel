"use client";

// Skena 3D e hero-s (particles + gema e artë) — e ndarë nga teksti i hero-s
// që three.js/r3f të mos hyjnë në bundle-in kritik: kjo skedë ngarkohet lazy
// (dynamic import) pasi faqja të ketë bërë paint-in e parë. Teksti i hero-s
// renderohet në server për LCP të shpejtë dhe zero CLS.

import { useRef, useMemo, useEffect, useState, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

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

// Progres i scroll-it të hero-s (0 = maja e faqes, 1 = hero jashtë ekranit) —
// përdoret që retë e pikave dhe gema të reagojnë ndaj scroll-it, jo vetëm mouse-it.
function useHeroScrollProgress() {
  const progress = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      progress.current = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return progress;
}

function ParticleDust() {
  const groupRef = useRef<THREE.Group>(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const isMobile = useIsMobile();
  const discTexture = useDiscTexture();
  const scroll = useHeroScrollProgress();

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

    // Scroll-i e shpërndan renë lehtë dhe e rrotullon — thellësi kur largohesh nga hero
    const s = scroll.current;
    const targetScale = 1 + s * 0.22;
    groupRef.current.scale.setScalar(
      groupRef.current.scale.x + (targetScale - groupRef.current.scale.x) * 0.06
    );
    groupRef.current.rotation.z += (s * 0.1 - groupRef.current.rotation.z) * 0.05;
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
  const scroll = useHeroScrollProgress();

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
    groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.08 + scroll.current * 0.35;
    groupRef.current.rotation.y += (mouseX.current * 0.25 - groupRef.current.rotation.y * 0.02);
    // Gema zhytet poshtë ndërsa scroll-on — largim me thellësi, jo statik
    groupRef.current.position.y =
      (isMobile ? -0.5 : 0.1) + Math.sin(t * 0.6) * 0.08 - scroll.current * 1.1;
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

export default function ParticleCloudScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <ParticleDust />
      <BrandGem />
    </Canvas>
  );
}
