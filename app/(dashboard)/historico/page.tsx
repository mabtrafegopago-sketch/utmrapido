"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { LinkHistory } from "@/components/dashboard/LinkHistory";
import { BulkActionBar } from "@/components/dashboard/BulkActionBar";
import { MoveToFolderModal } from "@/components/dashboard/MoveToFolderModal";
import { PDFExport } from "@/components/ui/PDFExport";
import { toast } from "@/components/ui/Toast";
import { parseUTMUrl, generateAutoDescription } from "@/lib/utils/utm";
import { Download, Upload, X, ChevronLeft, ChevronRight, CheckSquare, Sparkles, Trash2 } from "lucide-react";

interface Link {
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

interface Client { id: string; name: string; }
interface FolderRow {
  id: string;
  name: string;
  color: string;
  parent_id: string | null;
  client_id: string;
}

const PAGE_SIZE = 20;

export default function HistoricoPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [folders, setFolders] = useState<FolderRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [clientFilter, setClientFilter] = useState("");

  // Seleção em lote
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [moveOpen, setMoveOpen] = useState(false);
  const [bulkSaving, setBulkSaving] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [bulkPdfOpen, setBulkPdfOpen] = useState(false);

  // Import modal
  const [showImport, setShowImport] = useState(false);
  const [importUrl, setImportUrl] = useState("");
  const [importName, setImportName] = useState("");
  const [importClientId, setImportClientId] = useState("");
  const [importDescription, setImportDescription] = useState("");
  const [importDescriptionTouched, setImportDescriptionTouched] = useState(false);
  const [importParsed, setImportParsed] = useState<ReturnType<typeof parseUTMUrl> | null>(null);
  const [importSaving, setImportSaving] = useState(false);

  const fetchLinks = useCallback(async () => {
    setLoading(true);
    const qs = new URLSearchParams({ page: String(page) });
    if (clientFilter) qs.set("client_id", clientFilter);
    const res = await fetch(`/api/links?${qs}`);
    const json = await res.json();
    setLinks(json.data ?? []);
    setTotal(json.count ?? 0);
    setLoading(false);
  }, [page, clientFilter]);

  useEffect(() => {
    fetch("/api/clients")
      .then((r) => r.json())
      .then((j) => setClients(j.data ?? []));
  }, []);

  // Carrega pastas de todos os clientes (para o modal de mover)
  useEffect(() => {
    async function loadAllFolders() {
      if (clients.length === 0) {
        setFolders([]);
        return;
      }
      const results = await Promise.all(
        clients.map((c) =>
          fetch(`/api/folders?client_id=${c.id}`)
            .then((r) => r.json())
            .then((j) => (j.data ?? []) as FolderRow[])
            .catch(() => [] as FolderRow[])
        )
      );
      setFolders(results.flat());
    }
    loadAllFolders();
  }, [clients]);

  useEffect(() => { fetchLinks(); }, [fetchLinks]);

  // Auto-fill description on import
  useEffect(() => {
    if (!importParsed) return;
    if (importDescriptionTouched) return;
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

  async function deleteLink(id: string) {
    const res = await fetch(`/api/links?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Link excluído.");
      fetchLinks();
    } else {
      toast.error("Erro ao excluir link.");
    }
  }

  function exportCSV() {
    if (links.length === 0) return;
    const headers = ["Nome", "Descrição", "URL completa", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "Criado em"];
    const rows = links.map((l) => [
      l.name, l.description ?? "", l.full_url,
      l.utm_source ?? "", l.utm_medium ?? "", l.utm_campaign ?? "",
      l.utm_content ?? "", l.utm_term ?? "",
      new Date(l.created_at).toLocaleDateString("pt-BR"),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `utm_rapido_links_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleIdentify() {
    const parsed = parseUTMUrl(importUrl.trim());
    setImportParsed(parsed);
    if (!importName && parsed.campaign) setImportName(parsed.campaign);
    setImportDescriptionTouched(false);
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
          client_id: importClientId || null,
          description: importDescription.trim() || null,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Link importado!");
      setShowImport(false);
      setImportUrl(""); setImportName(""); setImportClientId("");
      setImportDescription(""); setImportDescriptionTouched(false);
      setImportParsed(null);
      fetchLinks();
    } catch {
      toast.error("Erro ao importar link.");
    } finally {
      setImportSaving(false);
    }
  }

  const filtered = search
    ? links.filter((l) =>
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.description?.toLowerCase().includes(search.toLowerCase()) ||
        l.utm_campaign?.toLowerCase().includes(search.toLowerCase()) ||
        l.utm_source?.toLowerCase().includes(search.toLowerCase())
      )
    : links;

  const totalPages = Math.ceil(total / PAGE_SIZE);

  // ─── Seleção em lote ───
  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAll() {
    setSelectedIds(new Set(filtered.map((l) => l.id)));
  }

  function cancelSelection() {
    setSelectionMode(false);
    setSelectedIds(new Set());
  }

  function enterSelectionMode() {
    setSelectionMode(true);
    setSelectedIds(new Set());
  }

  const selectedLinks = useMemo(
    () => links.filter((l) => selectedIds.has(l.id)),
    [links, selectedIds]
  );

  async function bulkCopy() {
    const text = selectedLinks.map((l) => l.full_url).join("\n");
    await navigator.clipboard.writeText(text);
    toast.success(`${selectedLinks.length} link${selectedLinks.length !== 1 ? "s" : ""} copiado${selectedLinks.length !== 1 ? "s" : ""}!`);
  }

  async function bulkMove(folderId: string | null, targetClientId?: string | null) {
    setBulkSaving(true);
    try {
      const body: Record<string, unknown> = {
        ids: Array.from(selectedIds),
        folder_id: folderId,
      };
      if (targetClientId !== undefined) body.client_id = targetClientId;
      const res = await fetch("/api/links", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      toast.success("Links movidos!");
      setMoveOpen(false);
      cancelSelection();
      fetchLinks();
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
      fetchLinks();
    } catch {
      toast.error("Erro ao excluir links.");
    } finally {
      setBulkSaving(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-20">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-text mb-1">Histórico</h1>
          <p className="text-muted text-sm">{total} link{total !== 1 ? "s" : ""} salvos</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {!selectionMode ? (
            <Button variant="secondary" onClick={enterSelectionMode} disabled={links.length === 0}>
              <CheckSquare className="w-4 h-4" />
              Selecionar
            </Button>
          ) : (
            <Button variant="ghost" onClick={cancelSelection}>
              <X className="w-4 h-4" />
              Cancelar seleção
            </Button>
          )}
          <Button variant="secondary" onClick={() => setShowImport(true)}>
            <Upload className="w-4 h-4" />
            Importar link
          </Button>
          <Button variant="secondary" onClick={exportCSV} disabled={links.length === 0}>
            <Download className="w-4 h-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-48">
          <Input
            placeholder="Buscar por nome, descrição, campanha ou fonte..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {clients.length > 0 && (
          <div className="w-48">
            <Select
              options={clients.map((c) => ({ value: c.id, label: c.name }))}
              placeholder="Todos os clientes"
              value={clientFilter}
              onChange={(e) => { setClientFilter(e.target.value); setPage(1); }}
            />
          </div>
        )}
        {(search || clientFilter) && (
          <Button variant="ghost" onClick={() => { setSearch(""); setClientFilter(""); setPage(1); }}>
            Limpar filtros
          </Button>
        )}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-border p-4 h-20 animate-pulse" />
          ))}
        </div>
      ) : (
        <LinkHistory
          links={filtered}
          onDelete={selectionMode ? undefined : deleteLink}
          selectionMode={selectionMode}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="ghost" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </Button>
          <span className="text-sm text-muted">{page} / {totalPages}</span>
          <Button variant="ghost" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
            Próxima
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Bulk action bar */}
      {selectionMode && (
        <BulkActionBar
          count={selectedIds.size}
          totalCount={filtered.length}
          onSelectAll={selectAll}
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
        clients={clients}
        showClientSelect
        count={selectedIds.size}
        saving={bulkSaving}
        onConfirm={bulkMove}
      />

      {/* Confirmação de exclusão em lote */}
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

      {/* PDF dos selecionados */}
      {bulkPdfOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setBulkPdfOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 flex flex-col gap-5" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-text">
              Exportar {selectedIds.size} link{selectedIds.size !== 1 ? "s" : ""} em PDF
            </h2>
            <p className="text-muted text-sm">Será gerado um PDF apenas com os links selecionados.</p>
            <PDFExport
              clientName="Histórico de Links"
              links={selectedLinks}
            />
            <Button variant="ghost" onClick={() => setBulkPdfOpen(false)}>
              Fechar
            </Button>
          </div>
        </div>
      )}

      {/* ── MODAL: Importar link UTM ── */}
      {showImport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={() => setShowImport(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8 p-6 flex flex-col gap-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-text">Importar link UTM</h2>
                <p className="text-xs text-muted mt-0.5">Cole uma URL com parâmetros UTM para importar</p>
              </div>
              <button onClick={() => setShowImport(false)} className="text-muted hover:text-text p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-sm font-medium text-text block mb-1.5">URL completa com UTM</label>
              <textarea
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm font-mono text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand resize-none"
                rows={3}
                placeholder="https://seusite.com.br?utm_source=meta&utm_medium=cpc&utm_campaign=junho"
                value={importUrl}
                onChange={(e) => {
                  setImportUrl(e.target.value);
                  setImportParsed(null);
                  setImportDescription("");
                  setImportDescriptionTouched(false);
                }}
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

                {/* Descrição automática */}
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

                {clients.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-text block mb-1.5">Cliente (opcional)</label>
                    <select
                      className="w-full border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                      value={importClientId}
                      onChange={(e) => setImportClientId(e.target.value)}
                    >
                      <option value="">Sem cliente</option>
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button variant="secondary" className="flex-1" onClick={() => {
                    setImportParsed(null); setImportUrl(""); setImportDescription(""); setImportDescriptionTouched(false);
                  }}>
                    Limpar
                  </Button>
                  <Button className="flex-1" loading={importSaving} disabled={!importName.trim()} onClick={handleImportSave}>
                    Salvar link importado
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
