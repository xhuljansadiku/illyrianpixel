"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { CARD, EmptyState, Skeleton, STATUS_LABELS, formatDate, formatDay, isOverdue, useConfirm, useDebounced, useUndoToast } from "@/components/admin/ui";
import { formatMoney } from "@/lib/quotes";
import { leadScore, LEAD_LABEL_STYLES, LEAD_LABEL_TEXT } from "@/lib/leadScore";
import AttachmentsPanel from "@/components/admin/AttachmentsPanel";
import type { Contact, TrashedContact } from "@/components/AdminDashboard";

type ContactLog = {
  id: number;
  contact_id: number;
  action: string;
  detail: string | null;
  created_at: string;
};

type ContactNote = {
  id: number;
  contact_id: string;
  text: string;
  created_at: string;
  updated_at: string;
};

type SavedContactFilter = {
  name: string;
  search: string;
  serviceFilter: string;
  tagFilter: string;
  dateFrom: string;
  dateTo: string;
  followUpFilter: "all" | "none" | "overdue" | "upcoming";
};

const CONTACT_FILTERS_KEY = "ip_admin_contact_saved_filters";

const STATUS_COLORS: Record<string, string> = {
  new: "border-blue-400/30 bg-blue-400/8 text-blue-300",
  "in-progress": "border-yellow-400/30 bg-yellow-400/8 text-yellow-300",
  done: "border-emerald-400/30 bg-emerald-400/8 text-emerald-300",
};

const STATUS_COLUMNS = ["new", "in-progress", "done"] as const;

const LOG_ACTION_LABELS: Record<string, (detail: string | null) => string> = {
  status: (d) => `Statusi u ndryshua → ${d}`,
  assigned_to: (d) => (d ? `U caktua tek ${d}` : "U hoq caktimi"),
  follow_up_date: (d) => (d ? `Data e ndjekjes u vendos: ${formatDay(`${d}T00:00:00`)}` : "U hoq data e ndjekjes"),
  value: (d) => (d ? `Vlera u vendos: ${d}` : "U hoq vlera"),
  email: (d) => `📧 Email i dërguar: ${d ?? ""}`,
};

function whatsappHref(phone: string) {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = "355" + digits.slice(1);
  if (!digits.startsWith("355") && digits.length <= 9) digits = "355" + digits;
  return `https://wa.me/${digits}`;
}

function csvCell(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

function downloadContactsCSV(rows: Contact[]) {
  const columns = [
    "name", "email", "phone", "business_name", "service", "budget", "timeline",
    "status", "assigned_to", "follow_up_date", "tags", "discount_code", "created_at", "message",
  ];
  const header = columns.join(",") + "\n";
  const body = rows
    .map((c) =>
      [
        c.name, c.email, c.phone, c.business_name ?? "", c.service, c.budget, c.timeline,
        STATUS_LABELS[c.status || "new"] ?? c.status ?? "",
        c.assigned_to ?? "", c.follow_up_date ?? "", (c.tags ?? []).join("; "),
        c.discount_code ?? "", c.created_at, c.message,
      ]
        .map((v) => csvCell(String(v ?? "")))
        .join(",")
    )
    .join("\n");
  const blob = new Blob(["﻿" + header + body], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `kontaktet-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function KanbanColumn({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`min-h-[80px] space-y-3 rounded-xl p-1 transition-colors ${
        isOver ? "bg-accent/5 ring-1 ring-accent/30" : ""
      }`}
    >
      {children}
    </div>
  );
}

function DraggableCard({ id, children }: { id: number; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  const style: React.CSSProperties = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, position: "relative", zIndex: 30 }
    : {};
  return (
    <div ref={setNodeRef} style={style} className={isDragging ? "opacity-40" : ""}>
      <div className="relative">
        <div
          {...attributes}
          {...listeners}
          title="Zhvendos"
          className="absolute right-3 top-3 z-10 cursor-grab touch-none select-none rounded px-1.5 py-1 text-[14px] leading-none text-[rgb(var(--a-text-rgb)/0.25)] transition-colors hover:text-[rgb(var(--a-text-rgb)/0.6)] active:cursor-grabbing"
        >
          ⠿
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Contacts tab ───────────────────────────────────────────────────────────
const REPLY_TEMPLATES: {
  id: string;
  label: string;
  subject: string;
  message: (c: Contact) => string;
}[] = [
  {
    id: "thanks",
    label: "Falënderim + hapi tjetër",
    subject: "Faleminderit për kërkesën — Illyrian Pixel",
    message: (c) =>
      `Faleminderit që na kontaktuat për ${c.service || "projektin tuaj"}.\n\nE kemi marrë kërkesën tuaj dhe do t'ju kontaktojmë brenda 24 orëve me një plan konkret.\n\nNëse dëshironi të flasim më shpejt, na shkruani direkt në WhatsApp ose rezervoni një konsultë falas në faqen tonë.`,
  },
  {
    id: "quote",
    label: "Dërgim oferte",
    subject: "Oferta juaj nga Illyrian Pixel",
    message: (c) =>
      `Bazuar në kërkesën tuaj për ${c.service || "shërbimin e zgjedhur"}, kemi përgatitur një ofertë të personalizuar.\n\nDo ta gjeni të bashkëngjitur / në vijim të këtij emaili. Mos hezitoni të na pyesni për çdo paqartësi — me kënaqësi e përshtatim sipas nevojave tuaja.`,
  },
  {
    id: "followup",
    label: "Follow-up i sjellshëm",
    subject: "A keni pasur kohë të shihni propozimin tonë?",
    message: () =>
      `Donim thjesht të sigurohemi që e keni marrë mesazhin tonë të mëparshëm.\n\nJemi këtu për çdo pyetje dhe mund ta përshtatim ofertën sipas nevojave tuaja. Nëse preferoni një bisedë të shkurtër, na tregoni kur ju përshtatet.`,
  },
];

export default function ContactsTab({
  contacts,
  setContacts,
  jumpSearch,
  onCreateQuote,
  trashedContacts,
  setTrashedContacts,
}: {
  contacts: Contact[];
  setContacts: (c: Contact[]) => void;
  jumpSearch?: { term: string; key: number } | null;
  onCreateQuote: (c: Contact) => void;
  trashedContacts: TrashedContact[];
  setTrashedContacts: (c: TrashedContact[]) => void;
}) {
  const [showTrash, setShowTrash] = useState(false);
  const [trashBusyId, setTrashBusyId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("Të gjitha");
  const [tagFilter, setTagFilter] = useState("Të gjitha");
  const [tagDraft, setTagDraft] = useState<Record<number, string>>({});
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [followUpFilter, setFollowUpFilter] = useState<"all" | "none" | "overdue" | "upcoming">("all");
  const [savedFilters, setSavedFilters] = useState<SavedContactFilter[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [assignedDraft, setAssignedDraft] = useState<Record<number, string>>({});
  const [followUpDraft, setFollowUpDraft] = useState<Record<number, string>>({});
  const [saveError, setSaveError] = useState<Record<number, string>>({});
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);
  const [logs, setLogs] = useState<Record<number, ContactLog[]>>({});
  const [logsLoading, setLogsLoading] = useState<Record<number, boolean>>({});
  const [notesList, setNotesList] = useState<Record<number, ContactNote[]>>({});
  const [notesLoading, setNotesLoading] = useState<Record<number, boolean>>({});
  const [newNoteDraft, setNewNoteDraft] = useState<Record<number, string>>({});
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editNoteDraft, setEditNoteDraft] = useState<Record<number, string>>({});
  const [addingNoteFor, setAddingNoteFor] = useState<number | null>(null);
  const [noteBusy, setNoteBusy] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"kanban" | "calendar">("kanban");
  const [confirm, renderConfirm] = useConfirm();
  const { showUndo, renderUndoToast } = useUndoToast();
  const debouncedSearch = useDebounced(search, 250);
  const [valueDraft, setValueDraft] = useState<Record<number, string>>({});
  const [replyOpenFor, setReplyOpenFor] = useState<number | null>(null);
  const [replySubject, setReplySubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [replySending, setReplySending] = useState(false);
  const [replyResult, setReplyResult] = useState("");
  const [copiedPortalId, setCopiedPortalId] = useState<number | null>(null);

  const copyPortalLink = async (c: Contact) => {
    if (!c.portal_token) return;
    const url = `${window.location.origin}/klienti/${c.portal_token}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedPortalId(c.id);
      setTimeout(() => setCopiedPortalId(null), 2500);
    } catch {
      prompt("Kopjoje lidhjen manualisht:", url);
    }
  };

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const jumpToContact = (c: Contact) => {
    setViewMode("kanban");
    setSearch(c.email);
    setExpanded(c.id);
    markViewed(c);
  };

  useEffect(() => {
    if (jumpSearch) setSearch(jumpSearch.term);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jumpSearch?.key]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CONTACT_FILTERS_KEY);
      if (raw) setSavedFilters(JSON.parse(raw));
    } catch {
      // injoro
    }
  }, []);

  const applySavedFilter = (f: SavedContactFilter) => {
    setSearch(f.search);
    setServiceFilter(f.serviceFilter);
    setTagFilter(f.tagFilter);
    setDateFrom(f.dateFrom);
    setDateTo(f.dateTo);
    setFollowUpFilter(f.followUpFilter);
  };

  const saveCurrentFilter = () => {
    const name = prompt("Emri i filtrit:");
    if (!name || !name.trim()) return;
    const next = [
      ...savedFilters.filter((f) => f.name !== name.trim()),
      { name: name.trim(), search, serviceFilter, tagFilter, dateFrom, dateTo, followUpFilter },
    ];
    setSavedFilters(next);
    localStorage.setItem(CONTACT_FILTERS_KEY, JSON.stringify(next));
  };

  const deleteSavedFilter = (name: string) => {
    const next = savedFilters.filter((f) => f.name !== name);
    setSavedFilters(next);
    localStorage.setItem(CONTACT_FILTERS_KEY, JSON.stringify(next));
  };

  const services = useMemo(
    () => ["Të gjitha", ...Array.from(new Set(contacts.map((c) => c.service).filter(Boolean)))],
    [contacts]
  );

  const allTags = useMemo(
    () => ["Të gjitha", ...Array.from(new Set(contacts.flatMap((c) => c.tags ?? []))).sort()],
    [contacts]
  );

  const duplicateCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of contacts) {
      const key = c.email.trim().toLowerCase();
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return map;
  }, [contacts]);

  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    return contacts.filter((c) => {
      if (q) {
        const haystack = `${c.name} ${c.email} ${c.business_name ?? ""} ${c.phone}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (serviceFilter !== "Të gjitha" && c.service !== serviceFilter) return false;
      if (tagFilter !== "Të gjitha" && !(c.tags ?? []).includes(tagFilter)) return false;
      if (dateFrom && new Date(c.created_at) < new Date(dateFrom)) return false;
      if (dateTo && new Date(c.created_at) > new Date(dateTo + "T23:59:59")) return false;
      if (followUpFilter === "none" && c.follow_up_date) return false;
      if (followUpFilter === "overdue" && !(c.follow_up_date && c.follow_up_date < new Date().toISOString().slice(0, 10))) return false;
      if (followUpFilter === "upcoming" && !(c.follow_up_date && c.follow_up_date >= new Date().toISOString().slice(0, 10))) return false;
      return true;
    });
  }, [contacts, debouncedSearch, serviceFilter, tagFilter, dateFrom, dateTo, followUpFilter]);

  const loadLogs = async (id: number) => {
    setLogsLoading((s) => ({ ...s, [id]: true }));
    try {
      const res = await fetch(`/api/admin/contacts/${id}/logs`);
      const data = await res.json();
      if (data.success) setLogs((l) => ({ ...l, [id]: data.logs }));
    } finally {
      setLogsLoading((s) => ({ ...s, [id]: false }));
    }
  };

  const loadNotes = async (id: number) => {
    setNotesLoading((s) => ({ ...s, [id]: true }));
    try {
      const res = await fetch(`/api/admin/contacts/${id}/notes`);
      const data = await res.json();
      if (data.success) setNotesList((l) => ({ ...l, [id]: data.notes }));
    } finally {
      setNotesLoading((s) => ({ ...s, [id]: false }));
    }
  };

  useEffect(() => {
    if (expanded !== null) {
      if (!logs[expanded] && !logsLoading[expanded]) loadLogs(expanded);
      if (!notesList[expanded] && !notesLoading[expanded]) loadNotes(expanded);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

  const addNote = async (c: Contact) => {
    const text = (newNoteDraft[c.id] ?? "").trim();
    if (!text) return;
    setAddingNoteFor(c.id);
    try {
      const res = await fetch(`/api/admin/contacts/${c.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.success) {
        setNotesList((l) => ({ ...l, [c.id]: [data.note, ...(l[c.id] ?? [])] }));
        setNewNoteDraft((d) => ({ ...d, [c.id]: "" }));
      }
    } finally {
      setAddingNoteFor(null);
    }
  };

  const saveNoteEdit = async (contactId: number, noteId: number) => {
    const text = (editNoteDraft[noteId] ?? "").trim();
    if (!text) return;
    setNoteBusy(noteId);
    try {
      const res = await fetch(`/api/admin/contacts/${contactId}/notes/${noteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.success) {
        setNotesList((l) => ({
          ...l,
          [contactId]: (l[contactId] ?? []).map((n) => (n.id === noteId ? data.note : n)),
        }));
        setEditingNoteId(null);
      }
    } finally {
      setNoteBusy(null);
    }
  };

  const deleteNote = async (contactId: number, noteId: number) => {
    if (!(await confirm({ title: "Fshi shënimin", message: "Të fshihet ky shënim?", danger: true, confirmText: "Fshi" }))) return;
    setNoteBusy(noteId);
    try {
      const res = await fetch(`/api/admin/contacts/${contactId}/notes/${noteId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setNotesList((l) => ({ ...l, [contactId]: (l[contactId] ?? []).filter((n) => n.id !== noteId) }));
      }
    } finally {
      setNoteBusy(null);
    }
  };

  const deleteLegacyNote = async (c: Contact) => {
    if (!(await confirm({ title: "Fshi shënimin", message: "Të fshihet ky shënim i vjetër?", danger: true, confirmText: "Fshi" }))) return;
    updateContact(c.id, { notes: "" });
  };

  const markViewed = (c: Contact) => {
    if (c.viewed_at) return;
    const now = new Date().toISOString();
    setContacts(contacts.map((x) => (x.id === c.id ? { ...x, viewed_at: now } : x)));
    fetch(`/api/admin/contacts/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ viewed: true }),
    }).catch(() => {});
  };

  const updateContact = async (
    id: number,
    update: Partial<Pick<Contact, "status" | "notes" | "assigned_to" | "follow_up_date" | "tags">>
  ) => {
    setSavingId(id);
    setSaveError((e) => ({ ...e, [id]: "" }));
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(update),
      });
      const data = await res.json();
      if (data.success) {
        setContacts(contacts.map((c) => (c.id === id ? { ...c, ...update } : c)));
        if (expanded === id) loadLogs(id);
      } else {
        setSaveError((e) => ({ ...e, [id]: data.error ?? "Gabim i panjohur." }));
      }
    } catch {
      setSaveError((e) => ({ ...e, [id]: "Gabim lidhjeje." }));
    } finally {
      setSavingId(null);
    }
  };

  const saveDetails = (c: Contact) => {
    const update: Partial<Pick<Contact, "assigned_to" | "follow_up_date" | "value">> = {};
    const assignedVal = assignedDraft[c.id];
    const followUpVal = followUpDraft[c.id];
    const valueVal = valueDraft[c.id];
    if (assignedVal !== undefined && assignedVal !== (c.assigned_to ?? "")) update.assigned_to = assignedVal;
    if (followUpVal !== undefined && followUpVal !== (c.follow_up_date ?? "")) update.follow_up_date = followUpVal;
    if (valueVal !== undefined && valueVal !== (c.value === null || c.value === undefined ? "" : String(c.value))) {
      update.value = valueVal === "" ? null : Number(valueVal);
    }
    if (Object.keys(update).length === 0) return;
    updateContact(c.id, update);
  };

  const openReply = (c: Contact) => {
    if (replyOpenFor === c.id) {
      setReplyOpenFor(null);
      return;
    }
    const tpl = REPLY_TEMPLATES[0];
    setReplyOpenFor(c.id);
    setReplySubject(tpl.subject);
    setReplyMessage(tpl.message(c));
    setReplyResult("");
  };

  const applyTemplate = (c: Contact, id: string) => {
    const tpl = REPLY_TEMPLATES.find((t) => t.id === id);
    if (!tpl) return;
    setReplySubject(tpl.subject);
    setReplyMessage(tpl.message(c));
  };

  const sendReply = async (c: Contact) => {
    if (!replySubject.trim() || !replyMessage.trim()) return;
    setReplySending(true);
    setReplyResult("");
    try {
      const res = await fetch(`/api/admin/contacts/${c.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: replySubject, message: replyMessage }),
      });
      const data = await res.json();
      if (data.success) {
        setReplyResult(`✓ U dërgua te ${c.email}`);
        if (data.note) setNotesList((l) => ({ ...l, [c.id]: [data.note, ...(l[c.id] ?? [])] }));
        loadLogs(c.id);
        setTimeout(() => setReplyOpenFor(null), 1600);
      } else {
        setReplyResult(data.error ?? "Dërgimi dështoi.");
      }
    } catch {
      setReplyResult("Gabim lidhjeje.");
    } finally {
      setReplySending(false);
    }
  };

  const addTag = (c: Contact) => {
    const tag = (tagDraft[c.id] ?? "").trim().slice(0, 30);
    if (!tag) return;
    const current = c.tags ?? [];
    if (current.includes(tag)) {
      setTagDraft((d) => ({ ...d, [c.id]: "" }));
      return;
    }
    updateContact(c.id, { tags: [...current, tag] });
    setTagDraft((d) => ({ ...d, [c.id]: "" }));
  };

  const removeTag = (c: Contact, tag: string) => {
    updateContact(c.id, { tags: (c.tags ?? []).filter((t) => t !== tag) });
  };

  const removeContact = async (id: number) => {
    if (!(await confirm({ title: "Fshi kontaktin", message: "Të fshihet ky kontakt? Mund ta rikthesh nga koshi më vonë.", danger: true, confirmText: "Fshi" }))) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        const removed = contacts.find((c) => c.id === id);
        setContacts(contacts.filter((c) => c.id !== id));
        if (removed) {
          setTrashedContacts([
            { id: removed.id, name: removed.name, email: removed.email, business_name: removed.business_name, service: removed.service, deleted_at: new Date().toISOString() },
            ...trashedContacts,
          ]);
        }
        setSelected((s) => {
          const next = new Set(s);
          next.delete(id);
          return next;
        });
      }
    } finally {
      setDeletingId(null);
    }
  };

  const toggleSelect = (id: number) => {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const bulkUpdateStatus = async (status: string) => {
    if (!status || selected.size === 0) return;
    const ids = Array.from(selected);
    setBulkBusy(true);
    try {
      const res = await fetch("/api/admin/contacts/bulk", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, status }),
      });
      const data = await res.json();
      if (data.success) {
        setContacts(contacts.map((c) => (ids.includes(c.id) ? { ...c, status } : c)));
        setSelected(new Set());
      }
    } finally {
      setBulkBusy(false);
    }
  };

  const bulkDelete = async () => {
    if (selected.size === 0) return;
    if (!(await confirm({ title: "Fshi kontaktet", message: `Të fshihen ${selected.size} kontakte? Mund t'i rikthesh nga koshi më vonë.`, danger: true, confirmText: "Fshi" }))) return;
    const ids = Array.from(selected);
    const removed = contacts.filter((c) => ids.includes(c.id));
    const remaining = contacts.filter((c) => !ids.includes(c.id));
    setContacts(remaining);
    setSelected(new Set());
    showUndo(
      `${ids.length} kontakte u fshinë.`,
      () => setContacts([...removed, ...remaining]),
      async () => {
        setBulkBusy(true);
        try {
          await fetch("/api/admin/contacts/bulk", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids }),
          });
        } finally {
          setBulkBusy(false);
        }
      }
    );
  };

  const restoreContact = async (tc: TrashedContact) => {
    setTrashBusyId(tc.id);
    try {
      const res = await fetch(`/api/admin/contacts/${tc.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restore: true }),
      });
      const data = await res.json();
      if (data.success && data.contact) {
        setTrashedContacts(trashedContacts.filter((c) => c.id !== tc.id));
        setContacts([data.contact, ...contacts]);
      }
    } finally {
      setTrashBusyId(null);
    }
  };

  const permanentlyDeleteContact = async (tc: TrashedContact) => {
    if (!(await confirm({ title: "Fshi përgjithmonë", message: `Të fshihet "${tc.name}" përgjithmonë? Ky veprim NUK kthehet mbrapsht.`, danger: true, confirmText: "Fshi përgjithmonë" }))) return;
    setTrashBusyId(tc.id);
    try {
      const res = await fetch(`/api/admin/contacts/${tc.id}?permanent=1`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setTrashedContacts(trashedContacts.filter((c) => c.id !== tc.id));
      }
    } finally {
      setTrashBusyId(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const newStatus = String(over.id);
    const id = Number(active.id);
    const contact = contacts.find((c) => c.id === id);
    if (!contact || (contact.status || "new") === newStatus) return;
    updateContact(id, { status: newStatus });
  };

  return (
    <div>
      {/* Filters */}
      <div className="mb-5 flex flex-wrap gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Kërko emër, email, telefon..."
          className="font-ui min-w-[200px] flex-1 rounded-[10px] border border-[var(--a-border)] bg-transparent px-4 py-2.5 text-[13px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
        />
        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
          className="font-ui rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2.5 text-[13px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
        >
          {services.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          className="font-ui rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2.5 text-[13px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
        >
          {allTags.map((t) => (
            <option key={t} value={t}>{t === "Të gjitha" ? "Të gjitha etiketat" : t}</option>
          ))}
        </select>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="font-ui rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2.5 text-[13px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="font-ui rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2.5 text-[13px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
        />
        <select
          value={followUpFilter}
          onChange={(e) => setFollowUpFilter(e.target.value as typeof followUpFilter)}
          className="font-ui rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2.5 text-[13px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
        >
          <option value="all">Çdo ndjekje</option>
          <option value="none">Pa datë ndjekjeje</option>
          <option value="overdue">Ndjekje e vonuar</option>
          <option value="upcoming">Ndjekje e ardhshme</option>
        </select>
        <button
          onClick={() => downloadContactsCSV(filtered)}
          className="font-ui rounded-[10px] border border-[var(--a-border)] px-4 py-2.5 text-[12px] font-semibold text-[rgb(var(--a-text-rgb)/0.6)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)]"
        >
          ⬇ Export CSV
        </button>
        <div className="flex rounded-[10px] border border-[var(--a-border)]">
          <button
            onClick={() => setViewMode("kanban")}
            className={`font-ui px-4 py-2.5 text-[12px] font-semibold transition-colors ${
              viewMode === "kanban" ? "bg-accent/10 text-accent" : "text-[rgb(var(--a-text-rgb)/0.5)] hover:text-[var(--a-text)]"
            }`}
          >
            📋 Kanban
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={`font-ui border-l border-[var(--a-border)] px-4 py-2.5 text-[12px] font-semibold transition-colors ${
              viewMode === "calendar" ? "bg-accent/10 text-accent" : "text-[rgb(var(--a-text-rgb)/0.5)] hover:text-[var(--a-text)]"
            }`}
          >
            📅 Kalendar
          </button>
        </div>
        <button
          onClick={() => setShowTrash((v) => !v)}
          className={`font-ui rounded-[10px] border px-4 py-2.5 text-[12px] font-semibold transition-colors ${
            showTrash ? "border-accent/50 bg-accent/10 text-accent" : "border-[var(--a-border)] text-[rgb(var(--a-text-rgb)/0.5)] hover:text-[var(--a-text)]"
          }`}
        >
          🗑 Koshi {trashedContacts.length > 0 ? `(${trashedContacts.length})` : ""}
        </button>
      </div>

      {showTrash && (
        <div className="mb-5 rounded-[10px] border border-[var(--a-border)] p-4">
          <p className="mb-3 font-ui text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.4)]">
            Kontakte të fshira — rikthej ose fshi përgjithmonë
          </p>
          {trashedContacts.length === 0 ? (
            <p className="text-[13px] text-[rgb(var(--a-text-rgb)/0.4)]">Koshi është bosh.</p>
          ) : (
            <div className="space-y-2">
              {trashedContacts.map((tc) => (
                <div key={tc.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-[var(--a-border)] px-3 py-2.5">
                  <div>
                    <p className="font-ui text-[13px] font-semibold text-[var(--a-text)]">{tc.name} <span className="text-[rgb(var(--a-text-rgb)/0.4)]">— {tc.service}</span></p>
                    <p className="text-[11px] text-[rgb(var(--a-text-rgb)/0.4)]">{tc.email} · fshirë më {formatDate(tc.deleted_at)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => restoreContact(tc)}
                      disabled={trashBusyId === tc.id}
                      className="font-ui rounded-[10px] border border-accent/40 px-3 py-1.5 text-[11px] font-semibold text-accent transition-colors hover:bg-accent/10 disabled:opacity-50"
                    >
                      ↩ Rikthe
                    </button>
                    <button
                      onClick={() => permanentlyDeleteContact(tc)}
                      disabled={trashBusyId === tc.id}
                      className="font-ui rounded-[10px] border border-red-400/30 px-3 py-1.5 text-[11px] font-semibold text-red-400/80 transition-colors hover:bg-red-400/10 disabled:opacity-50"
                    >
                      Fshi përgjithmonë
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Saved filters */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">Filtra të ruajtur:</span>
        {savedFilters.length === 0 && (
          <span className="text-[12px] text-[rgb(var(--a-text-rgb)/0.3)]">asnjë ende</span>
        )}
        {savedFilters.map((f) => (
          <span key={f.name} className="flex items-center gap-1 rounded-full border border-[var(--a-border)] pl-3 pr-1 py-1 text-[11px]">
            <button onClick={() => applySavedFilter(f)} className="font-ui text-[rgb(var(--a-text-rgb)/0.6)] transition-colors hover:text-accent">
              {f.name}
            </button>
            <button
              onClick={() => deleteSavedFilter(f.name)}
              className="font-ui px-1.5 text-[12px] text-[rgb(var(--a-text-rgb)/0.3)] transition-colors hover:text-red-400"
              aria-label="Fshi filtrin"
            >
              ×
            </button>
          </span>
        ))}
        <button
          onClick={saveCurrentFilter}
          className="font-ui rounded-full border border-accent/40 px-3 py-1 text-[11px] font-semibold text-accent transition-colors hover:bg-accent/10"
        >
          ＋ Ruaj filtrin aktual
        </button>
      </div>

      {/* Bulk actions toolbar */}
      {selected.size > 0 && (
        <div className="mb-5 flex flex-wrap items-center gap-3 rounded-[10px] border border-accent/30 bg-accent/5 px-4 py-3">
          <span className="font-ui text-[12px] text-[rgb(var(--a-text-rgb)/0.7)]">{selected.size} të zgjedhur</span>
          <select
            defaultValue=""
            disabled={bulkBusy}
            onChange={(e) => {
              bulkUpdateStatus(e.target.value);
              e.target.value = "";
            }}
            className="font-ui rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-1.5 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent disabled:opacity-50"
          >
            <option value="" disabled>Ndrysho statusin...</option>
            <option value="new">I ri</option>
            <option value="in-progress">Në proces</option>
            <option value="done">Mbyllur</option>
          </select>
          <button
            onClick={bulkDelete}
            disabled={bulkBusy}
            className="font-ui rounded-[10px] border border-red-400/30 px-4 py-1.5 text-[11px] font-semibold text-red-400/80 transition-colors hover:bg-red-400/10 disabled:opacity-50"
          >
            Fshi të zgjedhurit
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="font-ui text-[11px] text-[rgb(var(--a-text-rgb)/0.4)] transition-colors hover:text-[var(--a-text)]"
          >
            Anulo
          </button>
        </div>
      )}

      {viewMode === "calendar" && <FollowUpCalendar contacts={filtered} onSelectContact={jumpToContact} />}

      {viewMode === "kanban" && (
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="grid gap-4 md:grid-cols-3">
          {STATUS_COLUMNS.map((col) => {
            const items = filtered.filter((c) => (c.status || "new") === col);
            const colValue = items.reduce((sum, c) => sum + (Number(c.value) || 0), 0);
            return (
              <div key={col}>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] ${STATUS_COLORS[col]}`}>
                    {STATUS_LABELS[col]}
                  </h3>
                  <span className="text-[12px] text-[rgb(var(--a-text-rgb)/0.35)]">
                    {colValue > 0 && <span className="mr-2 font-semibold text-accent/80">{formatMoney(colValue)}</span>}
                    {items.length}
                  </span>
                </div>
                <KanbanColumn id={col}>
                  {items.length === 0 && <EmptyState text="Asnjë kontakt." />}
                  {items.map((c) => {
                    const status = c.status || "new";
                    const overdue = isOverdue(c);
                    const score = leadScore(c, duplicateCounts.get(c.email.trim().toLowerCase()) ?? 1);
                    return (
                      <DraggableCard key={c.id} id={c.id}>
                        <div className={CARD}>
                          <div className="flex items-start gap-3 p-5">
                            <input
                              type="checkbox"
                              checked={selected.has(c.id)}
                              onChange={() => toggleSelect(c.id)}
                              onClick={(e) => e.stopPropagation()}
                              className="mt-1.5 accent-accent"
                            />
                            <button
                              onClick={() => {
                                const next = expanded === c.id ? null : c.id;
                                setExpanded(next);
                                if (next !== null) markViewed(c);
                              }}
                              className="flex flex-1 items-center justify-between gap-4 pr-6 text-left"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                  <span className="font-display font-semibold text-[var(--a-text)]">{c.name}</span>
                                  {c.viewed_at ? (
                                    <span className="rounded-full border border-[rgb(var(--a-text-rgb)/0.15)] bg-[rgb(var(--a-text-rgb)/0.05)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[rgb(var(--a-text-rgb)/0.4)]">
                                      ✓ E lexuar
                                    </span>
                                  ) : (
                                    <span className="animate-pulse rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-accent">
                                      🆕 I ri
                                    </span>
                                  )}
                                  <span
                                    title={`Lead score: ${score.score}/100\n${score.reasons.join("\n")}`}
                                    className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${LEAD_LABEL_STYLES[score.label]}`}
                                  >
                                    {LEAD_LABEL_TEXT[score.label]} · {score.score}
                                  </span>
                                  {c.value != null && (
                                    <span className="rounded-full border border-accent/30 bg-accent/8 px-2 py-0.5 text-[10px] font-semibold text-accent">
                                      {formatMoney(Number(c.value))}
                                    </span>
                                  )}
                                  <span className="text-[12px] text-[rgb(var(--a-text-rgb)/0.4)]">{c.email}</span>
                                  {c.discount_code && (
                                    <span className="rounded-full border border-accent/30 bg-accent/8 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-accent">
                                      {c.discount_code}
                                    </span>
                                  )}
                                  {overdue && (
                                    <span className="rounded-full border border-red-400/30 bg-red-400/8 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-red-400">
                                      ⚠ Vonuar
                                    </span>
                                  )}
                                  {(duplicateCounts.get(c.email.trim().toLowerCase()) ?? 1) > 1 && (
                                    <span
                                      title="Ky email ka shkruar më parë"
                                      className="rounded-full border border-blue-400/30 bg-blue-400/8 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-blue-300"
                                    >
                                      🔁 {duplicateCounts.get(c.email.trim().toLowerCase())}×
                                    </span>
                                  )}
                                  {(c.tags ?? []).map((tag) => (
                                    <span key={tag} className="rounded-full border border-[rgb(var(--a-text-rgb)/0.15)] bg-[rgb(var(--a-text-rgb)/0.05)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[rgb(var(--a-text-rgb)/0.55)]">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                                <p className="mt-1 text-[12px] text-[rgb(var(--a-text-rgb)/0.35)]">
                                  {c.service} · {c.budget} · {c.timeline}
                                </p>
                                {(c.assigned_to || c.follow_up_date) && (
                                  <p className="mt-1 text-[11px] text-[rgb(var(--a-text-rgb)/0.3)]">
                                    {c.assigned_to && <>👤 {c.assigned_to}</>}
                                    {c.assigned_to && c.follow_up_date && " · "}
                                    {c.follow_up_date && <>📅 {formatDay(`${c.follow_up_date}T00:00:00`)}</>}
                                  </p>
                                )}
                              </div>
                              <div className="shrink-0 text-right">
                                <p className="text-[11px] text-[rgb(var(--a-text-rgb)/0.3)]">{formatDate(c.created_at)}</p>
                                <span className="text-[11px] text-accent/60">{expanded === c.id ? "Mbyll ▲" : "Hap ▼"}</span>
                              </div>
                            </button>
                          </div>

                          {expanded === c.id && (
                            <div className="border-t border-[var(--a-border)] p-5 text-[13px] leading-relaxed text-[rgb(var(--a-text-rgb)/0.6)]">
                              <p><span className="text-[rgb(var(--a-text-rgb)/0.35)]">Telefon:</span> {c.phone}</p>
                              {c.business_name && <p><span className="text-[rgb(var(--a-text-rgb)/0.35)]">Biznesi:</span> {c.business_name}</p>}
                              {c.source_path && <p><span className="text-[rgb(var(--a-text-rgb)/0.35)]">Erdhi nga faqja:</span> {c.source_path}</p>}
                              <p className="mt-3 whitespace-pre-wrap"><span className="text-[rgb(var(--a-text-rgb)/0.35)]">Mesazhi:</span> {c.message}</p>

                              {/* Quick actions */}
                              <div className="mt-4 flex flex-wrap gap-2">
                                <a href={`tel:${c.phone}`} className="rounded-full border border-[rgb(var(--a-text-rgb)/0.15)] px-3 py-1.5 text-[11px] text-[rgb(var(--a-text-rgb)/0.7)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)]">
                                  📞 Telefono
                                </a>
                                <a href={`mailto:${c.email}`} className="rounded-full border border-[rgb(var(--a-text-rgb)/0.15)] px-3 py-1.5 text-[11px] text-[rgb(var(--a-text-rgb)/0.7)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)]">
                                  ✉️ Email
                                </a>
                                <a href={whatsappHref(c.phone)} target="_blank" rel="noreferrer" className="rounded-full border border-[rgb(var(--a-text-rgb)/0.15)] px-3 py-1.5 text-[11px] text-[rgb(var(--a-text-rgb)/0.7)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)]">
                                  💬 WhatsApp
                                </a>
                                <button
                                  onClick={() => openReply(c)}
                                  className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                                    replyOpenFor === c.id
                                      ? "border-accent/60 bg-accent/10 text-accent"
                                      : "border-accent/40 text-accent hover:bg-accent/10"
                                  }`}
                                >
                                  📨 Përgjigju nga paneli
                                </button>
                                <button
                                  onClick={() => onCreateQuote(c)}
                                  className="rounded-full border border-accent/40 px-3 py-1.5 text-[11px] font-semibold text-accent transition-colors hover:bg-accent/10"
                                >
                                  🧾 Krijo ofertë
                                </button>
                                <button
                                  onClick={() => copyPortalLink(c)}
                                  className="rounded-full border border-[rgb(var(--a-text-rgb)/0.15)] px-3 py-1.5 text-[11px] text-[rgb(var(--a-text-rgb)/0.7)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)]"
                                >
                                  {copiedPortalId === c.id ? "U kopjua ✓" : "🔗 Portal klienti"}
                                </button>
                              </div>

                              {/* Reply composer */}
                              {replyOpenFor === c.id && (
                                <div className="mt-3 rounded-[10px] border border-accent/25 bg-accent/[0.04] p-4">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <label className="text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">
                                      Template:
                                    </label>
                                    {REPLY_TEMPLATES.map((t) => (
                                      <button
                                        key={t.id}
                                        onClick={() => applyTemplate(c, t.id)}
                                        className="font-ui rounded-full border border-[var(--a-border)] px-3 py-1 text-[11px] text-[rgb(var(--a-text-rgb)/0.6)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)]"
                                      >
                                        {t.label}
                                      </button>
                                    ))}
                                  </div>
                                  <input
                                    type="text"
                                    value={replySubject}
                                    onChange={(e) => setReplySubject(e.target.value)}
                                    placeholder="Subjekti"
                                    className="font-ui mt-3 w-full rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
                                  />
                                  <textarea
                                    rows={5}
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    placeholder="Mesazhi..."
                                    className="font-ui mt-2 w-full resize-none rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] leading-relaxed text-[var(--a-text)] outline-none transition-colors focus:border-accent"
                                  />
                                  <div className="mt-2 flex items-center gap-3">
                                    <button
                                      onClick={() => sendReply(c)}
                                      disabled={replySending || !replySubject.trim() || !replyMessage.trim()}
                                      className="font-ui rounded-[10px] bg-accent px-4 py-2 text-[11px] font-bold tracking-[0.5px] text-[#0a0a0a] transition-all hover:shadow-[0_0_16px_rgba(171,131,57,0.4)] disabled:opacity-40"
                                    >
                                      {replySending ? "Duke dërguar…" : `Dërgo te ${c.email}`}
                                    </button>
                                    <button
                                      onClick={() => setReplyOpenFor(null)}
                                      className="font-ui text-[11px] text-[rgb(var(--a-text-rgb)/0.4)] transition-colors hover:text-[var(--a-text)]"
                                    >
                                      Anulo
                                    </button>
                                    {replyResult && (
                                      <span className={`text-[11px] ${replyResult.startsWith("✓") ? "text-emerald-400/80" : "text-red-400/80"}`}>
                                        {replyResult}
                                      </span>
                                    )}
                                  </div>
                                  <p className="mt-2 text-[10px] text-[rgb(var(--a-text-rgb)/0.3)]">
                                    Email-i dërgohet i brenduar nga info@illyrianpixel.com dhe ruhet automatikisht te shënimet.
                                  </p>
                                </div>
                              )}

                              {/* Tags */}
                              <div className="mt-4">
                                <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">Etiketa</label>
                                <div className="flex flex-wrap items-center gap-2">
                                  {(c.tags ?? []).map((tag) => (
                                    <span key={tag} className="flex items-center gap-1.5 rounded-full border border-[rgb(var(--a-text-rgb)/0.15)] bg-[rgb(var(--a-text-rgb)/0.05)] px-2.5 py-1 text-[11px] text-[rgb(var(--a-text-rgb)/0.65)]">
                                      {tag}
                                      <button
                                        onClick={() => removeTag(c, tag)}
                                        disabled={savingId === c.id}
                                        className="text-[rgb(var(--a-text-rgb)/0.35)] transition-colors hover:text-red-400 disabled:opacity-50"
                                        aria-label={`Hiq etiketën ${tag}`}
                                      >
                                        ×
                                      </button>
                                    </span>
                                  ))}
                                  <input
                                    type="text"
                                    value={tagDraft[c.id] ?? ""}
                                    onChange={(e) => setTagDraft((d) => ({ ...d, [c.id]: e.target.value }))}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        addTag(c);
                                      }
                                    }}
                                    placeholder="Shto etiketë..."
                                    className="font-ui w-28 rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-2.5 py-1 text-[11px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
                                  />
                                  <button
                                    onClick={() => addTag(c)}
                                    disabled={savingId === c.id || !(tagDraft[c.id] ?? "").trim()}
                                    className="font-ui rounded-[10px] border border-accent/40 px-2.5 py-1 text-[11px] font-semibold text-accent transition-colors hover:bg-accent/10 disabled:opacity-50"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              {/* Status */}
                              <div className="mt-4">
                                <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">Status</label>
                                <select
                                  value={status}
                                  onChange={(e) => updateContact(c.id, { status: e.target.value })}
                                  disabled={savingId === c.id}
                                  className="font-ui rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent disabled:opacity-50"
                                >
                                  <option value="new">I ri</option>
                                  <option value="in-progress">Në proces</option>
                                  <option value="done">Mbyllur</option>
                                </select>
                              </div>

                              {/* Assigned to + follow-up date + vlera */}
                              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                <div>
                                  <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">Caktuar tek</label>
                                  <input
                                    type="text"
                                    value={assignedDraft[c.id] ?? c.assigned_to ?? ""}
                                    onChange={(e) => setAssignedDraft((d) => ({ ...d, [c.id]: e.target.value }))}
                                    placeholder="p.sh. Ardit"
                                    className="font-ui w-full rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
                                  />
                                </div>
                                <div>
                                  <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">Ndiq më</label>
                                  <input
                                    type="date"
                                    value={followUpDraft[c.id] ?? c.follow_up_date ?? ""}
                                    onChange={(e) => setFollowUpDraft((d) => ({ ...d, [c.id]: e.target.value }))}
                                    className="font-ui w-full rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
                                  />
                                </div>
                                <div>
                                  <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">Vlera e mundshme (€)</label>
                                  <input
                                    type="number"
                                    min="0"
                                    value={valueDraft[c.id] ?? (c.value === null || c.value === undefined ? "" : String(c.value))}
                                    onChange={(e) => setValueDraft((d) => ({ ...d, [c.id]: e.target.value }))}
                                    placeholder="p.sh. 900"
                                    className="font-ui w-full rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
                                  />
                                </div>
                              </div>

                              {/* Notes */}
                              <div className="mt-4">
                                <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">Shënime private</label>

                                {c.notes ? (
                                  <div className="mb-2 rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2">
                                    <p className="whitespace-pre-wrap text-[12px] text-[rgb(var(--a-text-rgb)/0.7)]">{c.notes}</p>
                                    <div className="mt-1.5 flex items-center justify-between">
                                      <span className="text-[10px] text-[rgb(var(--a-text-rgb)/0.3)]">Shënim i vjetër</span>
                                      <button
                                        onClick={() => deleteLegacyNote(c)}
                                        className="font-ui text-[10px] font-semibold text-red-400/70 transition-colors hover:text-red-400"
                                      >
                                        Fshi
                                      </button>
                                    </div>
                                  </div>
                                ) : null}

                                {notesLoading[c.id] ? (
                                  <Skeleton className="h-8 w-full" />
                                ) : (notesList[c.id] ?? []).length > 0 ? (
                                  <ul className="space-y-2">
                                    {(notesList[c.id] ?? []).map((n) => (
                                      <li key={n.id} className="rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2">
                                        {editingNoteId === n.id ? (
                                          <>
                                            <textarea
                                              rows={2}
                                              value={editNoteDraft[n.id] ?? n.text}
                                              onChange={(e) => setEditNoteDraft((d) => ({ ...d, [n.id]: e.target.value }))}
                                              className="font-ui w-full resize-none rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
                                            />
                                            <div className="mt-1.5 flex gap-3">
                                              <button
                                                onClick={() => saveNoteEdit(c.id, n.id)}
                                                disabled={noteBusy === n.id}
                                                className="font-ui text-[10px] font-semibold text-accent transition-colors hover:text-accent/80 disabled:opacity-50"
                                              >
                                                {noteBusy === n.id ? "Duke ruajtur…" : "Ruaj"}
                                              </button>
                                              <button
                                                onClick={() => setEditingNoteId(null)}
                                                className="font-ui text-[10px] font-semibold text-[rgb(var(--a-text-rgb)/0.4)] transition-colors hover:text-[rgb(var(--a-text-rgb)/0.7)]"
                                              >
                                                Anulo
                                              </button>
                                            </div>
                                          </>
                                        ) : (
                                          <>
                                            <p className="whitespace-pre-wrap text-[12px] text-[rgb(var(--a-text-rgb)/0.7)]">{n.text}</p>
                                            <div className="mt-1.5 flex items-center justify-between gap-2">
                                              <span className="text-[10px] text-[rgb(var(--a-text-rgb)/0.35)]">
                                                {formatDate(n.created_at)}
                                                {n.updated_at !== n.created_at ? " (ndryshuar)" : ""}
                                              </span>
                                              <div className="flex gap-2">
                                                <button
                                                  onClick={() => {
                                                    setEditingNoteId(n.id);
                                                    setEditNoteDraft((d) => ({ ...d, [n.id]: n.text }));
                                                  }}
                                                  className="font-ui text-[10px] font-semibold text-[rgb(var(--a-text-rgb)/0.4)] transition-colors hover:text-[rgb(var(--a-text-rgb)/0.7)]"
                                                >
                                                  Edito
                                                </button>
                                                <button
                                                  onClick={() => deleteNote(c.id, n.id)}
                                                  disabled={noteBusy === n.id}
                                                  className="font-ui text-[10px] font-semibold text-red-400/70 transition-colors hover:text-red-400 disabled:opacity-50"
                                                >
                                                  Fshi
                                                </button>
                                              </div>
                                            </div>
                                          </>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                ) : !c.notes ? (
                                  <p className="text-[11px] text-[rgb(var(--a-text-rgb)/0.3)]">Asnjë shënim.</p>
                                ) : null}

                                <div className="mt-2">
                                  <textarea
                                    rows={2}
                                    value={newNoteDraft[c.id] ?? ""}
                                    onChange={(e) => setNewNoteDraft((d) => ({ ...d, [c.id]: e.target.value }))}
                                    placeholder="Shto shënim..."
                                    className="font-ui w-full resize-none rounded-[10px] border border-[var(--a-border)] bg-[var(--a-input)] px-3 py-2 text-[12px] text-[var(--a-text)] outline-none transition-colors focus:border-accent"
                                  />
                                  <button
                                    onClick={() => addNote(c)}
                                    disabled={addingNoteFor === c.id || !(newNoteDraft[c.id] ?? "").trim()}
                                    className="font-ui mt-2 rounded-[10px] border border-accent/40 px-4 py-1.5 text-[11px] font-semibold text-accent transition-colors hover:bg-accent/10 disabled:opacity-50"
                                  >
                                    {addingNoteFor === c.id ? "Duke ruajtur…" : "Shto shënim"}
                                  </button>
                                </div>
                              </div>

                              {/* Bashkëngjitje */}
                              <div className="mt-4">
                                <AttachmentsPanel ownerType="contact" ownerId={c.id} />
                              </div>

                              {/* Veprime */}
                              <div className="mt-4 flex gap-3">
                                <button
                                  onClick={() => saveDetails(c)}
                                  disabled={savingId === c.id}
                                  className="font-ui rounded-[10px] border border-accent/40 px-4 py-1.5 text-[11px] font-semibold text-accent transition-colors hover:bg-accent/10 disabled:opacity-50"
                                >
                                  {savingId === c.id ? "Duke ruajtur…" : "Ruaj"}
                                </button>
                                <button
                                  onClick={() => removeContact(c.id)}
                                  disabled={deletingId === c.id}
                                  className="font-ui rounded-[10px] border border-red-400/30 px-4 py-1.5 text-[11px] font-semibold text-red-400/80 transition-colors hover:bg-red-400/10 disabled:opacity-50"
                                >
                                  {deletingId === c.id ? "Duke fshirë…" : "Fshi kontaktin"}
                                </button>
                              </div>
                              {saveError[c.id] ? (
                                <p className="mt-2 text-[11px] text-red-400/80">{saveError[c.id]}</p>
                              ) : null}

                              {/* History */}
                              <div className="mt-4">
                                <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-[rgb(var(--a-text-rgb)/0.35)]">Historiku</label>
                                {logsLoading[c.id] ? (
                                  <Skeleton className="h-8 w-full" />
                                ) : logs[c.id] && logs[c.id].length > 0 ? (
                                  <ul className="space-y-1.5">
                                    {logs[c.id].map((l) => (
                                      <li key={l.id} className="text-[11px] text-[rgb(var(--a-text-rgb)/0.4)]">
                                        <span className="text-[rgb(var(--a-text-rgb)/0.55)]">
                                          {LOG_ACTION_LABELS[l.action] ? LOG_ACTION_LABELS[l.action](l.detail) : `${l.action}: ${l.detail ?? ""}`}
                                        </span>
                                        {" — "}
                                        {formatDate(l.created_at)}
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-[11px] text-[rgb(var(--a-text-rgb)/0.3)]">Asnjë ndryshim i regjistruar.</p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </DraggableCard>
                    );
                  })}
                </KanbanColumn>
              </div>
            );
          })}
        </div>
      </DndContext>
      )}
      {renderConfirm()}
      {renderUndoToast()}
    </div>
  );
}

// ── Follow-up calendar ──────────────────────────────────────────────────────
const WEEKDAY_LABELS = ["Hën", "Mar", "Mër", "Enj", "Pre", "Sht", "Die"];

function FollowUpCalendar({ contacts, onSelectContact }: { contacts: Contact[]; onSelectContact: (c: Contact) => void }) {
  const [monthOffset, setMonthOffset] = useState(0);

  const { label, weeks, todayStr } = useMemo(() => {
    const base = new Date();
    base.setDate(1);
    base.setMonth(base.getMonth() + monthOffset);
    const year = base.getFullYear();
    const month = base.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    // Monday-first offset (0 = Monday)
    const startOffset = (firstDay.getDay() + 6) % 7;

    const cells: { date: Date; key: string }[] = [];
    for (let i = 0; i < startOffset; i++) {
      const d = new Date(year, month, 1 - (startOffset - i));
      cells.push({ date: d, key: d.toISOString().slice(0, 10) });
    }
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d);
      cells.push({ date, key: date.toISOString().slice(0, 10) });
    }
    while (cells.length % 7 !== 0) {
      const last = cells[cells.length - 1].date;
      const d = new Date(last);
      d.setDate(d.getDate() + 1);
      cells.push({ date: d, key: d.toISOString().slice(0, 10) });
    }

    const weeks: { date: Date; key: string }[][] = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

    return {
      label: base.toLocaleDateString("sq-AL", { month: "long", year: "numeric" }),
      weeks,
      todayStr: new Date().toISOString().slice(0, 10),
    };
  }, [monthOffset]);

  const byDate = useMemo(() => {
    const map = new Map<string, Contact[]>();
    contacts.forEach((c) => {
      if (!c.follow_up_date) return;
      const list = map.get(c.follow_up_date) ?? [];
      list.push(c);
      map.set(c.follow_up_date, list);
    });
    return map;
  }, [contacts]);

  const currentMonth = useMemo(() => {
    const base = new Date();
    base.setDate(1);
    base.setMonth(base.getMonth() + monthOffset);
    return base.getMonth();
  }, [monthOffset]);

  return (
    <div className={CARD + " p-5"}>
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => setMonthOffset((m) => m - 1)}
          className="rounded-[10px] border border-[var(--a-border)] px-3 py-1.5 text-[12px] text-[rgb(var(--a-text-rgb)/0.6)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)]"
        >
          ← Para
        </button>
        <p className="font-display text-[1.1rem] font-semibold capitalize text-[var(--a-text)]">{label}</p>
        <button
          onClick={() => setMonthOffset((m) => m + 1)}
          className="rounded-[10px] border border-[var(--a-border)] px-3 py-1.5 text-[12px] text-[rgb(var(--a-text-rgb)/0.6)] transition-colors hover:border-accent/50 hover:text-[var(--a-text)]"
        >
          Pas →
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {WEEKDAY_LABELS.map((d) => (
          <div key={d} className="text-center text-[10px] font-semibold uppercase tracking-[0.1em] text-[rgb(var(--a-text-rgb)/0.35)]">
            {d}
          </div>
        ))}
        {weeks.flat().map(({ date, key }) => {
          const inMonth = date.getMonth() === currentMonth;
          const items = byDate.get(key) ?? [];
          const isToday = key === todayStr;
          return (
            <div
              key={key}
              className={`min-h-[80px] rounded-[10px] border border-[var(--a-border)] p-1.5 ${
                inMonth ? "" : "opacity-30"
              } ${isToday ? "ring-1 ring-accent/50" : ""}`}
            >
              <p className={`text-[11px] ${isToday ? "font-bold text-accent" : "text-[rgb(var(--a-text-rgb)/0.4)]"}`}>
                {date.getDate()}
              </p>
              <div className="mt-1 space-y-1">
                {items.slice(0, 3).map((c) => {
                  const overdue = isOverdue(c);
                  return (
                    <button
                      key={c.id}
                      onClick={() => onSelectContact(c)}
                      title={`${c.name} · ${c.service}`}
                      className={`block w-full truncate rounded-[10px] px-1.5 py-0.5 text-left text-[10px] transition-colors ${
                        overdue
                          ? "bg-red-400/10 text-red-400 hover:bg-red-400/20"
                          : "bg-accent/10 text-accent hover:bg-accent/20"
                      }`}
                    >
                      {c.name}
                    </button>
                  );
                })}
                {items.length > 3 && (
                  <p className="text-[10px] text-[rgb(var(--a-text-rgb)/0.3)]">+{items.length - 3} më shumë</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

