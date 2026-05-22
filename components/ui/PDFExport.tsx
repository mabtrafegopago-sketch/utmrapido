"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";

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
}

interface PDFExportProps {
  clientName: string;
  links: LinkRow[];
}

const PARAM_COLORS: Record<string, string> = {
  source:   "#EEEDFE",
  medium:   "#DBEAFE",
  campaign: "#D1FAE5",
  content:  "#FEF3C7",
  term:     "#F3F4F6",
};
const PARAM_TEXT: Record<string, string> = {
  source:   "#3C3489",
  medium:   "#1E40AF",
  campaign: "#065F46",
  content:  "#92400E",
  term:     "#374151",
};

export function PDFExport({ clientName, links }: PDFExportProps) {
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
        pdf.addImage(
          canvas.toDataURL("image/png"),
          "PNG",
          0,
          -yOffset,
          imgW,
          imgH
        );
        yOffset += pageH;
      }

      pdf.save(`UTM_${clientName.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const params = (link: LinkRow) => [
    link.utm_source   ? { key: "source",   val: link.utm_source }   : null,
    link.utm_medium   ? { key: "medium",   val: link.utm_medium }   : null,
    link.utm_campaign ? { key: "campaign", val: link.utm_campaign } : null,
    link.utm_content  ? { key: "content",  val: link.utm_content }  : null,
    link.utm_term     ? { key: "term",     val: link.utm_term }     : null,
  ].filter(Boolean) as { key: string; val: string }[];

  return (
    <>
      <Button variant="secondary" size="sm" loading={loading} onClick={handleExport}>
        ↓ Baixar PDF
      </Button>

      {/* Hidden print template */}
      <div ref={printRef} style={{ display: "none", width: 794, background: "#fff", padding: "48px 56px", fontFamily: "Arial, sans-serif", color: "#111827" }}>
        {/* Header */}
        <div style={{ borderBottom: "2px solid #534AB7", paddingBottom: 20, marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#534AB7", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
                Portal de Links UTM
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, color: "#111827" }}>{clientName}</div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#534AB7" }}>⚡ UTM Rápido</div>
          </div>
          <div style={{ marginTop: 12, fontSize: 11, color: "#6B7280" }}>
            Gerado em {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })} · {links.length} link{links.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Links */}
        {links.map((link, i) => (
          <div key={link.id} style={{ marginBottom: 24, paddingBottom: 24, borderBottom: i < links.length - 1 ? "1px solid #E5E7EB" : "none" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 8 }}>{link.name}</div>

            {/* Param badges */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
              {params(link).map((p) => (
                <span key={p.key} style={{ background: PARAM_COLORS[p.key], color: PARAM_TEXT[p.key], fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999 }}>
                  {p.key}: {p.val}
                </span>
              ))}
            </div>

            {/* Full URL */}
            <div style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 8, padding: "8px 12px", fontSize: 10, fontFamily: "Courier New, monospace", color: "#374151", wordBreak: "break-all" }}>
              {link.full_url}
            </div>

            <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 6 }}>
              {new Date(link.created_at).toLocaleDateString("pt-BR")}
            </div>
          </div>
        ))}

        {/* Footer */}
        <div style={{ marginTop: 40, paddingTop: 16, borderTop: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 10, color: "#9CA3AF" }}>Gerado por UTM Rápido · utmrapido.com.br</span>
          <span style={{ fontSize: 10, color: "#534AB7", fontWeight: 700 }}>⚡ UTM Rápido</span>
        </div>
      </div>
    </>
  );
}
