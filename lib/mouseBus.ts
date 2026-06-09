"use client";

type MoveHandler = (x: number, y: number) => void;
type OverHandler = (e: MouseEvent) => void;
type LeaveHandler = () => void;

const moveHandlers = new Set<MoveHandler>();
const overHandlers = new Set<OverHandler>();
const leaveHandlers = new Set<LeaveHandler>();

let initialized = false;
let rafId: number | null = null;
let latestX = 0;
let latestY = 0;

function flushMove() {
  rafId = null;
  moveHandlers.forEach((h) => h(latestX, latestY));
}

function init() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  window.addEventListener(
    "pointermove",
    (e: PointerEvent) => {
      latestX = e.clientX;
      latestY = e.clientY;
      if (rafId === null) rafId = window.requestAnimationFrame(flushMove);
    },
    { passive: true }
  );

  window.addEventListener("mouseover", (e: MouseEvent) => {
    overHandlers.forEach((h) => h(e));
  });

  window.addEventListener("pointerleave", () => {
    leaveHandlers.forEach((h) => h());
  });
}

export const mouseBus = {
  onMove(handler: MoveHandler): () => void {
    init();
    moveHandlers.add(handler);
    return () => moveHandlers.delete(handler);
  },
  onOver(handler: OverHandler): () => void {
    init();
    overHandlers.add(handler);
    return () => overHandlers.delete(handler);
  },
  onLeave(handler: LeaveHandler): () => void {
    init();
    leaveHandlers.add(handler);
    return () => leaveHandlers.delete(handler);
  },
};
