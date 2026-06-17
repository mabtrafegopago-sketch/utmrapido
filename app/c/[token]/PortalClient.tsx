"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { CopyButton } from "@/components/ui/CopyButton";
import { PDFExport } from "@/components/ui/PDFExport";
import { Logo } from "@/components/marketing/Logo";
import { Button } from "@/components/ui/Button";
import { UTMStructure } from "@/components/utm/UTMStructure";
import { toast } from "@/components/ui/Toast";
import { Folder, FolderOpen, Link2, ArrowRight, CheckSquare, Square, X, Copy, FileDown, LogOut } from "lucide-react";

export interface PortalLink {
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
  /** Quando o usuário está logado como client_user. */
  authedUser?: { id: string; name: string } | null;
}

function LinkCard({
  link,
  selectionMode,
  selected,
  onToggle,
}: {
  link: PortalLink;
  selectionMode: boolean;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`bg-white rounded-2xl border p-5 transition-all ${
        selected ? "border-brand ring-2 ring-brand/20" : "border-border hover:border-brand/30 hover:shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-2.5 min-w-0 flex-1">
          {selectionMode && (
            <button
              type="button"
              onClick={onToggle}
              className="mt-0.5 text-brand hover:text-brand-dark transition-colors shrink-0"
              aria-label={selected ? "Desmarcar" : "Selecionar"}
            >
              {selected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
            </button>
          )}
          {!selectionMode && <Link2 className="w-4 h-4 text-brand mt-0.5 shrink-0" />}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-text leading-tight">{link.name}</p>
            {link.description && (
              <p className="text-xs text-muted mt-1 leading-relaxed">{link.description}</p>
            )}
          </div>
        </div>
        {!selectionMode && <CopyButton url={link.full_url} label="Copiar" />}
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
      <UTMStructure
        url={link.full_url}
        utm_source={link.utm_source}
        utm_medium={link.utm_medium}
        utm_campaign={link.utm_campaign}
        utm_content={link.utm_content}
        utm_term={link.utm_term}
      />
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

export function PortalClient({ client, links, folders, authedUser }: Props) {
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [pdfOpen, setPdfOpen] = useState(false);

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  function selectAll() {
    setSelectedIds(new Set(links.map((l) => l.id)));
  }
  function cancelSelection() {
    setSelectionMode(false);
    setSelectedIds(new Set());
  }
  async function copySelected() {
    const text = links
      .filter((l) => selectedIds.has(l.id))
      .map((l) => l.full_url)
      .join("\n");
    await navigator.clipboard.writeText(text);
    toast.success(`${selectedIds.size} link${selectedIds.size !== 1 ? "s" : ""} copiado${selectedIds.size !== 1 ? "s" : ""}!`);
  }

  const selectedLinks = links.filter((l) => selectedIds.has(l.id));
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
      <header className={`bg-white border-b ${authedUser ? "border-brand/40" : "border-border"}`}>
        {authedUser && (
          <div className="bg-brand-light/60 border-b border-brand-light">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-3">
              <p className="text-xs text-brand font-medium">
                Olá, <strong>{authedUser.name}</strong> — área logada
              </p>
              <form action="/api/client-auth/signout" method="POST">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-brand hover:text-brand-dark transition-colors"
                >
                  <LogOut className="w-3 h-3" />
                  Sair
                </button>
              </form>
            </div>
          </div>
        )}
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
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 pb-24">
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
              <div className="flex gap-2 flex-wrap">
                {!selectionMode ? (
                  <Button variant="secondary" size="sm" onClick={() => setSelectionMode(true)}>
                    <CheckSquare className="w-4 h-4" />
                    Selecionar
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" onClick={cancelSelection}>
                    <X className="w-4 h-4" />
                    Cancelar
                  </Button>
                )}
                <PDFExport
                  clientName={client.name}
                  clientLogoUrl={client.logoUrl}
                  clientColor={client.color}
                  links={links}
                  folders={folders}
                />
              </div>
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
                          <LinkCard
                            key={link.id}
                            link={link}
                            selectionMode={selectionMode}
                            selected={selectedIds.has(link.id)}
                            onToggle={() => toggleSelect(link.id)}
                          />
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
                              <LinkCard
                                key={link.id}
                                link={link}
                                selectionMode={selectionMode}
                                selected={selectedIds.has(link.id)}
                                onToggle={() => toggleSelect(link.id)}
                              />
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
                      <LinkCard
                        key={link.id}
                        link={link}
                        selectionMode={selectionMode}
                        selected={selectedIds.has(link.id)}
                        onToggle={() => toggleSelect(link.id)}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>
          </>
        )}
      </div>

      {/* Barra de ações flutuante (somente seleção) */}
      {selectionMode && selectedIds.size > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-[95vw]">
          <div className="bg-white border border-border rounded-2xl shadow-xl px-4 py-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 pr-2 border-r border-border">
              <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-xs font-bold">
                {selectedIds.size}
              </div>
              <span className="text-sm font-medium text-text whitespace-nowrap">
                link{selectedIds.size !== 1 ? "s" : ""} selecionado{selectedIds.size !== 1 ? "s" : ""}
              </span>
            </div>
            {selectedIds.size < links.length && (
              <button
                onClick={selectAll}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-brand transition-colors"
              >
                <CheckSquare className="w-3.5 h-3.5" />
                Selecionar todos ({links.length})
              </button>
            )}
            <button
              onClick={copySelected}
              className="inline-flex items-center gap-1.5 text-xs font-medium bg-brand-light text-brand hover:bg-[#DDDAF8] px-2.5 py-1.5 rounded-lg transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              Copiar todos
            </button>
            <button
              onClick={() => setPdfOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-medium bg-brand-light text-brand hover:bg-[#DDDAF8] px-2.5 py-1.5 rounded-lg transition-colors"
            >
              <FileDown className="w-3.5 h-3.5" />
              Exportar PDF
            </button>
            <button
              onClick={cancelSelection}
              className="p-1.5 rounded-lg text-muted hover:text-text hover:bg-gray-100 transition-colors ml-1"
              title="Cancelar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {pdfOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setPdfOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 flex flex-col gap-5" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-text">
              Exportar {selectedIds.size} link{selectedIds.size !== 1 ? "s" : ""}
            </h2>
            <p className="text-muted text-sm">PDF apenas dos links selecionados.</p>
            <PDFExport
              clientName={client.name}
              clientLogoUrl={client.logoUrl}
              clientColor={client.color}
              links={selectedLinks}
              folders={folders}
            />
            <Button variant="ghost" onClick={() => setPdfOpen(false)}>Fechar</Button>
          </div>
        </div>
      )}

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
