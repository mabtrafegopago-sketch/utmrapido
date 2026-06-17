"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { UTMStructure } from "@/components/utm/UTMStructure";
import { generateAutoDescription } from "@/lib/utils/utm";
import { Trash2, Copy, Link2, CheckSquare, Square, Pencil, Sparkles, FileText, Plus } from "lucide-react";

interface Link {
  id: string;
  name: string;
  full_url: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  description?: string | null;
  created_at: string;
  client_id?: string | null;
}

interface LinkHistoryProps {
  links: Link[];
  onDelete?: (id: string) => void;
  selectionMode?: boolean;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
}

export function LinkHistory({
  links,
  onDelete,
  selectionMode = false,
  selectedIds,
  onToggleSelect,
}: LinkHistoryProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editSaving, setEditSaving] = useState(false);
  const [linkState, setLinkState] = useState<Record<string, string | null>>({});

  function copyLink(url: string) {
    navigator.clipboard.writeText(url);
    toast.success("Link copiado!");
  }

  async function confirmDelete() {
    if (!deleteTarget || !onDelete) return;
    setDeleting(true);
    onDelete(deleteTarget);
    setDeleting(false);
    setDeleteTarget(null);
  }

  function startEdit(link: Link) {
    setEditingId(link.id);
    setEditValue(displayDescription(link) ?? "");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditValue("");
  }

  async function saveEdit(link: Link) {
    setEditSaving(true);
    try {
      const res = await fetch("/api/links", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: link.id, description: editValue.trim() || null }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        toast.error(json.error ?? "Erro ao salvar descrição.");
        return;
      }
      setLinkState((prev) => ({ ...prev, [link.id]: editValue.trim() || null }));
      toast.success("Descrição salva!");
      setEditingId(null);
      setEditValue("");
    } finally {
      setEditSaving(false);
    }
  }

  function generateForEdit(link: Link) {
    const suggestion = generateAutoDescription({
      utm_source: link.utm_source,
      utm_medium: link.utm_medium,
      utm_campaign: link.utm_campaign,
      utm_content: link.utm_content,
      utm_term: link.utm_term,
    });
    if (suggestion) setEditValue(suggestion);
  }

  function displayDescription(link: Link): string | null {
    if (link.id in linkState) return linkState[link.id];
    return link.description ?? null;
  }

  if (links.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-border text-center py-12 text-muted text-sm flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-brand-light text-brand flex items-center justify-center">
          <Link2 className="w-6 h-6" />
        </div>
        Nenhum link salvo ainda. Use o gerador acima para criar seu primeiro link.
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        {links.map((link) => {
          const isSelected = selectedIds?.has(link.id) ?? false;
          const desc = displayDescription(link);
          const isEditing = editingId === link.id;
          return (
            <div
              key={link.id}
              className={`bg-white rounded-xl border p-4 transition-colors ${
                isSelected ? "border-brand ring-2 ring-brand/20" : "border-border hover:border-brand/20"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  {selectionMode && onToggleSelect && (
                    <button
                      type="button"
                      onClick={() => onToggleSelect(link.id)}
                      className="mt-0.5 text-brand hover:text-brand-dark transition-colors shrink-0"
                      aria-label={isSelected ? "Desmarcar link" : "Selecionar link"}
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text text-sm truncate">{link.name}</p>
                    <p
                      className="text-xs text-muted font-mono truncate mt-0.5 cursor-pointer hover:text-brand transition-colors"
                      onClick={() => setExpanded(expanded === link.id ? null : link.id)}
                      title="Clique para expandir"
                    >
                      {link.full_url}
                    </p>
                  </div>
                </div>
                {!selectionMode && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => copyLink(link.full_url)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-brand hover:text-brand-dark bg-brand-light hover:bg-[#DDDAF8] px-2.5 py-1.5 rounded-lg transition-colors"
                      title="Copiar link"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Copiar
                    </button>
                    {onDelete && (
                      <button
                        onClick={() => setDeleteTarget(link.id)}
                        className="p-1.5 rounded-lg text-muted hover:text-danger hover:bg-red-50 transition-colors"
                        title="Excluir link"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Bloco de descrição */}
              {!selectionMode && (
                <div className="mt-3">
                  {isEditing ? (
                    <div
                      className="rounded-md p-2.5 border-l-[3px] border-l-brand bg-[#F8F7FF]"
                    >
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <FileText className="w-3.5 h-3.5 text-muted" />
                        <span className="text-[11px] font-medium text-muted uppercase tracking-wide">
                          Descrição
                        </span>
                      </div>
                      <textarea
                        autoFocus
                        className="w-full bg-white border border-border rounded-md px-2.5 py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand resize-none"
                        rows={3}
                        placeholder="Ex: Link enviado no grupo de WhatsApp para a campanha de lançamento do ebook"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                      />
                      <div className="flex items-center justify-between gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => generateForEdit(link)}
                          disabled={!link.utm_source && !link.utm_medium && !link.utm_campaign}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-brand hover:text-brand-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          Gerar automática
                        </button>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="text-xs font-medium text-muted hover:text-text px-2 py-1 rounded-md transition-colors"
                          >
                            Cancelar
                          </button>
                          <Button
                            size="sm"
                            loading={editSaving}
                            onClick={() => saveEdit(link)}
                          >
                            Salvar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : desc ? (
                    <div
                      className="rounded-md p-2.5 border-l-[3px] border-l-brand bg-[#F8F7FF] group relative"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-muted" />
                          <span className="text-[11px] font-medium text-muted uppercase tracking-wide">
                            Descrição
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => startEdit(link)}
                          className="p-1 rounded-md text-muted hover:text-brand hover:bg-white transition-colors"
                          title="Editar descrição"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-sm text-text leading-relaxed">{desc}</p>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => startEdit(link)}
                      className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-brand transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Adicionar descrição
                    </button>
                  )}
                </div>
              )}

              {/* UTM badges */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {link.utm_source   && <Badge variant="default">source: {link.utm_source}</Badge>}
                {link.utm_medium   && <Badge variant="info">medium: {link.utm_medium}</Badge>}
                {link.utm_campaign && <Badge variant="success">campaign: {link.utm_campaign}</Badge>}
                {link.utm_content  && <Badge variant="warning">content: {link.utm_content}</Badge>}
                {link.utm_term     && <Badge>term: {link.utm_term}</Badge>}
              </div>

              {/* Expanded URL */}
              {expanded === link.id && (
                <>
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg font-mono text-xs text-text break-all border border-border">
                    {link.full_url}
                  </div>
                  <UTMStructure
                    url={link.full_url}
                    utm_source={link.utm_source}
                    utm_medium={link.utm_medium}
                    utm_campaign={link.utm_campaign}
                    utm_content={link.utm_content}
                    utm_term={link.utm_term}
                    defaultOpen
                  />
                </>
              )}

              <p className="text-xs text-muted mt-2">
                {new Date(link.created_at).toLocaleDateString("pt-BR", {
                  day: "2-digit", month: "short", year: "numeric",
                  hour: "2-digit", minute: "2-digit",
                })}
              </p>
            </div>
          );
        })}
      </div>

      {/* Modal de confirmação */}
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
              <Button variant="danger" className="flex-1" loading={deleting} onClick={confirmDelete}>
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
