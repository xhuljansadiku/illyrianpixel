"use client";

import { useEffect, useRef, useState } from "react";
import { Skeleton, useConfirm } from "@/components/admin/ui";

type Attachment = {
  id: number;
  name: string;
  path: string;
  content_type: string | null;
  size: number | null;
  created_at: string;
  url: string | null;
};

function formatSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AttachmentsPanel({
  ownerType,
  ownerId,
}: {
  ownerType: "contact" | "project";
  ownerId: number | string;
}) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [confirm, renderConfirm] = useConfirm();

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/attachments?owner_type=${ownerType}&owner_id=${ownerId}`);
      const data = await res.json();
      if (data.success) setAttachments(data.attachments);
    } catch {
      // injoro
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerType, ownerId]);

  const upload = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("owner_type", ownerType);
      formData.append("owner_id", String(ownerId));
      const res = await fetch("/api/admin/attachments", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setAttachments((prev) => [data.attachment, ...prev]);
      } else {
        setError(data.error ?? "Gabim i panjohur.");
      }
    } catch {
      setError("Gabim lidhjeje.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const remove = async (id: number) => {
    if (!(await confirm({ title: "Fshi skedarin", message: "Të fshihet ky skedar?", danger: true, confirmText: "Fshi" }))) return;
    setAttachments((prev) => prev.filter((a) => a.id !== id));
    await fetch(`/api/admin/attachments/${id}`, { method: "DELETE" });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">Bashkëngjitje</p>
        <label className="font-ui cursor-pointer rounded-[2px] border border-[var(--a-border)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[rgb(var(--a-text-rgb)/0.6)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)]">
          {uploading ? "Duke ngarkuar…" : "+ Skedar"}
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) upload(file);
            }}
          />
        </label>
      </div>
      {error && <p className="text-[11px] text-red-400">{error}</p>}
      {loading ? (
        <Skeleton className="h-8 w-full" />
      ) : attachments.length === 0 ? (
        <p className="text-[11px] text-[rgb(var(--a-text-rgb)/0.35)]">Asnjë skedar i bashkëngjitur.</p>
      ) : (
        <ul className="space-y-1">
          {attachments.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between gap-2 rounded-[2px] border border-[var(--a-border)] px-2.5 py-1.5 text-[11px]"
            >
              <a
                href={a.url ?? "#"}
                target="_blank"
                rel="noreferrer"
                className="flex-1 truncate text-[rgb(var(--a-text-rgb)/0.7)] transition-colors hover:text-accent"
                title={a.name}
              >
                📎 {a.name}
              </a>
              <span className="text-[10px] text-[rgb(var(--a-text-rgb)/0.3)]">{formatSize(a.size)}</span>
              <button
                onClick={() => remove(a.id)}
                className="text-[rgb(var(--a-text-rgb)/0.3)] transition-colors hover:text-red-400"
                title="Fshi"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
      {renderConfirm()}
    </div>
  );
}
