"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { LinkHistory } from "@/components/dashboard/LinkHistory";
import { toast } from "@/components/ui/Toast";
import { parseUTMUrl } from "@/lib/utils/utm";
import { Download, Upload, X, ChevronLeft, ChevronRight } from "lucide-react";

interface Link {
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
}

interface Client { id: string; name: string; }

const PAGE_SIZE = 20;

export default function HistoricoPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [clientFilter, setClientFilter] = useState("");

  // Import modal
  const [showImport, setShowImport] = useState(false);
  const [importUrl, setImportUrl] = useState("");
  const [importName, setImportName] = useState("");
  const [importClientId, setImportClientId] = useState("");
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

  useEffect(() => { fetchLinks(); }, [fetchLinks]);

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
    const headers = ["Nome", "URL completa", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "Criado em"];
    const rows = links.map((l) => [
      l.name, l.full_url,
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
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Link importado!");
      setShowImport(false);
      setImportUrl(""); setImportName(""); setImportClientId(""); setImportParsed(null);
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
        l.utm_campaign?.toLowerCase().includes(search.toLowerCase()) ||
        l.utm_source?.toLowerCase().includes(search.toLowerCase())
      )
    : links;

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-text mb-1">Histórico</h1>
          <p className="text-muted text-sm">{total} link{total !== 1 ? "s" : ""} salvos</p>
        </div>
        <div className="flex gap-2">
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
            placeholder="Buscar por nome, campanha ou fonte..."
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
        <LinkHistory links={filtered} onDelete={deleteLink} />
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
                onChange={(e) => { setImportUrl(e.target.value); setImportParsed(null); }}
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
                  <Button variant="secondary" className="flex-1" onClick={() => { setImportParsed(null); setImportUrl(""); }}>
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
