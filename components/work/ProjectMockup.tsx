import type { ProjectMockup as MockupKind, ProjectTheme } from "@/content/projects";

/**
 * Abstract interface illustrations used until real project screenshots exist.
 * Purely decorative (aria-hidden) — they never claim to show a real client's site.
 */

const C = {
  blue: "#006AA7",
  blueDark: "#00527F",
  navy: "#001F3F",
  yellow: "#FECC00",
  white: "#FFFFFF",
  off: "#F7F9FC",
  g100: "#F1F5F9",
  g200: "#E2E8F0",
  g300: "#CBD5E1",
  g900: "#17212B",
  b50: "#F0F6FB",
  b100: "#DCEAF4",
  b200: "#B5D3E8",
};

function BrowserFrame({ x, y, w, h, children }: { x: number; y: number; w: number; h: number; children: React.ReactNode }) {
  return (
    <g>
      <rect x={x + 6} y={y + 14} width={w} height={h} rx={16} fill="rgba(0,31,63,0.10)" />
      <rect x={x} y={y} width={w} height={h} rx={16} fill={C.white} />
      <path d={`M${x} ${y + 16}a16 16 0 0 1 16-16h${w - 32}a16 16 0 0 1 16 16v20H${x}z`} fill={C.off} />
      <circle cx={x + 20} cy={y + 18} r={4.5} fill={C.g300} />
      <circle cx={x + 34} cy={y + 18} r={4.5} fill={C.g300} />
      <circle cx={x + 48} cy={y + 18} r={4.5} fill={C.g300} />
      <rect x={x + w / 2 - 80} y={y + 9} width={160} height={18} rx={6} fill={C.white} stroke={C.g200} />
      <line x1={x} y1={y + 36} x2={x + w} y2={y + 36} stroke={C.g200} />
      {children}
    </g>
  );
}

function SiteMockup() {
  return (
    <>
      <BrowserFrame x={60} y={78} w={560} h={400}>
        <rect x={84} y={130} width={22} height={22} rx={5} fill={C.navy} />
        <rect x={440} y={137} width={36} height={8} rx={4} fill={C.g200} />
        <rect x={486} y={137} width={36} height={8} rx={4} fill={C.g200} />
        <rect x={532} y={133} width={64} height={16} rx={5} fill={C.blue} />
        <rect x={84} y={190} width={236} height={18} rx={5} fill={C.g900} />
        <rect x={84} y={218} width={180} height={18} rx={5} fill={C.g900} />
        <rect x={84} y={252} width={220} height={8} rx={4} fill={C.g200} />
        <rect x={84} y={268} width={190} height={8} rx={4} fill={C.g200} />
        <rect x={84} y={294} width={96} height={30} rx={8} fill={C.blue} />
        <rect x={190} y={294} width={86} height={30} rx={8} fill={C.white} stroke={C.b200} strokeWidth={2} />
        <rect x={346} y={180} width={250} height={150} rx={12} fill={C.b100} />
        <rect x={376} y={210} width={44} height={44} fill={C.blue} />
        <rect x={420} y={254} width={44} height={44} fill={C.navy} />
        <rect x={554} y={296} width={22} height={22} fill={C.yellow} />
        <rect x={84} y={356} width={160} height={92} rx={10} fill={C.off} stroke={C.g200} />
        <rect x={258} y={356} width={160} height={92} rx={10} fill={C.off} stroke={C.g200} />
        <rect x={432} y={356} width={164} height={92} rx={10} fill={C.off} stroke={C.g200} />
        <rect x={100} y={374} width={28} height={28} rx={6} fill={C.b100} />
        <rect x={274} y={374} width={28} height={28} rx={6} fill={C.b100} />
        <rect x={448} y={374} width={28} height={28} rx={6} fill={C.b100} />
      </BrowserFrame>
      <g>
        <rect x={596} y={238} width={150} height={300} rx={26} fill={C.g900} />
        <rect x={604} y={246} width={134} height={284} rx={20} fill={C.white} />
        <rect x={618} y={268} width={16} height={16} rx={4} fill={C.navy} />
        <rect x={618} y={300} width={100} height={12} rx={4} fill={C.g900} />
        <rect x={618} y={318} width={78} height={12} rx={4} fill={C.g900} />
        <rect x={618} y={340} width={96} height={6} rx={3} fill={C.g200} />
        <rect x={618} y={352} width={84} height={6} rx={3} fill={C.g200} />
        <rect x={618} y={370} width={70} height={22} rx={6} fill={C.blue} />
        <rect x={618} y={408} width={106} height={96} rx={10} fill={C.b100} />
        <rect x={694} y={480} width={14} height={14} fill={C.yellow} />
      </g>
    </>
  );
}

function ShopMockup() {
  const products = [0, 1, 2, 3];
  return (
    <BrowserFrame x={70} y={70} w={660} h={440}>
      <rect x={94} y={122} width={22} height={22} rx={5} fill={C.navy} />
      <rect x={130} y={129} width={44} height={8} rx={4} fill={C.g200} />
      <rect x={184} y={129} width={44} height={8} rx={4} fill={C.g200} />
      <rect x={238} y={129} width={44} height={8} rx={4} fill={C.g200} />
      <rect x={640} y={120} width={64} height={26} rx={7} fill={C.g100} />
      <circle cx={700} cy={121} r={9} fill={C.yellow} />
      <rect x={94} y={172} width={260} height={18} rx={5} fill={C.g900} />
      <rect x={94} y={200} width={170} height={8} rx={4} fill={C.g200} />
      <rect x={490} y={176} width={96} height={30} rx={8} fill={C.g100} />
      <rect x={596} y={176} width={110} height={30} rx={8} fill={C.blue} />
      {products.map((index) => {
        const x = 94 + index * 156;
        return (
          <g key={index}>
            <rect x={x} y={232} width={142} height={170} rx={12} fill={index % 2 ? C.b100 : C.b50} />
            <rect x={x + 41} y={279} width={60} height={76} rx={8} fill={index === 1 ? C.navy : C.blue} opacity={0.85} />
            <rect x={x} y={414} width={118} height={10} rx={4} fill={C.g900} />
            <rect x={x} y={432} width={70} height={8} rx={4} fill={C.g300} />
            <rect x={x} y={454} width={52} height={12} rx={4} fill={C.blue} />
          </g>
        );
      })}
    </BrowserFrame>
  );
}

function BrandMockup() {
  return (
    <>
      <rect x={70} y={80} width={300} height={300} rx={22} fill={C.navy} />
      <rect x={148} y={158} width={64} height={144} fill={C.white} />
      <rect x={212} y={158} width={80} height={64} fill={C.blue} />
      <rect x={228} y={238} width={64} height={64} fill={C.yellow} />
      <g>
        <rect x={400} y={80} width={150} height={190} rx={16} fill={C.blue} />
        <rect x={566} y={80} width={150} height={190} rx={16} fill={C.navy} />
        <rect x={400} y={286} width={150} height={94} rx={16} fill={C.yellow} />
        <rect x={566} y={286} width={150} height={94} rx={16} fill={C.white} stroke={C.g200} />
        <rect x={418} y={238} width={60} height={8} rx={4} fill="rgba(255,255,255,0.75)" />
        <rect x={584} y={238} width={60} height={8} rx={4} fill="rgba(255,255,255,0.75)" />
        <rect x={418} y={352} width={60} height={8} rx={4} fill="rgba(11,17,23,0.55)" />
        <rect x={584} y={352} width={60} height={8} rx={4} fill={C.g300} />
      </g>
      <rect x={70} y={404} width={420} height={120} rx={18} fill={C.white} stroke={C.g200} />
      <text
        x={98}
        y={488}
        fill={C.g900}
        fontSize={72}
        fontWeight={700}
        style={{ fontFamily: "var(--font-display), sans-serif", letterSpacing: "-0.04em" }}
      >
        Aa
      </text>
      <rect x={226} y={440} width={230} height={12} rx={5} fill={C.g900} />
      <rect x={226} y={462} width={190} height={8} rx={4} fill={C.g300} />
      <rect x={226} y={478} width={210} height={8} rx={4} fill={C.g300} />
      <g transform="rotate(-6 620 460)">
        <rect x={522} y={408} width={200} height={118} rx={12} fill={C.white} stroke={C.g200} />
        <rect x={544} y={430} width={22} height={22} rx={4} fill={C.navy} />
        <rect x={544} y={476} width={110} height={10} rx={4} fill={C.g900} />
        <rect x={544} y={494} width={80} height={7} rx={3} fill={C.g300} />
      </g>
    </>
  );
}

export function ProjectMockup({ kind, theme }: { kind: MockupKind; theme: ProjectTheme }) {
  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      className={`project-mockup theme-bg--${theme}`}
      aria-hidden="true"
      focusable="false"
    >
      <rect width={800} height={600} fill={theme === "navy" ? C.navy : theme === "mist" ? C.g100 : C.b50} />
      {theme === "navy" && (
        <g opacity={0.08} stroke={C.white}>
          {Array.from({ length: 13 }, (_, i) => (
            <line key={`v${i}`} x1={i * 64} y1={0} x2={i * 64} y2={600} />
          ))}
          {Array.from({ length: 10 }, (_, i) => (
            <line key={`h${i}`} x1={0} y1={i * 64} x2={800} y2={i * 64} />
          ))}
        </g>
      )}
      {kind === "site" && <SiteMockup />}
      {kind === "shop" && <ShopMockup />}
      {kind === "brand" && <BrandMockup />}
    </svg>
  );
}

/** Simplified screen used in the case study device gallery. */
export function DeviceScreenMockup({ device, kind }: { device: "desktop" | "tablet" | "mobile"; kind: MockupKind }) {
  const size = device === "desktop" ? { w: 320, h: 200 } : device === "tablet" ? { w: 300, h: 400 } : { w: 180, h: 380 };
  const pad = device === "mobile" ? 14 : 20;
  const contentW = size.w - pad * 2;
  const accent = kind === "shop" ? C.navy : C.blue;

  return (
    <svg viewBox={`0 0 ${size.w} ${size.h}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <rect width={size.w} height={size.h} fill={C.white} />
      <rect x={pad} y={pad} width={14} height={14} rx={3} fill={C.navy} />
      <rect x={size.w - pad - 40} y={pad + 3} width={40} height={8} rx={4} fill={C.g200} />
      <rect x={pad} y={pad + 34} width={contentW * 0.8} height={12} rx={4} fill={C.g900} />
      <rect x={pad} y={pad + 52} width={contentW * 0.55} height={12} rx={4} fill={C.g900} />
      <rect x={pad} y={pad + 74} width={contentW * 0.7} height={6} rx={3} fill={C.g200} />
      <rect x={pad} y={pad + 92} width={64} height={18} rx={5} fill={accent} />
      <rect x={pad} y={pad + 122} width={contentW} height={size.h - pad * 2 - 122} rx={8} fill={C.b50} />
      <rect x={pad + contentW - 22} y={size.h - pad - 22} width={12} height={12} fill={C.yellow} />
    </svg>
  );
}
