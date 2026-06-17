"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { UTMStructure } from "@/components/utm/UTMStructure";
import { generateAutoDescription } from "@/lib/utils/utm";
import { Trash2, Copy, Link2, CheckSquare, Square, Pencil, Sparkles, X } from "lucide-react";

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
  const [editTarget, setEditTarget] = useState<Link | null>(null);
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

  function openEdit(link: Link) {
    setEditTarget(link);
    setEditValue(linkState[link.id] ?? link.description ?? "");
  }

  async function saveEdit() {
    if (!editTarget) return;
    setEditSaving(true);
    try {
      const res = await fetch("/api/links", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editTarget.id, description: editValue.trim() || null }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        toast.error(json.error ?? "Erro ao salvar descrição.");
        return;
      }
      setLinkState((prev) => ({ ...prev, [editTarget.id]: editValue.trim() || null }));
      toast.success("Descrição salva!");
      setEditTarget(null);
    } finally {
      setEditSaving(false);
    }
  }

  function generateForEdit() {
    if (!editTarget) return;
    const suggestion = generateAutoDescription({
      utm_source: editTarget.utm_source,
      utm_medium: editTarget.utm_medium,
      utm_campaign: editTarget.utm_campaign,
      utm_content: editTarget.utm_content,
      utm_term: editTarget.utm_term,
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
                    {displayDescription(link) ? (
                      <p className="text-xs italic text-muted mt-0.5 leading-relaxed">{displayDescription(link)}</p>
                    ) : !selectionMode ? (
                      <button
                        type="button"
                        onClick={() => openEdit(link)}
                        className="text-xs italic text-brand hover:text-brand-dark mt-0.5 transition-colors inline-flex items-center gap-1"
                      >
                        <Pencil className="w-3 h-3" />
                        Adicionar descrição
                      </button>
                    ) : null}
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
                    <button
                      onClick={() => openEdit(link)}
                      className="p-1.5 rounded-lg text-muted hover:text-brand hover:bg-brand-light transition-colors"
                      title="Editar descrição"
                    >
                      <Pencil className="w-4 h-4" />
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

              {/* UTM badges */}
              <div className="flex flex-wrap gap-1.5 mt-2">
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

      {/* Modal: editar descrição */}
      {editTarget && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setEditTarget(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-text">Descrição do link</h2>
              <button
                onClick={() => setEditTarget(null)}
                className="text-muted hover:text-text p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-muted truncate">
              <strong>{editTarget.name}</strong>
            </p>
            <div>
              <label className="text-sm font-medium text-text block mb-1.5">
                Descrição (opcional)
              </label>
              <textarea
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand resize-none"
                rows={3}
                placeholder="Ex: Link enviado no grupo de WhatsApp para a campanha de lançamento do ebook"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />
              <button
                type="button"
                onClick={generateForEdit}
                disabled={!editTarget.utm_source && !editTarget.utm_medium && !editTarget.utm_campaign}
                className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium text-brand hover:text-brand-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Gerar descrição automática
              </button>
            </div>
            <div className="flex gap-3 mt-1">
              <Button variant="secondary" className="flex-1" onClick={() => setEditTarget(null)}>
                Cancelar
              </Button>
              <Button className="flex-1" loading={editSaving} onClick={saveEdit}>
                Salvar
              </Button>
            </div>
          </div>
        </div>
      )}

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
