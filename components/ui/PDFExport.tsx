"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Download } from "lucide-react";

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
  folder_id?: string | null;
}

interface FolderRow {
  id: string;
  name: string;
  color: string;
  parent_id?: string | null;
}

interface PDFExportProps {
  clientName: string;
  clientLogoUrl?: string | null;
  clientColor?: string;
  links: LinkRow[];
  folders?: FolderRow[];
}

const PARAM_COLORS: Record<string, string> = {
  source: "#EEEDFE",
  medium: "#DBEAFE",
  campaign: "#D1FAE5",
  content: "#FEF3C7",
  term: "#F3F4F6",
};
const PARAM_TEXT: Record<string, string> = {
  source: "#3C3489",
  medium: "#1E40AF",
  campaign: "#065F46",
  content: "#92400E",
  term: "#374151",
};

const MARK_LOGO_SVG = `
<svg width="36" height="36" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" rx="14" fill="#534AB7"/>
  <path d="M14 14 L14 36 C14 47 22 54 32 54 C42 54 50 47 50 36 L50 22 L58 22 L50 10 L42 22 L50 22"
    stroke="#ffffff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>
`;

export function PDFExport({
  clientName,
  clientLogoUrl,
  clientColor = "#534AB7",
  links,
  folders = [],
}: PDFExportProps) {
  const [loading, setLoading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  async function handleExport() {
    if (!printRef.current) return;
    setLoading(true);

    try {
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas"),
      ]);

      const el = printRef.current;
      el.style.display = "block";

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        width: 794,
        windowWidth: 794,
      });

      el.style.display = "none";

      const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgW = pageW;
      const imgH = (canvas.height * imgW) / canvas.width;

      let yOffset = 0;
      while (yOffset < imgH) {
        if (yOffset > 0) pdf.addPage();
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, -yOffset, imgW, imgH);
        yOffset += pageH;
      }

      pdf.save(`UTM_${clientName.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const params = (link: LinkRow) =>
    [
      link.utm_source ? { key: "source", val: link.utm_source } : null,
      link.utm_medium ? { key: "medium", val: link.utm_medium } : null,
      link.utm_campaign ? { key: "campaign", val: link.utm_campaign } : null,
      link.utm_content ? { key: "content", val: link.utm_content } : null,
      link.utm_term ? { key: "term", val: link.utm_term } : null,
    ].filter(Boolean) as { key: string; val: string }[];

  // Agrupa links por pasta com hierarquia (pai > sub > links)
  const topFolders = folders.filter((f) => !f.parent_id);
  const subsByParent = new Map<string, FolderRow[]>();
  for (const f of folders) {
    if (f.parent_id) {
      const arr = subsByParent.get(f.parent_id) ?? [];
      arr.push(f);
      subsByParent.set(f.parent_id, arr);
    }
  }
  const linksByFolder = new Map<string, LinkRow[]>();
  for (const l of links) {
    if (l.folder_id) {
      const arr = linksByFolder.get(l.folder_id) ?? [];
      arr.push(l);
      linksByFolder.set(l.folder_id, arr);
    }
  }
  const orphanLinks = links.filter((l) => !l.folder_id);

  function renderLinkCard(link: LinkRow) {
    return (
      <div
        key={link.id}
        style={{
          border: "1px solid #E5E7EB",
          borderRadius: 12,
          padding: "14px 16px",
          marginBottom: 10,
          background: "#fff",
          breakInside: "avoid",
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 6 }}>
          {link.name}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 }}>
          {params(link).map((p) => (
            <span
              key={p.key}
              style={{
                background: PARAM_COLORS[p.key],
                color: PARAM_TEXT[p.key],
                fontSize: 10,
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: 999,
              }}
            >
              {p.key}: {p.val}
            </span>
          ))}
        </div>
        <div
          style={{
            background: "#F9FAFB",
            border: "1px solid #E5E7EB",
            borderRadius: 6,
            padding: "6px 10px",
            fontSize: 9,
            fontFamily: "Courier New, monospace",
            color: "#374151",
            wordBreak: "break-all",
          }}
        >
          {link.full_url}
        </div>
        <div style={{ fontSize: 9, color: "#9CA3AF", marginTop: 4 }}>
          {new Date(link.created_at).toLocaleDateString("pt-BR")}
        </div>
      </div>
    );
  }

  function renderFolderSection(folder: FolderRow, isSub = false) {
    const direct = linksByFolder.get(folder.id) ?? [];
    const subs = isSub ? [] : subsByParent.get(folder.id) ?? [];
    const subLinkCount = subs.reduce((s, sf) => s + (linksByFolder.get(sf.id)?.length ?? 0), 0);
    const total = direct.length + subLinkCount;
    if (total === 0) return null;
    return (
      <div key={folder.id} style={{ marginBottom: isSub ? 14 : 22, breakInside: "avoid-page" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            paddingBottom: 6,
            borderBottom: `2px solid ${folder.color}`,
            marginBottom: 10,
            marginLeft: isSub ? 16 : 0,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 12,
              height: 12,
              background: folder.color,
              borderRadius: 4,
            }}
          />
          <span style={{ fontSize: isSub ? 12 : 14, fontWeight: 700, color: "#111827" }}>
            {isSub ? "↳ " : ""}
            {folder.name}
          </span>
          <span style={{ fontSize: 10, color: "#6B7280" }}>({total})</span>
        </div>
        <div style={{ paddingLeft: isSub ? 16 : 0 }}>
          {direct.map(renderLinkCard)}
          {subs.map((sf) => renderFolderSection(sf, true))}
        </div>
      </div>
    );
  }

  return (
    <>
      <Button variant="secondary" size="sm" loading={loading} onClick={handleExport}>
        <Download className="w-4 h-4" />
        Baixar PDF
      </Button>

      {/* Hidden print template */}
      <div
        ref={printRef}
        style={{
          display: "none",
          width: 794,
          background: "#fff",
          padding: "48px 56px",
          fontFamily: "Arial, sans-serif",
          color: "#111827",
        }}
      >
        {/* ─── HEADER ─── */}
        <div
          style={{
            borderBottom: `3px solid ${clientColor}`,
            paddingBottom: 18,
            marginBottom: 28,
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          {clientLogoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={clientLogoUrl}
              alt=""
              crossOrigin="anonymous"
              style={{
                width: 64,
                height: 64,
                borderRadius: 14,
                objectFit: "cover",
                border: "1px solid #E5E7EB",
                background: "#fff",
              }}
            />
          ) : (
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 14,
                background: clientColor,
                color: "#fff",
                fontSize: 28,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {clientName.charAt(0).toUpperCase()}
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: clientColor,
                textTransform: "uppercase",
                letterSpacing: 1.2,
                marginBottom: 3,
              }}
            >
              Relatório de Links UTM
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>
              {clientName}
            </div>
            <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>
              Gerado em{" "}
              {new Date().toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}{" "}
              · {links.length} link{links.length !== 1 ? "s" : ""}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span dangerouslySetInnerHTML={{ __html: MARK_LOGO_SVG }} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 9, color: "#6B7280", textTransform: "uppercase", letterSpacing: 1 }}>
                Gerado por
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#534AB7" }}>UTM Rápido</span>
            </div>
          </div>
        </div>

        {/* ─── CONTEÚDO ─── */}
        <div>
          {topFolders.map((folder) => renderFolderSection(folder))}
          {orphanLinks.length > 0 && (
            <div style={{ marginBottom: 22 }}>
              {topFolders.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    paddingBottom: 6,
                    borderBottom: "2px solid #9CA3AF",
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: 12,
                      height: 12,
                      background: "#9CA3AF",
                      borderRadius: 4,
                    }}
                  />
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Outros links</span>
                  <span style={{ fontSize: 10, color: "#6B7280" }}>({orphanLinks.length})</span>
                </div>
              )}
              {orphanLinks.map(renderLinkCard)}
            </div>
          )}
        </div>

        {/* ─── FOOTER ─── */}
        <div
          style={{
            marginTop: 32,
            paddingTop: 14,
            borderTop: "1px solid #E5E7EB",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 10,
            color: "#9CA3AF",
          }}
        >
          <span>Gerado por UTM Rápido — utmrapido.com.br</span>
          <span style={{ color: "#534AB7", fontWeight: 700 }}>UTM Rápido</span>
        </div>
      </div>
    </>
  );
}
