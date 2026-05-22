"use client";

import { useState } from "react";
import { toast } from "@/components/ui/Toast";

interface URLPreviewProps {
  url: string;
}

export function URLPreview({ url }: URLPreviewProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copiado!");
    setTimeout(() => setCopied(false), 2000);
  }

  if (!url) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-gray-50 p-4 text-sm text-muted text-center">
        Preencha os campos acima para gerar o link UTM
      </div>
    );
  }

  const parts = parseURLParts(url);

  return (
    <div className="rounded-xl border border-border bg-white overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-border">
        <span className="text-xs font-medium text-muted uppercase tracking-wide">
          Preview do link
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs font-medium text-brand hover:text-brand-dark transition-colors px-2 py-1 rounded-md hover:bg-brand-light"
        >
          {copied ? (
            <>
              <CheckIcon /> Copiado!
            </>
          ) : (
            <>
              <CopyIcon /> Copiar
            </>
          )}
        </button>
      </div>
      <div className="p-4 font-mono text-xs leading-relaxed break-all">
        <span className="text-gray-700">{parts.base}</span>
        {parts.params.length > 0 && (
          <>
            <span className="text-muted">?</span>
            {parts.params.map((p, i) => (
              <span key={p.key}>
                {i > 0 && <span className="text-muted">&amp;</span>}
                <span className="text-brand-dark font-semibold">{p.key}</span>
                <span className="text-muted">=</span>
                <span className="text-success">{p.value}</span>
              </span>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function parseURLParts(url: string) {
  try {
    const parsed = new URL(url);
    const base = `${parsed.origin}${parsed.pathname}`;
    const params: { key: string; value: string }[] = [];
    parsed.searchParams.forEach((value, key) => {
      params.push({ key, value });
    });
    return { base, params };
  } catch {
    return { base: url, params: [] };
  }
}

function CopyIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
