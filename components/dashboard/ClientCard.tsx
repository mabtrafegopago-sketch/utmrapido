"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";

interface ClientCardProps {
  id: string;
  name: string;
  email?: string | null;
  color: string;
  accessToken: string;
  linkCount?: number;
  onDelete: (id: string) => void;
}

export function ClientCard({ id, name, email, color, accessToken, linkCount = 0, onDelete }: ClientCardProps) {
  const portalUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/c/${accessToken}`;

  function copyPortalLink() {
    navigator.clipboard.writeText(portalUrl);
    toast.success("Link do portal copiado!");
  }

  return (
    <div className="bg-white rounded-2xl border border-border p-5 flex flex-col gap-4 hover:border-brand/30 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
            style={{ backgroundColor: color }}
          >
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-text leading-snug">{name}</p>
            {email && <p className="text-xs text-muted">{email}</p>}
          </div>
        </div>
        <span className="text-xs text-muted bg-gray-50 border border-border rounded-full px-2.5 py-1 shrink-0">
          {linkCount} link{linkCount !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Link href={`/clientes/${id}`} className="flex-1">
          <Button variant="secondary" size="sm" className="w-full">
            Ver links
          </Button>
        </Link>
        <Button variant="ghost" size="sm" onClick={copyPortalLink} className="flex-1">
          Copiar portal
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(id)}
          className="shrink-0"
          title="Excluir cliente"
        >
          ✕
        </Button>
      </div>
    </div>
  );
}
