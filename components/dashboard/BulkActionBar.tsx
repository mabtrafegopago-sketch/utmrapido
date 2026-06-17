"use client";

import { Copy, Folder, Trash2, FileDown, X, CheckSquare } from "lucide-react";

interface BulkActionBarProps {
  count: number;
  totalCount: number;
  onSelectAll: () => void;
  onCancel: () => void;
  onCopyAll: () => void;
  onMoveToFolder?: () => void;
  onExportPDF?: () => void;
  onDelete: () => void;
}

export function BulkActionBar({
  count,
  totalCount,
  onSelectAll,
  onCancel,
  onCopyAll,
  onMoveToFolder,
  onExportPDF,
  onDelete,
}: BulkActionBarProps) {
  if (count === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-[95vw]">
      <div className="bg-white border border-border rounded-2xl shadow-xl px-4 py-3 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 pr-2 border-r border-border">
          <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-xs font-bold">
            {count}
          </div>
          <span className="text-sm font-medium text-text whitespace-nowrap">
            link{count !== 1 ? "s" : ""} selecionado{count !== 1 ? "s" : ""}
          </span>
        </div>

        {count < totalCount && (
          <button
            onClick={onSelectAll}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-brand transition-colors"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            Selecionar todos ({totalCount})
          </button>
        )}

        <div className="flex items-center gap-1.5 flex-wrap">
          {onMoveToFolder && (
            <button
              onClick={onMoveToFolder}
              className="inline-flex items-center gap-1.5 text-xs font-medium bg-brand-light text-brand hover:bg-[#DDDAF8] px-2.5 py-1.5 rounded-lg transition-colors"
            >
              <Folder className="w-3.5 h-3.5" />
              Mover para pasta
            </button>
          )}
          <button
            onClick={onCopyAll}
            className="inline-flex items-center gap-1.5 text-xs font-medium bg-brand-light text-brand hover:bg-[#DDDAF8] px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            Copiar todos
          </button>
          {onExportPDF && (
            <button
              onClick={onExportPDF}
              className="inline-flex items-center gap-1.5 text-xs font-medium bg-brand-light text-brand hover:bg-[#DDDAF8] px-2.5 py-1.5 rounded-lg transition-colors"
            >
              <FileDown className="w-3.5 h-3.5" />
              Exportar PDF
            </button>
          )}
          <button
            onClick={onDelete}
            className="inline-flex items-center gap-1.5 text-xs font-medium bg-red-50 text-danger hover:bg-red-100 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Excluir
          </button>
        </div>

        <button
          onClick={onCancel}
          className="p-1.5 rounded-lg text-muted hover:text-text hover:bg-gray-100 transition-colors ml-1"
          title="Cancelar seleção"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
