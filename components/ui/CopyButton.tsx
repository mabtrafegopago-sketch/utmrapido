"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  url: string;
  label?: string;
  className?: string;
}

export function CopyButton({ url, label = "Copiar", className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className={[
        "shrink-0 inline-flex items-center gap-1.5 text-xs font-medium transition-colors px-3 py-1.5 rounded-lg",
        copied
          ? "bg-green-100 text-success"
          : "text-brand hover:text-brand-dark bg-brand-light hover:bg-[#DDDAF8]",
        className,
      ].join(" ")}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copiado!" : label}
    </button>
  );
}
