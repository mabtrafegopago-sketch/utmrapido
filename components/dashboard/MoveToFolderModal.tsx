"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Folder, X } from "lucide-react";

interface FolderOption {
  id: string;
  name: string;
  color: string;
  parent_id?: string | null;
  client_id?: string;
}

interface ClientOption {
  id: string;
  name: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  folders: FolderOption[];
  clients?: ClientOption[];
  count: number;
  saving?: boolean;
  onConfirm: (folderId: string | null, clientId?: string | null) => Promise<void> | void;
  /** Quando true, mostra seletor de cliente também (histórico geral). */
  showClientSelect?: boolean;
}

export function MoveToFolderModal({
  open,
  onClose,
  folders,
  clients = [],
  count,
  saving,
  onConfirm,
  showClientSelect,
}: Props) {
  const [folderId, setFolderId] = useState<string>("");
  const [clientId, setClientId] = useState<string>("");

  if (!open) return null;

  const folderOptions = showClientSelect && clientId
    ? folders.filter((f) => f.client_id === clientId)
    : folders;

  async function handleConfirm() {
    await onConfirm(folderId || null, showClientSelect ? clientId || null : undefined);
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-brand-light text-brand flex items-center justify-center">
              <Folder className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text">Mover para pasta</h2>
              <p className="text-xs text-muted">
                {count} link{count !== 1 ? "s" : ""} selecionado{count !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-text p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {showClientSelect && clients.length > 0 && (
          <div>
            <label className="text-sm font-medium text-text block mb-1.5">Cliente</label>
            <select
              className="w-full border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
              value={clientId}
              onChange={(e) => {
                setClientId(e.target.value);
                setFolderId("");
              }}
            >
              <option value="">Manter cliente atual</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-text block mb-1.5">Pasta de destino</label>
          <select
            className="w-full border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
            value={folderId}
            onChange={(e) => setFolderId(e.target.value)}
          >
            <option value="">Sem pasta</option>
            {folderOptions.map((f) => (
              <option key={f.id} value={f.id}>
                {f.parent_id ? "  ↳ " : ""}
                {f.name}
              </option>
            ))}
          </select>
          {folderOptions.length === 0 && (
            <p className="text-xs text-muted mt-1.5">
              {showClientSelect && !clientId
                ? "Selecione um cliente para ver as pastas."
                : "Este cliente ainda não tem pastas."}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Cancelar
          </Button>
          <Button className="flex-1" loading={saving} onClick={handleConfirm}>
            Mover
          </Button>
        </div>
      </div>
    </div>
  );
}
