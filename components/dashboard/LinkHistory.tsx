"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
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
  client_id?: string | null;
}

interface LinkHistoryProps {
  links: Link[];
  onDelete?: (id: string) => void;
}

export function LinkHistory({ links, onDelete }: LinkHistoryProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  function copyLink(url: string) {
    navigator.clipboard.writeText(url);
    toast.success("Link copiado!");
  }

  if (links.length === 0) {
    return (
      <div className="text-center py-12 text-muted text-sm">
        Nenhum link salvo ainda. Use o gerador acima para criar seu primeiro link.
      </div>
    );
  }

  return (
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
            <div className="flex items-center gap-1.5 shrink-0">
              <Button size="sm" variant="ghost" onClick={() => copyLink(link.full_url)}>
                Copiar
              </Button>
              {onDelete && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(link.id)}
                  className="text-danger hover:text-danger hover:bg-red-50"
                  title="Excluir link"
                >
                  ✕
                </Button>
              )}
            </div>
          </div>

          {/* UTM badges */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {link.utm_source && <Badge variant="default">source: {link.utm_source}</Badge>}
            {link.utm_medium && <Badge variant="info">medium: {link.utm_medium}</Badge>}
            {link.utm_campaign && <Badge variant="success">campaign: {link.utm_campaign}</Badge>}
            {link.utm_content && <Badge variant="warning">content: {link.utm_content}</Badge>}
            {link.utm_term && <Badge>term: {link.utm_term}</Badge>}
          </div>

          {/* Expanded URL */}
          {expanded === link.id && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg font-mono text-xs text-text break-all border border-border">
              {link.full_url}
            </div>
          )}

          <p className="text-xs text-muted mt-2">
            {new Date(link.created_at).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      ))}
    </div>
  );
}
