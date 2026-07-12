"use client";

// Ikonat e panelit admin — një set i vetëm stroke-based (stil feather) që zëvendëson
// emoji-t, për pamje profesionale e konsistente në të dy temat.

import type { ReactNode } from "react";

export type AdminIconName =
  | "home"
  | "inbox"
  | "receipt"
  | "folder"
  | "briefcase"
  | "wallet"
  | "pen"
  | "mail"
  | "layers"
  | "chart"
  | "note"
  | "check"
  | "clock"
  | "crown"
  | "settings"
  | "search"
  | "logout"
  | "download"
  | "plus"
  | "external"
  | "zap"
  | "users";

const PATHS: Record<AdminIconName, ReactNode> = {
  home: (
    <>
      <path d="M3 9.5 12 3l9 6.5V20a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 20Z" />
      <path d="M9.5 21.5V13h5v8.5" />
    </>
  ),
  inbox: (
    <>
      <path d="M22 12.5h-5.5l-2 3h-5l-2-3H2" />
      <path d="M5.5 5.6 2 12.5V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5.5L18.5 5.6A2 2 0 0 0 16.7 4.5H7.3a2 2 0 0 0-1.8 1.1Z" />
    </>
  ),
  receipt: (
    <>
      <path d="M14 2.5H6a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-11Z" />
      <path d="M14 2.5v6h6" />
      <path d="M15.5 13.5h-7" />
      <path d="M15.5 17h-7" />
    </>
  ),
  folder: (
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4.6l2 3H20a2 2 0 0 1 2 2Z" />
  ),
  briefcase: (
    <>
      <rect x="2.5" y="7.5" width="19" height="13" rx="2" />
      <path d="M15.5 20.5v-15a2 2 0 0 0-2-2h-3a2 2 0 0 0-2 2v15" />
    </>
  ),
  wallet: (
    <>
      <rect x="2" y="5" width="20" height="15" rx="2" />
      <path d="M2 10h20" />
      <path d="M6 15.5h4" />
    </>
  ),
  pen: (
    <>
      <path d="M12 20.5h9" />
      <path d="M16.7 3.8a2.1 2.1 0 0 1 3 3L7.5 19l-4 1 1-4Z" />
    </>
  ),
  mail: (
    <>
      <rect x="2" y="4.5" width="20" height="15" rx="2" />
      <path d="m22 7.5-10 6.5L2 7.5" />
    </>
  ),
  layers: (
    <>
      <path d="M12 2.5 2 8l10 5.5L22 8Z" />
      <path d="m2 12.5 10 5.5 10-5.5" />
      <path d="m2 17 10 5.5L22 17" />
    </>
  ),
  chart: (
    <>
      <path d="M18 20.5v-9" />
      <path d="M12 20.5v-16" />
      <path d="M6 20.5v-5" />
      <path d="M2.5 20.5h19" />
    </>
  ),
  note: (
    <>
      <path d="M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5Z" />
      <path d="M15 3v6h6" />
    </>
  ),
  check: (
    <>
      <path d="m9 11.5 3 3 10-10" />
      <path d="M21 12.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 6.5V12l3.5 2" />
    </>
  ),
  crown: (
    <>
      <path d="m3 7 4 4.5L12 4l5 7.5L21 7l-1.6 11H4.6Z" />
      <path d="M5 21h14" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.11-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.56-1.11 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.08A1.7 1.7 0 0 0 10 4.09V4a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.08A1.7 1.7 0 0 0 20.91 11H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1Z" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7.5" />
      <path d="m21 21-4.7-4.7" />
    </>
  ),
  logout: (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </>
  ),
  download: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m7 10 5 5 5-5" />
      <path d="M12 15V3" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  external: (
    <>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
    </>
  ),
  zap: <path d="M13 2 3 14h8l-1 8 11-13h-8Z" />,
  users: (
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
};

export function AdminIcon({
  name,
  className = "h-4 w-4",
  strokeWidth = 1.75,
}: {
  name: AdminIconName;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {PATHS[name]}
    </svg>
  );
}
