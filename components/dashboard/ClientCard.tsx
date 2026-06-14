"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { Trash2, ArrowRight, Copy } from "lucide-react";

interface ClientCardProps {
  id: string;
  name: string;
  email?: string | null;
  color: string;
  accessToken: string;
  slug?: string | null;
  logoUrl?: string | null;
  linkCount?: number;
  onDelete: (id: string) => void;
}

export function ClientCard({
  id,
  name,
  email,
  color,
  accessToken,
  slug,
  logoUrl,
  linkCount = 0,
  onDelete,
}: ClientCardProps) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const portalUrl = `${origin}/c/${slug || accessToken}`;

  function copyPortalLink() {
    navigator.clipboard.writeText(portalUrl);
    toast.success("Link do portal copiado!");
  }

  return (
    <div className="bg-white rounded-2xl border border-border p-5 flex flex-col gap-4 hover:border-brand/30 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt=""
              className="w-11 h-11 rounded-xl object-cover border border-border shrink-0 bg-white"
            />
          ) : (
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm"
              style={{ backgroundColor: color }}
            >
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-semibold text-text leading-snug truncate">{name}</p>
            {email && <p className="text-xs text-muted truncate">{email}</p>}
            {slug && (
              <p className="text-xs text-brand font-mono mt-0.5 truncate">/c/{slug}</p>
            )}
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
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
        <Button variant="ghost" size="sm" onClick={copyPortalLink} className="flex-1">
          <Copy className="w-3.5 h-3.5" />
          Portal
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(id)}
          className="shrink-0 px-2.5"
          title="Excluir cliente"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
