"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Icon } from "./Icon";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  closeLabel: string;
  children: ReactNode;
  className?: string;
};

const CLOSE_ANIMATION_MS = 180;

/**
 * Accessible modal on the native <dialog> element:
 * - focus is moved into the dialog and trapped; the page behind is inert
 * - Esc and clicks on the backdrop close it (with a short exit animation)
 * - focus returns to the element that opened it
 */
export function Modal({ open, onClose, title, description, closeLabel, children, className }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pointerDownOnBackdrop = useRef(false);
  const [closing, setClosing] = useState(false);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const requestClose = useCallback(() => {
    if (closing) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onClose();
      return;
    }
    setClosing(true);
    window.setTimeout(() => {
      setClosing(false);
      onClose();
    }, CLOSE_ANIMATION_MS);
  }, [closing, onClose]);

  return (
    <dialog
      ref={dialogRef}
      className={["modal", closing && "is-closing", className].filter(Boolean).join(" ")}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onClose={() => {
        if (open) onClose();
      }}
      // Only close when both press and release happen on the backdrop, so that
      // selecting text inside the form and releasing outside doesn't close it.
      onPointerDown={(event) => {
        pointerDownOnBackdrop.current = event.target === event.currentTarget;
      }}
      onClick={(event) => {
        if (pointerDownOnBackdrop.current && event.target === event.currentTarget) requestClose();
        pointerDownOnBackdrop.current = false;
      }}
    >
      <div className="modal__panel">
        <div className="modal__header">
          <div>
            <h2 id={titleId} className="modal__title">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="modal__description">
                {description}
              </p>
            )}
          </div>
          <button type="button" className="modal__close" onClick={requestClose} aria-label={closeLabel}>
            <Icon name="close" />
          </button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </dialog>
  );
}
