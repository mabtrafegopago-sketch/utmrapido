"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { LinkHistory } from "@/components/dashboard/LinkHistory";
import { toast } from "@/components/ui/Toast";

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
      l.name,
      l.full_url,
      l.utm_source ?? "",
      l.utm_medium ?? "",
      l.utm_campaign ?? "",
      l.utm_content ?? "",
      l.utm_term ?? "",
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

  const filtered = search
    ? links.filter(
        (l) =>
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
        <Button variant="secondary" onClick={exportCSV} disabled={links.length === 0}>
          ↓ Exportar CSV
        </Button>
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
          <Button
            variant="ghost"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Anterior
          </Button>
          <span className="text-sm text-muted">
            {page} / {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Próxima →
          </Button>
        </div>
      )}
    </div>
  );
}
