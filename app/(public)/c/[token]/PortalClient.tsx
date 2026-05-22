"use client";

import { Badge } from "@/components/ui/Badge";
import { CopyButton } from "@/components/ui/CopyButton";
import { PDFExport } from "@/components/ui/PDFExport";

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
}

interface Props {
  clientName: string;
  clientColor: string;
  links: LinkRow[];
}

export function PortalClient({ clientName, clientColor, links }: Props) {
  return (
    <>
      {/* Stats + PDF */}
      <div className="flex gap-4 mb-8 flex-wrap items-center justify-between">
        <div className="flex gap-4 flex-wrap">
          <div className="bg-white rounded-xl border border-border px-5 py-3 flex items-center gap-3">
            <span className="text-2xl font-bold text-brand">{links.length}</span>
            <span className="text-sm text-muted">links no total</span>
          </div>
          <div className="bg-white rounded-xl border border-border px-5 py-3 flex items-center gap-3">
            <span className="text-2xl font-bold text-brand">
              {new Set(links.map((l) => l.utm_campaign).filter(Boolean)).size}
            </span>
            <span className="text-sm text-muted">campanhas</span>
          </div>
        </div>
        {links.length > 0 && (
          <PDFExport clientName={clientName} links={links} />
        )}
      </div>

      {/* Links */}
      {links.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-12 text-center text-muted">
          <p className="text-4xl mb-3">🔗</p>
          <p className="font-medium">Nenhum link criado ainda</p>
          <p className="text-sm mt-1">Quando seu gestor criar links para você, eles aparecerão aqui.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {links.map((link) => (
            <div key={link.id} className="bg-white rounded-xl border border-border p-5 hover:border-brand/20 transition-colors">
              <div className="flex items-start justify-between gap-3 mb-3">
                <p className="font-semibold text-text">{link.name}</p>
                <CopyButton url={link.full_url} label="Copiar" />
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {link.utm_source   && <Badge variant="default">source: {link.utm_source}</Badge>}
                {link.utm_medium   && <Badge variant="info">medium: {link.utm_medium}</Badge>}
                {link.utm_campaign && <Badge variant="success">campaign: {link.utm_campaign}</Badge>}
                {link.utm_content  && <Badge variant="warning">content: {link.utm_content}</Badge>}
                {link.utm_term     && <Badge>term: {link.utm_term}</Badge>}
              </div>
              <p className="text-xs font-mono text-muted bg-gray-50 rounded-lg px-3 py-2 break-all border border-border">
                {link.full_url}
              </p>
              <p className="text-xs text-muted mt-2">
                Criado em {new Date(link.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
