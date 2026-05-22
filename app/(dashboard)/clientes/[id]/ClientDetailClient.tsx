"use client";

import { useState } from "react";
import Link from "next/link";
import { UTMGenerator } from "@/components/utm/UTMGenerator";
import { LinkHistory } from "@/components/dashboard/LinkHistory";
import { CopyButton } from "@/components/ui/CopyButton";
import { Button } from "@/components/ui/Button";
import { PDFExport } from "@/components/ui/PDFExport";
import { toast } from "@/components/ui/Toast";

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
  client: { id: string; name: string; color: string; email: string | null; access_token: string };
  initialLinks: LinkRow[];
  portalUrl: string;
}

export function ClientDetailClient({ client, initialLinks, portalUrl }: Props) {
  const [links, setLinks] = useState<LinkRow[]>(initialLinks);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function refreshLinks() {
    const res = await fetch(`/api/links?client_id=${client.id}&page=1`);
    const json = await res.json();
    setLinks(json.data ?? []);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await fetch(`/api/links?id=${deleteTarget}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Link excluído.");
      setLinks((prev) => prev.filter((l) => l.id !== deleteTarget));
    } else {
      toast.error("Erro ao excluir link.");
    }
    setDeleting(false);
    setDeleteTarget(null);
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/clientes" className="text-muted hover:text-brand transition-colors text-sm mt-1">
          ← Clientes
        </Link>
        <div className="flex-1 flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shrink-0"
            style={{ backgroundColor: client.color }}
          >
            {client.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text">{client.name}</h1>
            {client.email && <p className="text-muted text-sm">{client.email}</p>}
          </div>
        </div>
      </div>

      {/* Portal link card */}
      <div className="bg-brand-light border border-[#C4C0F0] rounded-2xl p-5">
        <p className="text-sm font-semibold text-brand mb-1">Link do portal do cliente</p>
        <p className="text-xs text-muted mb-3">
          Envie este link para {client.name}. Ele abre sem precisar de login.
        </p>
        <div className="flex items-center gap-3 bg-white rounded-xl border border-border px-4 py-3">
          <p className="flex-1 text-sm font-mono text-muted truncate">{portalUrl}</p>
          <CopyButton url={portalUrl} label="Copiar link" />
        </div>
      </div>

      {/* Links list */}
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="text-lg font-bold text-text">
            Links UTM ({links.length})
          </h2>
          <div className="flex gap-2">
            <PDFExport clientName={client.name} links={links} />
            <Button onClick={() => setShowAddModal(true)}>
              + Adicionar link UTM
            </Button>
          </div>
        </div>
        <LinkHistory
          links={links}
          onDelete={(id) => setDeleteTarget(id)}
        />
      </div>

      {/* Modal — Adicionar link */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 p-6 flex flex-col gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-text">Novo link UTM</h2>
                <p className="text-xs text-muted mt-0.5">
                  Será salvo automaticamente para <strong>{client.name}</strong>
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-muted hover:text-text text-xl leading-none"
              >
                ×
              </button>
            </div>
            <UTMGenerator
              isLoggedIn
              isPro
              clients={[{ id: client.id, name: client.name }]}
              selectedClientId={client.id}
              onSaved={() => {
                setShowAddModal(false);
                refreshLinks();
                toast.success("Link adicionado com sucesso!");
              }}
            />
          </div>
        </div>
      )}

      {/* Modal — Confirmar exclusão */}
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
              <div className="text-4xl mb-3">🗑️</div>
              <h2 className="text-lg font-bold text-text mb-2">Excluir link?</h2>
              <p className="text-muted text-sm">Esta ação não pode ser desfeita.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setDeleteTarget(null)}>
                Cancelar
              </Button>
              <Button variant="danger" className="flex-1" loading={deleting} onClick={handleDelete}>
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
