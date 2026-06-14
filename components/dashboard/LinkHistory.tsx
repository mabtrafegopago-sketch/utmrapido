"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { Trash2, Copy, Link2 } from "lucide-react";

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
  client_id?: string | null;
}

interface LinkHistoryProps {
  links: Link[];
  onDelete?: (id: string) => void;
}

export function LinkHistory({ links, onDelete }: LinkHistoryProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

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
        {links.map((link) => (
          <div
            key={link.id}
            className="bg-white rounded-xl border border-border p-4 hover:border-brand/20 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
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
              <div className="mt-3 p-3 bg-gray-50 rounded-lg font-mono text-xs text-text break-all border border-border">
                {link.full_url}
              </div>
            )}

            <p className="text-xs text-muted mt-2">
              {new Date(link.created_at).toLocaleDateString("pt-BR", {
                day: "2-digit", month: "short", year: "numeric",
                hour: "2-digit", minute: "2-digit",
              })}
            </p>
          </div>
        ))}
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

