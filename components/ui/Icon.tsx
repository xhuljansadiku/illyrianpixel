import type { SVGProps } from "react";

export type IconName =
  | "arrow-right"
  | "arrow-up-right"
  | "check"
  | "close"
  | "alert"
  | "mail"
  | "phone"
  | "quote"
  | "linkedin"
  | "instagram"
  | "facebook";

type IconProps = Omit<SVGProps<SVGSVGElement>, "name"> & {
  name: IconName;
  size?: number;
  /** Accessible label. Without it the icon is decorative (aria-hidden). */
  title?: string;
};

const STROKE_ICONS: Partial<Record<IconName, React.ReactNode>> = {
  "arrow-right": <path d="M5 12h14M13 6l6 6-6 6" />,
  "arrow-up-right": <path d="M7 17 17 7M8 7h9v9" />,
  check: <path d="m5 12.5 4.5 4.5L19 7" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  alert: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5M12 16.5h.01" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
    </>
  ),
  phone: (
    <path d="M5 4h3.5l1.7 4.3-2.2 1.4a11 11 0 0 0 6.3 6.3l1.4-2.2L20 15.5V19a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z" />
  ),
};

const FILLED_ICONS: Partial<Record<IconName, React.ReactNode>> = {
  quote: (
    <path d="M10 7.5C6.9 8.4 5 10.9 5 14v3.5A1.5 1.5 0 0 0 6.5 19H9a1.5 1.5 0 0 0 1.5-1.5V15A1.5 1.5 0 0 0 9 13.5H7.6c.3-1.9 1.4-3.2 3-3.8L10 7.5zm9 0c-3.1.9-5 3.4-5 6.5v3.5a1.5 1.5 0 0 0 1.5 1.5H18a1.5 1.5 0 0 0 1.5-1.5V15a1.5 1.5 0 0 0-1.5-1.5h-1.4c.3-1.9 1.4-3.2 3-3.8L19 7.5z" />
  ),
  linkedin: (
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4v11H3v-11zm6.5 0h3.83v1.5h.05c.53-.95 1.84-1.95 3.79-1.95 4.05 0 4.8 2.53 4.8 5.83v5.62h-4v-4.98c0-1.19-.02-2.72-1.75-2.72-1.75 0-2.02 1.3-2.02 2.63v5.07H9.5v-11z" />
  ),
  instagram: (
    <path d="M12 3c2.44 0 2.75.01 3.71.05.96.05 1.61.2 2.18.42.59.23 1.09.54 1.59 1.04.5.5.81 1 1.04 1.59.22.57.37 1.22.42 2.18.04.96.05 1.27.05 3.72s-.01 2.75-.05 3.71c-.05.96-.2 1.61-.42 2.18a4.4 4.4 0 0 1-1.04 1.59c-.5.5-1 .81-1.59 1.04-.57.22-1.22.37-2.18.42-.96.04-1.27.05-3.71.05s-2.76-.01-3.72-.05c-.96-.05-1.61-.2-2.18-.42a4.4 4.4 0 0 1-1.59-1.04c-.5-.5-.81-1-1.04-1.59-.22-.57-.37-1.22-.42-2.18C3.01 14.75 3 14.44 3 12s.01-2.76.05-3.72c.05-.96.2-1.61.42-2.18.23-.59.54-1.09 1.04-1.59.5-.5 1-.81 1.59-1.04.57-.22 1.22-.37 2.18-.42C9.24 3.01 9.56 3 12 3zm0 1.62c-2.4 0-2.69.01-3.64.05-.88.04-1.36.19-1.67.31-.42.17-.72.36-1.04.68-.32.32-.51.62-.68 1.04-.12.31-.27.79-.31 1.67-.04.95-.05 1.24-.05 3.63s.01 2.69.05 3.64c.04.88.19 1.36.31 1.67.17.42.36.72.68 1.04.32.32.62.51 1.04.68.31.12.79.27 1.67.31.95.04 1.24.05 3.64.05s2.68-.01 3.63-.05c.88-.04 1.36-.19 1.67-.31.42-.17.72-.36 1.04-.68.32-.32.51-.62.68-1.04.12-.31.27-.79.31-1.67.04-.95.05-1.24.05-3.64s-.01-2.68-.05-3.63c-.04-.88-.19-1.36-.31-1.67a2.8 2.8 0 0 0-.68-1.04 2.8 2.8 0 0 0-1.04-.68c-.31-.12-.79-.27-1.67-.31-.95-.04-1.24-.05-3.63-.05zm0 2.76a4.62 4.62 0 1 1 0 9.24 4.62 4.62 0 0 1 0-9.24zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm5.88-7.8a1.08 1.08 0 1 1-2.16 0 1.08 1.08 0 0 1 2.16 0z" />
  ),
  facebook: (
    <path d="M13.5 21v-7.5h2.53l.38-2.94H13.5V8.68c0-.85.24-1.43 1.46-1.43h1.55V4.62a20.6 20.6 0 0 0-2.27-.12c-2.25 0-3.79 1.37-3.79 3.9v2.16H7.9v2.94h2.55V21h3.05z" />
  ),
};

export function Icon({ name, size = 20, title, className, ...rest }: IconProps) {
  const filled = name in FILLED_ICONS;
  const a11y = title ? { role: "img", "aria-label": title } : { "aria-hidden": true as const, focusable: false };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth={filled ? undefined : 1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...a11y}
      {...rest}
    >
      {filled ? FILLED_ICONS[name] : STROKE_ICONS[name]}
    </svg>
  );
}
