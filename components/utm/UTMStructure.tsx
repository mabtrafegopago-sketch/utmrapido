"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Copy, Check, ListTree } from "lucide-react";
import { toast } from "@/components/ui/Toast";
import { extractUTMInfo, buildCopyWithStructure } from "@/lib/utils/utm";

interface Props {
  url: string;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  utm_term?: string | null;
  defaultOpen?: boolean;
  compact?: boolean;
}

export function UTMStructure({
  url,
  utm_source,
  utm_medium,
  utm_campaign,
  utm_content,
  utm_term,
  defaultOpen = false,
  compact = false,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedStructured, setCopiedStructured] = useState(false);

  const params = { utm_source, utm_medium, utm_campaign, utm_content, utm_term };
  const items = extractUTMInfo(params);

  if (items.length === 0) return null;

  async function copyUrl() {
    await navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    toast.success("Link copiado!");
    setTimeout(() => setCopiedUrl(false), 2000);
  }

  async function copyStructured() {
    const text = buildCopyWithStructure(url, params);
    await navigator.clipboard.writeText(text);
    setCopiedStructured(true);
    toast.success("Link + estrutura copiados!");
    setTimeout(() => setCopiedStructured(false), 2000);
  }

  return (
    <div className={`rounded-xl border border-border bg-white overflow-hidden ${compact ? "" : "mt-2"}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-text">
          <ListTree className="w-3.5 h-3.5 text-brand" />
          Estrutura ({items.length} parâmetro{items.length !== 1 ? "s" : ""})
        </span>
        {open ? (
          <ChevronUp className="w-3.5 h-3.5 text-muted" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-muted" />
        )}
      </button>

      {open && (
        <div className="p-3 flex flex-col gap-3">
          {/* Badges */}
          <div className="flex flex-wrap gap-1.5">
            {items.map((p) => (
              <span
                key={p.key}
                className={`${p.bg} ${p.text} inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium`}
                title={p.label}
              >
                <span className="font-semibold">{p.key}</span>
                <span className="opacity-60">=</span>
                <span className="font-mono">{p.value}</span>
              </span>
            ))}
          </div>

          {/* Explicações */}
          <div className="flex flex-col gap-1.5">
            {items.map((p) => (
              <div key={p.key} className="flex items-start gap-2 text-xs">
                <span className={`${p.text} font-mono font-semibold w-28 shrink-0`}>
                  {p.key}
                </span>
                <span className="text-muted">
                  <span className="text-text">{p.label}</span> — {p.explanation}.
                </span>
              </div>
            ))}
          </div>

          {/* Botões de cópia */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={copyUrl}
              className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium text-brand hover:text-brand-dark bg-brand-light hover:bg-[#DDDAF8] px-3 py-2 rounded-lg transition-colors"
            >
              {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedUrl ? "Copiado!" : "Copiar link"}
            </button>
            <button
              type="button"
              onClick={copyStructured}
              className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium text-white bg-brand hover:bg-brand-dark px-3 py-2 rounded-lg transition-colors"
            >
              {copiedStructured ? <Check className="w-3.5 h-3.5" /> : <ListTree className="w-3.5 h-3.5" />}
              {copiedStructured ? "Copiado!" : "Copiar com estrutura"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
