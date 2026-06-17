"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { UTMGenerator } from "@/components/utm/UTMGenerator";
import { LinkHistory } from "@/components/dashboard/LinkHistory";
import { BulkActionBar } from "@/components/dashboard/BulkActionBar";
import { MoveToFolderModal } from "@/components/dashboard/MoveToFolderModal";
import { ClientUsersSection } from "@/components/dashboard/ClientUsersSection";
import { CopyButton } from "@/components/ui/CopyButton";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PDFExport } from "@/components/ui/PDFExport";
import { toast } from "@/components/ui/Toast";
import { parseUTMUrl, clientSlug, generateAutoDescription } from "@/lib/utils/utm";
import {
  ArrowLeft,
  Plus,
  Download,
  Pencil,
  Folder,
  FolderPlus,
  X,
  Trash2,
  Upload,
  CheckSquare,
  Sparkles,
} from "lucide-react";

interface LinkRow {
  id: string;
  name: string;
  full_url: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  description: string | null;
  created_at: string;
  client_id: string | null;
  folder_id: string | null;
}

interface FolderRow {
  id: string;
  name: string;
  color: string;
  client_id: string;
  user_id: string;
  parent_id: string | null;
  created_at: string;
}

interface ClientRow {
  id: string;
  name: string;
  color: string;
  email: string | null;
  access_token: string;
  slug: string | null;
  logo_url: string | null;
}

interface Props {
  client: ClientRow;
  initialLinks: LinkRow[];
  initialFolders: FolderRow[];
  portalUrl: string;
}

const FOLDER_COLORS = [
  "#534AB7",
  "#E85D4A",
  "#2E86AB",
  "#27AE60",
  "#F39C12",
  "#8E44AD",
  "#16A085",
  "#C0392B",
];

const COLOR_PRESETS = [
  "#534AB7",
  "#0F6E56",
  "#BA7517",
  "#D85A30",
  "#1E40AF",
  "#9333EA",
  "#0891B2",
];

export function ClientDetailClient({ client: initialClient, initialLinks, initialFolders, portalUrl: initialPortalUrl }: Props) {
  const [client, setClient] = useState<ClientRow>(initialClient);
  const [portalUrl, setPortalUrl] = useState<string>(initialPortalUrl);
  const [links, setLinks] = useState<LinkRow[]>(initialLinks);
  const [folders, setFolders] = useState<FolderRow[]>(initialFolders);

  // Tab ativa: null = "Todos", string = folder id, "none" = sem pasta
  const [activeFolder, setActiveFolder] = useState<string | null>(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [folderParentId, setFolderParentId] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [folderDeleteTarget, setFolderDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Create folder state
  const [folderName, setFolderName] = useState("");
  const [folderColor, setFolderColor] = useState(FOLDER_COLORS[0]);
  const [savingFolder, setSavingFolder] = useState(false);

  // Edit client state
  const [editForm, setEditForm] = useState({
    name: client.name,
    email: client.email ?? "",
    slug: client.slug ?? "",
    color: client.color,
  });
  const [savingEdit, setSavingEdit] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Import state
  const [importUrl, setImportUrl] = useState("");
  const [importName, setImportName] = useState("");
  const [importFolderId, setImportFolderId] = useState("");
  const [importDescription, setImportDescription] = useState("");
  const [importDescriptionTouched, setImportDescriptionTouched] = useState(false);
  const [importParsed, setImportParsed] = useState<ReturnType<typeof parseUTMUrl> | null>(null);
  const [importSaving, setImportSaving] = useState(false);

  // Seleção em lote
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [moveOpen, setMoveOpen] = useState(false);
  const [bulkSaving, setBulkSaving] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [bulkPdfOpen, setBulkPdfOpen] = useState(false);

  async function refreshLinks() {
    const res = await fetch(`/api/links?client_id=${client.id}&page=1`);
    const json = await res.json();
    setLinks(json.data ?? []);
  }

  async function handleDeleteLink() {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await fetch(`/api/links?id=${deleteTarget}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Link excluído.");
      setLinks((prev) => prev.filter((l) => l.id !== deleteTarget));
    } else {
      toast.error("Erro ao excluir link.");
    }
    setDeleting(false);
    setDeleteTarget(null);
  }

  async function handleCreateFolder() {
    if (!folderName.trim()) return;
    setSavingFolder(true);
    const res = await fetch("/api/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: client.id,
        name: folderName.trim(),
        color: folderColor,
        parent_id: folderParentId,
      }),
    });
    const json = await res.json();
    if (res.ok) {
      setFolders((prev) => [...prev, json.data]);
      toast.success(folderParentId ? "Subpasta criada!" : "Pasta criada!");
      setFolderName("");
      setFolderColor(FOLDER_COLORS[0]);
      setShowFolderModal(false);
      setFolderParentId(null);
    } else {
      toast.error(json.error ?? "Erro ao criar pasta.");
    }
    setSavingFolder(false);
  }

  async function handleDeleteFolder() {
    if (!folderDeleteTarget) return;
    setDeleting(true);
    const res = await fetch(`/api/folders?id=${folderDeleteTarget}`, { method: "DELETE" });
    if (res.ok) {
      // Remove a pasta e qualquer subpasta dela
      setFolders((prev) => prev.filter((f) => f.id !== folderDeleteTarget && f.parent_id !== folderDeleteTarget));
      if (activeFolder === folderDeleteTarget) setActiveFolder(null);
      await refreshLinks();
      toast.success("Pasta excluída.");
    } else {
      toast.error("Erro ao excluir pasta.");
    }
    setDeleting(false);
    setFolderDeleteTarget(null);
  }

  function handleImportUrlChange(value: string) {
    setImportUrl(value);
    setImportParsed(null);
    setImportDescription("");
    setImportDescriptionTouched(false);
    if (!importName) setImportName("");
  }

  function handleIdentify() {
    const parsed = parseUTMUrl(importUrl.trim());
    setImportParsed(parsed);
    if (!importName && parsed.campaign) setImportName(parsed.campaign);
    setImportDescriptionTouched(false);
  }

  // Auto-fill da descrição quando parse muda
  useEffect(() => {
    if (!importParsed || importDescriptionTouched) return;
    setImportDescription(
      generateAutoDescription({
        utm_source: importParsed.source ?? null,
        utm_medium: importParsed.medium ?? null,
        utm_campaign: importParsed.campaign ?? null,
        utm_content: importParsed.content ?? null,
        utm_term: importParsed.term ?? null,
      })
    );
  }, [importParsed, importDescriptionTouched]);

  async function handleImportSave() {
    if (!importParsed || !importName.trim()) return;
    setImportSaving(true);
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: importName.trim(),
          base_url: importParsed.baseUrl ?? importUrl.trim(),
          utm_source: importParsed.source || null,
          utm_medium: importParsed.medium || null,
          utm_campaign: importParsed.campaign || null,
          utm_content: importParsed.content || null,
          utm_term: importParsed.term || null,
          full_url: importUrl.trim(),
          client_id: client.id,
          folder_id: importFolderId || null,
          description: importDescription.trim() || null,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Link importado!");
      setShowImportModal(false);
      setImportUrl("");
      setImportName("");
      setImportFolderId("");
      setImportDescription("");
      setImportDescriptionTouched(false);
      setImportParsed(null);
      await refreshLinks();
    } catch {
      toast.error("Erro ao importar link.");
    } finally {
      setImportSaving(false);
    }
  }

  // ─── Seleção em lote ───
  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  function selectAllVisible(ids: string[]) {
    setSelectedIds(new Set(ids));
  }
  function cancelSelection() {
    setSelectionMode(false);
    setSelectedIds(new Set());
  }
  function enterSelectionMode() {
    setSelectionMode(true);
    setSelectedIds(new Set());
  }

  // selectedLinks calculado abaixo após visibleLinks
  async function bulkCopy() {
    const text = links.filter((l) => selectedIds.has(l.id)).map((l) => l.full_url).join("\n");
    await navigator.clipboard.writeText(text);
    toast.success(`${selectedIds.size} link${selectedIds.size !== 1 ? "s" : ""} copiado${selectedIds.size !== 1 ? "s" : ""}!`);
  }
  async function bulkMove(folderId: string | null) {
    setBulkSaving(true);
    try {
      const res = await fetch("/api/links", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds), folder_id: folderId }),
      });
      if (!res.ok) throw new Error();
      toast.success("Links movidos!");
      setMoveOpen(false);
      cancelSelection();
      await refreshLinks();
    } catch {
      toast.error("Erro ao mover links.");
    } finally {
      setBulkSaving(false);
    }
  }
  async function bulkDelete() {
    setBulkSaving(true);
    try {
      const ids = Array.from(selectedIds).join(",");
      const res = await fetch(`/api/links?ids=${ids}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Links excluídos!");
      setBulkDeleteOpen(false);
      cancelSelection();
      await refreshLinks();
    } catch {
      toast.error("Erro ao excluir links.");
    } finally {
      setBulkSaving(false);
    }
  }

  // ──── Edit client ────
  async function handleSaveEdit() {
    if (!editForm.name.trim()) return;
    setSavingEdit(true);
    const res = await fetch("/api/clients", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: client.id,
        name: editForm.name.trim(),
        email: editForm.email.trim() || null,
        slug: editForm.slug.trim() || null,
        color: editForm.color,
      }),
    });
    const json = await res.json();
    if (res.ok) {
      const updated = json.data as ClientRow;
      setClient(updated);
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      setPortalUrl(`${origin}/c/${updated.slug || updated.access_token}`);
      toast.success("Cliente atualizado!");
      setShowEditModal(false);
    } else {
      toast.error(json.error ?? "Erro ao atualizar cliente.");
    }
    setSavingEdit(false);
  }

  async function handleLogoUpload(file: File) {
    setUploadingLogo(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("client_id", client.id);
    const res = await fetch("/api/clients/logo", { method: "POST", body: fd });
    const json = await res.json();
    if (res.ok) {
      setClient((c) => ({ ...c, logo_url: json.logo_url }));
      toast.success("Logo atualizada!");
    } else {
      toast.error(json.error ?? "Erro ao subir logo.");
    }
    setUploadingLogo(false);
  }

  async function handleLogoRemove() {
    const res = await fetch(`/api/clients/logo?client_id=${client.id}`, { method: "DELETE" });
    if (res.ok) {
      setClient((c) => ({ ...c, logo_url: null }));
      toast.success("Logo removida.");
    } else {
      toast.error("Erro ao remover logo.");
    }
  }

  // ─── Filtragem ───
  const topFolders = folders.filter((f) => !f.parent_id);
  const subsByParent = new Map<string, FolderRow[]>();
  for (const f of folders) {
    if (f.parent_id) {
      const arr = subsByParent.get(f.parent_id) ?? [];
      arr.push(f);
      subsByParent.set(f.parent_id, arr);
    }
  }

  const visibleLinks =
    activeFolder === null
      ? links
      : activeFolder === "none"
      ? links.filter((l) => !l.folder_id)
      : links.filter((l) => l.folder_id === activeFolder);

  const activeFolderObj = folders.find((f) => f.id === activeFolder);

  function countDirect(folderId: string) {
    return links.filter((l) => l.folder_id === folderId).length;
  }
  function countWithSubs(folderId: string) {
    const subs = subsByParent.get(folderId) ?? [];
    return countDirect(folderId) + subs.reduce((s, sf) => s + countDirect(sf.id), 0);
  }

  function openCreateSubfolder(parentId: string) {
    setFolderParentId(parentId);
    setFolderName("");
    setFolderColor(FOLDER_COLORS[0]);
    setShowFolderModal(true);
  }
  function openCreateFolder() {
    setFolderParentId(null);
    setFolderName("");
    setFolderColor(FOLDER_COLORS[0]);
    setShowFolderModal(true);
  }

  function openEditModal() {
    setEditForm({
      name: client.name,
      email: client.email ?? "",
      slug: client.slug ?? "",
      color: client.color,
    });
    setShowEditModal(true);
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      {/* Voltar */}
      <Link
        href="/clientes"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-brand transition-colors -mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Clientes
      </Link>

      {/* Header do cliente */}
      <div className="bg-white border border-border rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5 hover:shadow-sm transition-shadow">
        {client.logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={client.logo_url}
            alt={client.name}
            className="w-20 h-20 rounded-2xl object-cover border border-border shrink-0 bg-white"
          />
        ) : (
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shrink-0 shadow-sm"
            style={{ backgroundColor: client.color }}
          >
            {client.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1 text-center sm:text-left min-w-0">
          <h1 className="text-2xl font-bold text-text leading-tight">{client.name}</h1>
          {client.email && <p className="text-muted text-sm mt-1">{client.email}</p>}
          {client.slug && (
            <p className="text-xs text-brand font-mono mt-2 truncate">
              utmrapido.com.br/c/{client.slug}
            </p>
          )}
        </div>
        <Button variant="secondary" size="sm" onClick={openEditModal}>
          <Pencil className="w-3.5 h-3.5" />
          Editar cliente
        </Button>
      </div>

      {/* Portal link */}
      <div className="bg-brand-light border border-[#C4C0F0] rounded-2xl p-5">
        <p className="text-sm font-semibold text-brand mb-1">Link do portal do cliente</p>
        <p className="text-xs text-muted mb-3">
          Envie este link para {client.name}. Ele abre sem precisar de login.
        </p>
        <div className="flex items-center gap-3 bg-white rounded-xl border border-border px-4 py-3">
          <p className="flex-1 text-sm font-mono text-muted truncate">{portalUrl}</p>
          <CopyButton url={portalUrl} label="Copiar link" />
        </div>
      </div>

      {/* Pastas */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-text">Pastas</p>
          <button
            onClick={openCreateFolder}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-brand hover:text-brand-dark bg-brand-light px-3 py-1.5 rounded-lg transition-colors"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            Nova pasta
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveFolder(null)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeFolder === null
                ? "bg-text text-white"
                : "bg-white border border-border text-muted hover:border-brand/40"
            }`}
          >
            Todos ({links.length})
          </button>

          {topFolders.map((folder) => {
            const count = countWithSubs(folder.id);
            const subs = subsByParent.get(folder.id) ?? [];
            return (
              <div key={folder.id} className="flex flex-col gap-1.5">
                <div className="relative group flex items-center">
                  <button
                    onClick={() => setActiveFolder(folder.id)}
                    className={`pl-3 pr-7 py-1.5 rounded-full text-sm font-medium transition-colors inline-flex items-center gap-1.5 ${
                      activeFolder === folder.id
                        ? "text-white"
                        : "bg-white border border-border text-muted hover:border-brand/40"
                    }`}
                    style={activeFolder === folder.id ? { backgroundColor: folder.color } : {}}
                  >
                    <Folder className="w-3.5 h-3.5" />
                    {folder.name} ({count})
                  </button>
                  <button
                    onClick={() => setFolderDeleteTarget(folder.id)}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                    title="Excluir pasta"
                  >
                    <X className={`w-3 h-3 ${activeFolder === folder.id ? "text-white/80" : "text-muted"}`} />
                  </button>
                </div>
                {/* subpastas */}
                {subs.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pl-4">
                    {subs.map((sf) => {
                      const sc = countDirect(sf.id);
                      return (
                        <div key={sf.id} className="relative group flex items-center">
                          <button
                            onClick={() => setActiveFolder(sf.id)}
                            className={`pl-2.5 pr-6 py-1 rounded-full text-xs font-medium transition-colors inline-flex items-center gap-1.5 ${
                              activeFolder === sf.id
                                ? "text-white"
                                : "bg-white border border-border text-muted hover:border-brand/40"
                            }`}
                            style={activeFolder === sf.id ? { backgroundColor: sf.color } : {}}
                          >
                            <span
                              className="inline-block w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: activeFolder === sf.id ? "rgba(255,255,255,0.8)" : sf.color }}
                            />
                            ↳ {sf.name} ({sc})
                          </button>
                          <button
                            onClick={() => setFolderDeleteTarget(sf.id)}
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Excluir subpasta"
                          >
                            <X className={`w-3 h-3 ${activeFolder === sf.id ? "text-white/80" : "text-muted"}`} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
                {/* botão criar subpasta */}
                <button
                  onClick={() => openCreateSubfolder(folder.id)}
                  className="self-start pl-4 text-[10px] uppercase tracking-wider font-semibold text-muted hover:text-brand transition-colors inline-flex items-center gap-1"
                >
                  <Plus className="w-2.5 h-2.5" />
                  subpasta
                </button>
              </div>
            );
          })}

          {links.some((l) => !l.folder_id) && (
            <button
              onClick={() => setActiveFolder("none")}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeFolder === "none"
                  ? "bg-gray-600 text-white"
                  : "bg-white border border-border text-muted hover:border-brand/40"
              }`}
            >
              Sem pasta ({links.filter((l) => !l.folder_id).length})
            </button>
          )}
        </div>
      </div>

      {/* Links */}
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="text-lg font-bold text-text">
            {activeFolder === null
              ? `Links UTM (${links.length})`
              : activeFolder === "none"
              ? `Sem pasta (${visibleLinks.length})`
              : `${activeFolderObj?.name ?? ""} (${visibleLinks.length})`}
          </h2>
          <div className="flex gap-2 flex-wrap">
            {!selectionMode ? (
              <Button variant="secondary" onClick={enterSelectionMode} disabled={visibleLinks.length === 0}>
                <CheckSquare className="w-4 h-4" />
                Selecionar
              </Button>
            ) : (
              <Button variant="ghost" onClick={cancelSelection}>
                <X className="w-4 h-4" />
                Cancelar
              </Button>
            )}
            <PDFExport
              clientName={client.name}
              clientLogoUrl={client.logo_url}
              clientColor={client.color}
              links={visibleLinks}
              folders={folders}
            />
            <Button variant="secondary" onClick={() => setShowImportModal(true)}>
              <Download className="w-4 h-4 rotate-180" />
              Importar link
            </Button>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4" />
              Adicionar link UTM
            </Button>
          </div>
        </div>
        <LinkHistory
          links={visibleLinks}
          onDelete={selectionMode ? undefined : (id) => setDeleteTarget(id)}
          selectionMode={selectionMode}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
        />
      </div>

      {/* Usuários do cliente */}
      <ClientUsersSection clientId={client.id} clientName={client.name} />

      {/* Bulk action bar */}
      {selectionMode && (
        <BulkActionBar
          count={selectedIds.size}
          totalCount={visibleLinks.length}
          onSelectAll={() => selectAllVisible(visibleLinks.map((l) => l.id))}
          onCancel={cancelSelection}
          onCopyAll={bulkCopy}
          onMoveToFolder={() => setMoveOpen(true)}
          onExportPDF={() => setBulkPdfOpen(true)}
          onDelete={() => setBulkDeleteOpen(true)}
        />
      )}

      <MoveToFolderModal
        open={moveOpen}
        onClose={() => setMoveOpen(false)}
        folders={folders}
        count={selectedIds.size}
        saving={bulkSaving}
        onConfirm={(folderId) => bulkMove(folderId)}
      />

      {bulkDeleteOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setBulkDeleteOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 flex flex-col gap-5" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-red-50 text-danger flex items-center justify-center mb-3">
                <Trash2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-text mb-2">
                Excluir {selectedIds.size} link{selectedIds.size !== 1 ? "s" : ""}?
              </h2>
              <p className="text-muted text-sm">Esta ação não pode ser desfeita.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setBulkDeleteOpen(false)}>
                Cancelar
              </Button>
              <Button variant="danger" className="flex-1" loading={bulkSaving} onClick={bulkDelete}>
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}

      {bulkPdfOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setBulkPdfOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 flex flex-col gap-5" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-text">
              Exportar {selectedIds.size} link{selectedIds.size !== 1 ? "s" : ""}
            </h2>
            <p className="text-muted text-sm">PDF apenas dos links selecionados.</p>
            <PDFExport
              clientName={client.name}
              clientLogoUrl={client.logo_url}
              clientColor={client.color}
              links={links.filter((l) => selectedIds.has(l.id))}
              folders={folders}
            />
            <Button variant="ghost" onClick={() => setBulkPdfOpen(false)}>Fechar</Button>
          </div>
        </div>
      )}

      {/* ── MODAL: Editar cliente ── */}
      {showEditModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full my-8 p-6 flex flex-col gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-text">Editar cliente</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-muted hover:text-text p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Logo */}
            <div>
              <label className="text-sm font-medium text-text block mb-2">Logo</label>
              <div className="flex items-center gap-4">
                {client.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={client.logo_url}
                    alt=""
                    className="w-16 h-16 rounded-xl object-cover border border-border bg-white"
                  />
                ) : (
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-xl shrink-0"
                    style={{ backgroundColor: editForm.color }}
                  >
                    {editForm.name.charAt(0).toUpperCase() || "?"}
                  </div>
                )}
                <div className="flex flex-col gap-2 flex-1">
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleLogoUpload(f);
                      e.target.value = "";
                    }}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    loading={uploadingLogo}
                    onClick={() => logoInputRef.current?.click()}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    {client.logo_url ? "Trocar logo" : "Enviar logo"}
                  </Button>
                  {client.logo_url && (
                    <Button variant="ghost" size="sm" onClick={handleLogoRemove}>
                      <Trash2 className="w-3.5 h-3.5" />
                      Remover
                    </Button>
                  )}
                  <p className="text-xs text-muted">PNG, JPG, WebP ou SVG · máx 2MB</p>
                </div>
              </div>
            </div>

            <Input
              label="Nome do cliente *"
              value={editForm.name}
              onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
            />

            <Input
              label="E-mail"
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
            />

            <Input
              label="URL personalizada (slug)"
              value={editForm.slug}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, slug: clientSlug(e.target.value) }))
              }
              hint={`Portal: utmrapido.com.br/c/${editForm.slug || client.access_token}`}
            />

            <div>
              <label className="text-sm font-medium text-text block mb-2">Cor</label>
              <div className="flex gap-2 flex-wrap">
                {COLOR_PRESETS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setEditForm((f) => ({ ...f, color }))}
                    className={`w-8 h-8 rounded-lg transition-all ${
                      editForm.color === color
                        ? "ring-2 ring-offset-2 ring-brand scale-110"
                        : "hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setShowEditModal(false)}>
                Cancelar
              </Button>
              <Button
                className="flex-1"
                loading={savingEdit}
                disabled={!editForm.name.trim()}
                onClick={handleSaveEdit}
              >
                Salvar alterações
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Nova pasta / subpasta ── */}
      {showFolderModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowFolderModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 flex flex-col gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-text">
                {folderParentId ? "Nova subpasta" : "Nova pasta"}
              </h2>
              <button
                onClick={() => setShowFolderModal(false)}
                className="text-muted hover:text-text p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {folderParentId && (
              <p className="text-xs text-muted">
                Dentro de{" "}
                <strong className="text-text">
                  {folders.find((f) => f.id === folderParentId)?.name}
                </strong>
              </p>
            )}
            <Input
              label="Nome da pasta"
              placeholder={folderParentId ? "ex: Junho, Verão 2025" : "ex: Google Ads, Conta Principal"}
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />
            <div>
              <p className="text-sm font-medium text-text mb-2">Cor</p>
              <div className="flex gap-2 flex-wrap">
                {FOLDER_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFolderColor(c)}
                    className={`w-7 h-7 rounded-full transition-transform ${
                      folderColor === c
                        ? "scale-125 ring-2 ring-offset-1 ring-gray-400"
                        : "hover:scale-110"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setShowFolderModal(false)}>
                Cancelar
              </Button>
              <Button
                className="flex-1"
                loading={savingFolder}
                disabled={!folderName.trim()}
                onClick={handleCreateFolder}
              >
                Criar {folderParentId ? "subpasta" : "pasta"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Adicionar link UTM ── */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 p-6 flex flex-col gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-text">Novo link UTM</h2>
                <p className="text-xs text-muted mt-0.5">
                  Será salvo para <strong>{client.name}</strong>
                  {activeFolderObj ? (
                    <>
                      {" "}
                      · pasta <strong>{activeFolderObj.name}</strong>
                    </>
                  ) : null}
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-muted hover:text-text p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <UTMGenerator
              isLoggedIn
              isPro
              clients={[{ id: client.id, name: client.name }]}
              selectedClientId={client.id}
              folders={folders}
              selectedFolderId={activeFolderObj?.id ?? ""}
              onSaved={() => {
                setShowAddModal(false);
                refreshLinks();
                toast.success("Link adicionado!");
              }}
            />
          </div>
        </div>
      )}

      {/* ── MODAL: Importar link UTM ── */}
      {showImportModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto"
          onClick={() => setShowImportModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8 p-6 flex flex-col gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-text">Importar link UTM</h2>
                <p className="text-xs text-muted mt-0.5">
                  Cole uma URL com parâmetros UTM para importar
                </p>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-muted hover:text-text p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-sm font-medium text-text block mb-1.5">
                URL completa com UTM
              </label>
              <textarea
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm font-mono text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand resize-none"
                rows={3}
                placeholder="https://seusite.com.br?utm_source=meta&utm_medium=cpc&utm_campaign=junho"
                value={importUrl}
                onChange={(e) => handleImportUrlChange(e.target.value)}
              />
            </div>

            {!importParsed && (
              <Button
                onClick={handleIdentify}
                disabled={!importUrl.trim()}
                variant="secondary"
              >
                Identificar parâmetros
              </Button>
            )}

            {importParsed && (
              <>
                <div className="bg-gray-50 rounded-xl border border-border p-4 flex flex-col gap-2">
                  <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">
                    Parâmetros identificados
                  </p>
                  {[
                    { label: "utm_source", value: importParsed.source },
                    { label: "utm_medium", value: importParsed.medium },
                    { label: "utm_campaign", value: importParsed.campaign },
                    { label: "utm_content", value: importParsed.content },
                    { label: "utm_term", value: importParsed.term },
                  ]
                    .filter((p) => p.value)
                    .map((p) => (
                      <div key={p.label} className="flex gap-2 text-sm">
                        <span className="font-mono text-brand w-36 shrink-0">{p.label}</span>
                        <span className="text-text">{p.value}</span>
                      </div>
                    ))}
                  {!importParsed.source && !importParsed.medium && !importParsed.campaign && (
                    <p className="text-sm text-muted">Nenhum parâmetro UTM detectado nesta URL.</p>
                  )}
                </div>

                <Input
                  label="Nome do link (para o histórico)"
                  placeholder="ex: Meta Ads — Junho — Banner"
                  value={importName}
                  onChange={(e) => setImportName(e.target.value)}
                />

                <div>
                  <label className="text-sm font-medium text-text block mb-1.5">Descrição (opcional)</label>
                  <textarea
                    className="w-full border border-border rounded-xl px-3 py-2.5 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand resize-none"
                    rows={3}
                    placeholder="Ex: Link enviado no grupo de WhatsApp para a campanha de lançamento do ebook"
                    value={importDescription}
                    onChange={(e) => {
                      setImportDescription(e.target.value);
                      setImportDescriptionTouched(true);
                    }}
                  />
                  <div className="flex items-center justify-between gap-2 mt-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        if (!importParsed) return;
                        const suggestion = generateAutoDescription({
                          utm_source: importParsed.source ?? null,
                          utm_medium: importParsed.medium ?? null,
                          utm_campaign: importParsed.campaign ?? null,
                          utm_content: importParsed.content ?? null,
                          utm_term: importParsed.term ?? null,
                        });
                        if (suggestion) {
                          setImportDescription(suggestion);
                          setImportDescriptionTouched(false);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-brand hover:text-brand-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      disabled={!importParsed?.source && !importParsed?.medium && !importParsed?.campaign}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Gerar descrição automática
                    </button>
                    {!importDescriptionTouched && importDescription && (
                      <span className="text-xs text-muted">
                        Sugestão automática — você pode editar.
                      </span>
                    )}
                  </div>
                </div>

                {folders.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-text block mb-1.5">
                      Pasta (opcional)
                    </label>
                    <select
                      className="w-full border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                      value={importFolderId}
                      onChange={(e) => setImportFolderId(e.target.value)}
                    >
                      <option value="">Sem pasta</option>
                      {folders.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.parent_id ? "  ↳ " : ""}
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => {
                      setImportParsed(null);
                      setImportUrl("");
                      setImportDescription("");
                      setImportDescriptionTouched(false);
                    }}
                  >
                    Limpar
                  </Button>
                  <Button
                    className="flex-1"
                    loading={importSaving}
                    disabled={!importName.trim()}
                    onClick={handleImportSave}
                  >
                    Salvar link importado
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── MODAL: Confirmar exclusão de link ── */}
      {deleteTarget && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 flex flex-col gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-red-50 text-danger flex items-center justify-center mb-3">
                <Trash2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-text mb-2">Excluir link?</h2>
              <p className="text-muted text-sm">Esta ação não pode ser desfeita.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setDeleteTarget(null)}>
                Cancelar
              </Button>
              <Button variant="danger" className="flex-1" loading={deleting} onClick={handleDeleteLink}>
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Confirmar exclusão de pasta ── */}
      {folderDeleteTarget && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setFolderDeleteTarget(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 flex flex-col gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-red-50 text-danger flex items-center justify-center mb-3">
                <Folder className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-text mb-2">Excluir pasta?</h2>
              <p className="text-muted text-sm">
                Subpastas e links não serão excluídos — ficarão sem pasta.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setFolderDeleteTarget(null)}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                loading={deleting}
                onClick={handleDeleteFolder}
              >
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
