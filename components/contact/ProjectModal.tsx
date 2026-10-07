"use client";

import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Locale } from "@/i18n/routing";
import { Modal } from "../ui/Modal";

// The form (and its copy) is only downloaded when someone shows intent:
// hovering/focusing a "Start a project" button, or opening the modal.
const loadContactForm = () => import("./ContactForm");
const ContactForm = dynamic(() => loadContactForm().then((module) => module.ContactForm), {
  ssr: false,
  loading: () => (
    <div className="modal__loading">
      <span className="btn__spinner" aria-hidden="true" />
    </div>
  ),
});

type ProjectModalContextValue = {
  open: (source?: string) => void;
  prefetch: () => void;
};

const ProjectModalContext = createContext<ProjectModalContextValue | null>(null);

export function useProjectModal() {
  return useContext(ProjectModalContext);
}

type ProjectModalProviderProps = {
  locale: Locale;
  labels: { title: string; description: string; close: string };
  children: ReactNode;
};

export function ProjectModalProvider({ locale, labels, children }: ProjectModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  // Keep the form mounted after the first open, so an accidental close
  // doesn't throw away what the visitor has typed.
  const [hasOpened, setHasOpened] = useState(false);
  const [source, setSource] = useState<string | undefined>();

  const open = useCallback((nextSource?: string) => {
    setSource(nextSource);
    setHasOpened(true);
    setIsOpen(true);
  }, []);

  const prefetch = useCallback(() => {
    void loadContactForm();
  }, []);

  const close = useCallback(() => setIsOpen(false), []);
  const value = useMemo(() => ({ open, prefetch }), [open, prefetch]);

  return (
    <ProjectModalContext.Provider value={value}>
      {children}
      <Modal
        open={isOpen}
        onClose={close}
        title={labels.title}
        description={labels.description}
        closeLabel={labels.close}
      >
        {hasOpened && <ContactForm locale={locale} variant="modal" source={source} />}
      </Modal>
    </ProjectModalContext.Provider>
  );
}
