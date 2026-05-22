"use client";

import { useState } from "react";
import Link from "next/link";
import { UTMGenerator } from "@/components/utm/UTMGenerator";
import { LinkHistory } from "@/components/dashboard/LinkHistory";
import { CopyButton } from "@/components/ui/CopyButton";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PDFExport } from "@/components/ui/PDFExport";
import { toast } from "@/components/ui/Toast";
import { parseUTMUrl } from "@/lib/utils/utm";

interface LinkRow {
  id: string;
  name: string;
  full_url: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
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
  created_at: string;
}

interface Props {
  client: { id: string; name: string; color: string; email: string | null; access_token: string };
  initialLinks: LinkRow[];
  initialFolders: FolderRow[];
  portalUrl: string;
}

const FOLDER_COLORS = [
  "#534AB7", "#E85D4A", "#2E86AB", "#27AE60",
  "#F39C12", "#8E44AD", "#16A085", "#C0392B",
];

export function ClientDetailClient({ client, initialLinks, initialFolders, portalUrl }: Props) {
  const [links, setLinks] = useState<LinkRow[]>(initialLinks);
  const [folders, setFolders] = useState<FolderRow[]>(initialFolders);

  // Tab ativa: null = "Todos", string = folder id, "none" = sem pasta
  const [activeFolder, setActiveFolder] = useState<string | null>(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [folderDeleteTarget, setFolderDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Create folder state
  const [folderName, setFolderName] = useState("");
  const [folderColor, setFolderColor] = useState(FOLDER_COLORS[0]);
  const [savingFolder, setSavingFolder] = useState(false);

  // Import state
  const [importUrl, setImportUrl] = useState("");
  const [importName, setImportName] = useState("");
  const [importFolderId, setImportFolderId] = useState("");
  const [importParsed, setImportParsed] = useState<ReturnType<typeof parseUTMUrl> | null>(null);
  const [importSaving, setImportSaving] = useState(false);

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
      body: JSON.stringify({ client_id: client.id, name: folderName.trim(), color: folderColor }),
    });
    const json = await res.json();
    if (res.ok) {
      setFolders((prev) => [...prev, json.data]);
      toast.success("Pasta criada!");
      setFolderName("");
      setFolderColor(FOLDER_COLORS[0]);
      setShowFolderModal(false);
    } else {
      toast.error("Erro ao criar pasta.");
    }
    setSavingFolder(false);
  }

  async function handleDeleteFolder() {
    if (!folderDeleteTarget) return;
    setDeleting(true);
    const res = await fetch(`/api/folders?id=${folderDeleteTarget}`, { method: "DELETE" });
    if (res.ok) {
      setFolders((prev) => prev.filter((f) => f.id !== folderDeleteTarget));
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
    if (!importName) setImportName("");
  }

  function handleIdentify() {
    const parsed = parseUTMUrl(importUrl.trim());
    setImportParsed(parsed);
    if (!importName && parsed.campaign) setImportName(parsed.campaign);
  }

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
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Link importado!");
      setShowImportModal(false);
      setImportUrl("");
      setImportName("");
      setImportFolderId("");
      setImportParsed(null);
      await refreshLinks();
    } catch {
      toast.error("Erro ao importar link.");
    } finally {
      setImportSaving(false);
    }
  }

  // Filter links by active tab
  const visibleLinks = activeFolder === null
    ? links
    : activeFolder === "none"
      ? links.filter((l) => !l.folder_id)
      : links.filter((l) => l.folder_id === activeFolder);

  const activeFolderObj = folders.find((f) => f.id === activeFolder);

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/clientes" className="text-muted hover:text-brand transition-colors text-sm mt-1">
          ← Clientes
        </Link>
        <div className="flex-1 flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shrink-0"
            style={{ backgroundColor: client.color }}
          >
            {client.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text">{client.name}</h1>
            {client.email && <p className="text-muted text-sm">{client.email}</p>}
          </div>
        </div>
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
            onClick={() => setShowFolderModal(true)}
            className="text-xs font-medium text-brand hover:text-brand-dark bg-brand-light px-3 py-1.5 rounded-lg transition-colors"
          >
            + Nova pasta
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Tab Todos */}
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

          {/* Tabs de pastas */}
          {folders.map((folder) => {
            const count = links.filter((l) => l.folder_id === folder.id).length;
            return (
              <div key={folder.id} className="relative group">
                <button
                  onClick={() => setActiveFolder(folder.id)}
                  className={`pl-3 pr-7 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeFolder === folder.id
                      ? "text-white"
                      : "bg-white border border-border text-muted hover:border-brand/40"
                  }`}
                  style={activeFolder === folder.id ? { backgroundColor: folder.color } : {}}
                >
                  <span
                    className="inline-block w-2 h-2 rounded-full mr-1.5"
                    style={{ backgroundColor: activeFolder === folder.id ? "rgba(255,255,255,0.6)" : folder.color }}
                  />
                  {folder.name} ({count})
                </button>
                <button
                  onClick={() => setFolderDeleteTarget(folder.id)}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-white/70 hover:text-white text-xs leading-none transition-opacity"
                  title="Excluir pasta"
                >
                  ×
                </button>
              </div>
            );
          })}

          {/* Tab sem pasta */}
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
            <PDFExport clientName={client.name} links={visibleLinks} />
            <Button variant="secondary" onClick={() => setShowImportModal(true)}>
              ↓ Importar link
            </Button>
            <Button onClick={() => setShowAddModal(true)}>
              + Adicionar link UTM
            </Button>
          </div>
        </div>
        <LinkHistory links={visibleLinks} onDelete={(id) => setDeleteTarget(id)} />
      </div>

      {/* ── MODAL: Nova pasta ── */}
      {showFolderModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowFolderModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 flex flex-col gap-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-text">Nova pasta</h2>
              <button onClick={() => setShowFolderModal(false)} className="text-muted hover:text-text text-xl">×</button>
            </div>
            <Input
              label="Nome da pasta"
              placeholder="ex: Google Ads, Conta Principal, Verão 2025"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />
            <div>
              <p className="text-sm font-medium text-text mb-2">Cor</p>
              <div className="flex gap-2 flex-wrap">
                {FOLDER_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setFolderColor(c)}
                    className={`w-7 h-7 rounded-full transition-transform ${folderColor === c ? "scale-125 ring-2 ring-offset-1 ring-gray-400" : "hover:scale-110"}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setShowFolderModal(false)}>Cancelar</Button>
              <Button className="flex-1" loading={savingFolder} disabled={!folderName.trim()} onClick={handleCreateFolder}>
                Criar pasta
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Adicionar link UTM ── */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 p-6 flex flex-col gap-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-text">Novo link UTM</h2>
                <p className="text-xs text-muted mt-0.5">
                  Será salvo para <strong>{client.name}</strong>
                  {activeFolderObj ? <> · pasta <strong>{activeFolderObj.name}</strong></> : null}
                </p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-muted hover:text-text text-xl leading-none">×</button>
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={() => setShowImportModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8 p-6 flex flex-col gap-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-text">Importar link UTM</h2>
                <p className="text-xs text-muted mt-0.5">Cole uma URL com parâmetros UTM para importar</p>
              </div>
              <button onClick={() => setShowImportModal(false)} className="text-muted hover:text-text text-xl leading-none">×</button>
            </div>

            <div>
              <label className="text-sm font-medium text-text block mb-1.5">URL completa com UTM</label>
              <textarea
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm font-mono text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand resize-none"
                rows={3}
                placeholder="https://seusite.com.br?utm_source=meta&utm_medium=cpc&utm_campaign=junho"
                value={importUrl}
                onChange={(e) => handleImportUrlChange(e.target.value)}
              />
            </div>

            {!importParsed && (
              <Button onClick={handleIdentify} disabled={!importUrl.trim()} variant="secondary">
                Identificar parâmetros
              </Button>
            )}

            {importParsed && (
              <>
                <div className="bg-gray-50 rounded-xl border border-border p-4 flex flex-col gap-2">
                  <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">Parâmetros identificados</p>
                  {[
                    { label: "utm_source", value: importParsed.source },
                    { label: "utm_medium", value: importParsed.medium },
                    { label: "utm_campaign", value: importParsed.campaign },
                    { label: "utm_content", value: importParsed.content },
                    { label: "utm_term", value: importParsed.term },
                  ].filter((p) => p.value).map((p) => (
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

                {folders.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-text block mb-1.5">Pasta (opcional)</label>
                    <select
                      className="w-full border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                      value={importFolderId}
                      onChange={(e) => setImportFolderId(e.target.value)}
                    >
                      <option value="">Sem pasta</option>
                      {folders.map((f) => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button variant="secondary" className="flex-1" onClick={() => { setImportParsed(null); setImportUrl(""); }}>
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setDeleteTarget(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 flex flex-col gap-5" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="text-4xl mb-3">🗑️</div>
              <h2 className="text-lg font-bold text-text mb-2">Excluir link?</h2>
              <p className="text-muted text-sm">Esta ação não pode ser desfeita.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
              <Button variant="danger" className="flex-1" loading={deleting} onClick={handleDeleteLink}>Excluir</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Confirmar exclusão de pasta ── */}
      {folderDeleteTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setFolderDeleteTarget(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 flex flex-col gap-5" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="text-4xl mb-3">📁</div>
              <h2 className="text-lg font-bold text-text mb-2">Excluir pasta?</h2>
              <p className="text-muted text-sm">Os links desta pasta não serão excluídos — ficarão sem pasta.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setFolderDeleteTarget(null)}>Cancelar</Button>
              <Button variant="danger" className="flex-1" loading={deleting} onClick={handleDeleteFolder}>Excluir</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
