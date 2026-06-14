"use client";

import { Badge } from "@/components/ui/Badge";
import { CopyButton } from "@/components/ui/CopyButton";
import { PDFExport } from "@/components/ui/PDFExport";
import { Logo } from "@/components/marketing/Logo";
import { Folder, FolderOpen, Link2, ArrowRight } from "lucide-react";

export interface PortalLink {
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

export interface PortalFolder {
  id: string;
  name: string;
  color: string;
  parent_id: string | null;
  created_at: string;
}

interface Props {
  client: {
    id: string;
    name: string;
    color: string;
    logoUrl: string | null;
    slug: string | null;
  };
  links: PortalLink[];
  folders: PortalFolder[];
}

function LinkCard({ link }: { link: PortalLink }) {
  return (
    <div className="bg-white rounded-2xl border border-border p-5 hover:border-brand/30 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <Link2 className="w-4 h-4 text-brand mt-0.5 shrink-0" />
          <p className="font-semibold text-text leading-tight">{link.name}</p>
        </div>
        <CopyButton url={link.full_url} label="Copiar" />
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {link.utm_source && <Badge variant="default">source: {link.utm_source}</Badge>}
        {link.utm_medium && <Badge variant="info">medium: {link.utm_medium}</Badge>}
        {link.utm_campaign && <Badge variant="success">campaign: {link.utm_campaign}</Badge>}
        {link.utm_content && <Badge variant="warning">content: {link.utm_content}</Badge>}
        {link.utm_term && <Badge>term: {link.utm_term}</Badge>}
      </div>
      <p className="text-xs font-mono text-muted bg-gray-50 rounded-lg px-3 py-2 break-all border border-border">
        {link.full_url}
      </p>
      <p className="text-xs text-muted mt-2">
        Criado em{" "}
        {new Date(link.created_at).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
      </p>
    </div>
  );
}

export function PortalClient({ client, links, folders }: Props) {
  const totalCampaigns = new Set(links.map((l) => l.utm_campaign).filter(Boolean)).size;

  // ── Estrutura hierárquica: pasta pai > subpastas > links ──
  const topFolders = folders.filter((f) => !f.parent_id);
  const subFoldersByParent = new Map<string, PortalFolder[]>();
  for (const f of folders) {
    if (f.parent_id) {
      const arr = subFoldersByParent.get(f.parent_id) ?? [];
      arr.push(f);
      subFoldersByParent.set(f.parent_id, arr);
    }
  }
  const linksByFolder = new Map<string, PortalLink[]>();
  for (const l of links) {
    if (l.folder_id) {
      const arr = linksByFolder.get(l.folder_id) ?? [];
      arr.push(l);
      linksByFolder.set(l.folder_id, arr);
    }
  }
  const orphanLinks = links.filter((l) => !l.folder_id);

  function countLinks(folder: PortalFolder): number {
    const direct = linksByFolder.get(folder.id)?.length ?? 0;
    const subs = subFoldersByParent.get(folder.id) ?? [];
    return direct + subs.reduce((sum, sf) => sum + (linksByFolder.get(sf.id)?.length ?? 0), 0);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ─── Header com logo do cliente ─── */}
      <header className="bg-white border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center sm:items-center gap-5">
          {client.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={client.logoUrl}
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

          <div className="flex-1 text-center sm:text-left">
            <p className="text-xs text-brand font-semibold uppercase tracking-wider mb-1">
              Portal de Links UTM
            </p>
            <h1 className="text-3xl font-bold text-text leading-tight">{client.name}</h1>
            <p className="text-sm text-muted mt-1">
              Seus links UTM — acesso rápido e organizado
            </p>
          </div>

          <a
            href="/"
            className="hidden sm:flex items-center gap-2 text-xs text-muted hover:text-brand transition-colors"
            title="UTM Rápido"
          >
            <Logo variant="mark" size={22} />
            <span className="font-semibold">UTM Rápido</span>
          </a>
        </div>
      </header>

      {/* ─── Conteúdo ─── */}
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10">
        {links.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-brand-light text-brand flex items-center justify-center mx-auto mb-4">
              <Link2 className="w-7 h-7" />
            </div>
            <p className="font-semibold text-text mb-1">Nenhum link criado ainda</p>
            <p className="text-sm text-muted">
              Quando seu gestor criar links para você, eles aparecerão aqui.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex gap-3 flex-wrap">
                <div className="bg-white rounded-xl border border-border px-5 py-3 flex items-center gap-3">
                  <span className="text-2xl font-bold text-brand">{links.length}</span>
                  <span className="text-sm text-muted">links</span>
                </div>
                <div className="bg-white rounded-xl border border-border px-5 py-3 flex items-center gap-3">
                  <span className="text-2xl font-bold text-brand">{totalCampaigns}</span>
                  <span className="text-sm text-muted">campanhas</span>
                </div>
                {topFolders.length > 0 && (
                  <div className="bg-white rounded-xl border border-border px-5 py-3 flex items-center gap-3">
                    <span className="text-2xl font-bold text-brand">{folders.length}</span>
                    <span className="text-sm text-muted">pastas</span>
                  </div>
                )}
              </div>
              <PDFExport
                clientName={client.name}
                clientLogoUrl={client.logoUrl}
                clientColor={client.color}
                links={links}
                folders={folders}
              />
            </div>

            <div className="flex flex-col gap-10">
              {topFolders.map((folder) => {
                const subs = subFoldersByParent.get(folder.id) ?? [];
                const direct = linksByFolder.get(folder.id) ?? [];
                const total = countLinks(folder);
                if (total === 0) return null;
                return (
                  <section key={folder.id}>
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${folder.color}20`, color: folder.color }}
                      >
                        <Folder className="w-5 h-5" />
                      </div>
                      <h2 className="text-lg font-bold text-text">{folder.name}</h2>
                      <span className="text-sm text-muted">({total})</span>
                    </div>

                    {direct.length > 0 && (
                      <div className="flex flex-col gap-3 mb-6">
                        {direct.map((link) => (
                          <LinkCard key={link.id} link={link} />
                        ))}
                      </div>
                    )}

                    {subs.map((sf) => {
                      const subLinks = linksByFolder.get(sf.id) ?? [];
                      if (subLinks.length === 0) return null;
                      return (
                        <div
                          key={sf.id}
                          className="pl-4 border-l-2 ml-2 mb-6"
                          style={{ borderColor: sf.color }}
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <ArrowRight className="w-4 h-4 text-muted" />
                            <FolderOpen className="w-4 h-4" style={{ color: sf.color }} />
                            <h3 className="text-sm font-bold text-text">{sf.name}</h3>
                            <span className="text-xs text-muted">({subLinks.length})</span>
                          </div>
                          <div className="flex flex-col gap-3">
                            {subLinks.map((link) => (
                              <LinkCard key={link.id} link={link} />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </section>
                );
              })}

              {orphanLinks.length > 0 && (
                <section>
                  {topFolders.length > 0 && (
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
                      <div className="w-9 h-9 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center">
                        <Link2 className="w-5 h-5" />
                      </div>
                      <h2 className="text-lg font-bold text-text">Outros links</h2>
                      <span className="text-sm text-muted">({orphanLinks.length})</span>
                    </div>
                  )}
                  <div className="flex flex-col gap-3">
                    {orphanLinks.map((link) => (
                      <LinkCard key={link.id} link={link} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          </>
        )}
      </div>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border bg-white py-6 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
          <p>
            Powered by{" "}
            <a href="/" className="text-brand hover:underline font-semibold">
              UTM Rápido
            </a>
          </p>
          <p>Gerador de links UTM para gestores de tráfego</p>
        </div>
      </footer>
    </div>
  );
}
