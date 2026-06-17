"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { URLPreview } from "@/components/utm/URLPreview";
import { ParamTooltip, PARAM_TOOLTIPS } from "@/components/utm/ParamTooltip";
import { toast } from "@/components/ui/Toast";
import {
  buildUTMUrl,
  isValidUrl,
  slugify,
  generateAutoDescription,
  SOURCE_PRESETS,
  MEDIUM_PRESETS,
  FREE_LINK_LIMIT,
  FREE_LINKS_KEY,
  SESSION_KEY,
} from "@/lib/utils/utm";
import { Sparkles } from "lucide-react";

interface UTMGeneratorProps {
  isLoggedIn?: boolean;
  isPro?: boolean;
  userId?: string;
  clients?: { id: string; name: string }[];
  selectedClientId?: string;
  folders?: { id: string; name: string; color: string }[];
  selectedFolderId?: string;
  onSaved?: () => void;
  showUpgradeModal?: () => void;
  showLoginPrompt?: () => void;
}

const CUSTOM_VALUE = "__custom__";

export function UTMGenerator({
  isLoggedIn = false,
  isPro = false,
  userId,
  clients = [],
  selectedClientId,
  folders = [],
  selectedFolderId,
  onSaved,
  showUpgradeModal,
  showLoginPrompt,
}: UTMGeneratorProps) {
  const [baseUrl, setBaseUrl] = useState("");
  const [source, setSource] = useState("");
  const [sourceCustom, setSourceCustom] = useState("");
  const [medium, setMedium] = useState("");
  const [mediumCustom, setMediumCustom] = useState("");
  const [campaign, setCampaign] = useState("");
  const [content, setContent] = useState("");
  const [term, setTerm] = useState("");
  const [linkName, setLinkName] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionTouched, setDescriptionTouched] = useState(false);
  const [clientId, setClientId] = useState(selectedClientId ?? "");
  const [folderId, setFolderId] = useState(selectedFolderId ?? "");
  const [saving, setSaving] = useState(false);
  const [urlError, setUrlError] = useState("");
  const [freeCount, setFreeCount] = useState(0);
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    let sid = localStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, sid);
    }
    setSessionId(sid);

    const saved = localStorage.getItem(FREE_LINKS_KEY);
    setFreeCount(saved ? JSON.parse(saved).length : 0);
  }, []);

  const effectiveSource = source === CUSTOM_VALUE ? slugify(sourceCustom) : source;
  const effectiveMedium = medium === CUSTOM_VALUE ? slugify(mediumCustom) : medium;
  const effectiveCampaign = slugify(campaign);

  const fullUrl = buildUTMUrl({
    baseUrl,
    source: effectiveSource,
    medium: effectiveMedium,
    campaign: effectiveCampaign,
    content: slugify(content),
    term: slugify(term),
  });

  const suggestedDescription = generateAutoDescription({
    utm_source: effectiveSource || null,
    utm_medium: effectiveMedium || null,
    utm_campaign: effectiveCampaign || null,
    utm_content: slugify(content) || null,
    utm_term: slugify(term) || null,
  });

  useEffect(() => {
    if (!descriptionTouched) setDescription(suggestedDescription);
  }, [suggestedDescription, descriptionTouched]);

  function applySuggestion() {
    setDescription(suggestedDescription);
    setDescriptionTouched(false);
  }

  function handleCampaignChange(value: string) {
    setCampaign(value);
    if (!linkName) setLinkName(value);
  }

  function validateUrl(value: string) {
    if (!value) { setUrlError(""); return; }
    if (!isValidUrl(value)) setUrlError("URL inválida. Inclua https://");
    else setUrlError("");
  }

  const canSave = !!fullUrl && !!linkName && !urlError;

  async function handleSave() {
    if (!canSave) return;

    if (!isLoggedIn) {
      if (freeCount >= FREE_LINK_LIMIT) {
        showUpgradeModal?.();
        return;
      }
      await saveAnonymous();
    } else {
      await saveAuthenticated();
    }
  }

  async function saveAnonymous() {
    setSaving(true);
    try {
      const res = await fetch("/api/anonymous-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          name: linkName,
          full_url: fullUrl,
          utm_source: effectiveSource || null,
          utm_medium: effectiveMedium || null,
          utm_campaign: effectiveCampaign || null,
        }),
      });
      const json = await res.json();
      if (json.error === "limit_reached") {
        showUpgradeModal?.();
        return;
      }
      if (!res.ok) throw new Error(json.error);

      const updated = [...JSON.parse(localStorage.getItem(FREE_LINKS_KEY) ?? "[]"), json.data];
      localStorage.setItem(FREE_LINKS_KEY, JSON.stringify(updated));
      setFreeCount(updated.length);
      toast.success("Link salvo!");
      onSaved?.();
    } catch {
      showLoginPrompt
        ? showLoginPrompt()
        : toast.error("Erro ao salvar link.");
    } finally {
      setSaving(false);
    }
  }

  async function saveAuthenticated() {
    setSaving(true);
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: linkName,
          base_url: baseUrl,
          utm_source: effectiveSource || null,
          utm_medium: effectiveMedium || null,
          utm_campaign: effectiveCampaign || null,
          utm_content: slugify(content) || null,
          utm_term: slugify(term) || null,
          full_url: fullUrl,
          client_id: clientId || null,
          folder_id: folderId || null,
          description: description.trim() || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast.success("Link salvo!");
      onSaved?.();
    } catch {
      toast.error("Erro ao salvar link.");
    } finally {
      setSaving(false);
    }
  }

  const saveLabel = isLoggedIn
    ? "Salvar link"
    : freeCount >= FREE_LINK_LIMIT
    ? "Limite atingido — Seja Pro"
    : `Salvar (${freeCount}/${FREE_LINK_LIMIT} grátis)`;

  return (
    <div className="flex flex-col gap-5">
      {/* URL de destino */}
      <Input
        label="URL de destino"
        hint="A página para onde o usuário será enviado (ex: https://seusite.com/oferta)"
        placeholder="https://seusite.com/pagina"
        value={baseUrl}
        onChange={(e) => {
          setBaseUrl(e.target.value);
          validateUrl(e.target.value);
        }}
        error={urlError}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* utm_source */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <label className="text-sm font-medium text-text">Fonte (utm_source)</label>
            <ParamTooltip {...PARAM_TOOLTIPS.utm_source} />
          </div>
          <Select
            options={[...SOURCE_PRESETS, { value: CUSTOM_VALUE, label: "Outro (digitar)..." }]}
            placeholder="Selecione a fonte"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
          {source === CUSTOM_VALUE && (
            <Input
              placeholder="ex: tiktok, linkedin"
              value={sourceCustom}
              onChange={(e) => setSourceCustom(e.target.value)}
            />
          )}
        </div>

        {/* utm_medium */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <label className="text-sm font-medium text-text">Mídia (utm_medium)</label>
            <ParamTooltip {...PARAM_TOOLTIPS.utm_medium} />
          </div>
          <Select
            options={[...MEDIUM_PRESETS, { value: CUSTOM_VALUE, label: "Outro (digitar)..." }]}
            placeholder="Selecione a mídia"
            value={medium}
            onChange={(e) => setMedium(e.target.value)}
          />
          {medium === CUSTOM_VALUE && (
            <Input
              placeholder="ex: influencer, podcast"
              value={mediumCustom}
              onChange={(e) => setMediumCustom(e.target.value)}
            />
          )}
        </div>
      </div>

      {/* utm_campaign */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <label className="text-sm font-medium text-text">Campanha (utm_campaign)</label>
          <ParamTooltip {...PARAM_TOOLTIPS.utm_campaign} />
        </div>
        <Input
          placeholder="ex: promo-junho"
          value={campaign}
          onChange={(e) => handleCampaignChange(e.target.value)}
          hint={effectiveCampaign && effectiveCampaign !== campaign ? `Será salvo como: ${effectiveCampaign}` : undefined}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* utm_content */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <label className="text-sm font-medium text-text">Conteúdo (opcional)</label>
            <ParamTooltip {...PARAM_TOOLTIPS.utm_content} />
          </div>
          <Input
            placeholder="ex: banner_topo, variante_a"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* utm_term */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <label className="text-sm font-medium text-text">Termo (opcional)</label>
            <ParamTooltip {...PARAM_TOOLTIPS.utm_term} />
          </div>
          <Input
            placeholder="ex: gestor_de_trafego"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Preview */}
      <URLPreview url={fullUrl} />

      {/* Descrição / Contexto */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <label className="text-sm font-medium text-text">Descrição / Contexto (opcional)</label>
          {suggestedDescription && description !== suggestedDescription && (
            <button
              type="button"
              onClick={applySuggestion}
              className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:text-brand-dark transition-colors"
              title="Usar sugestão automática"
            >
              <Sparkles className="w-3 h-3" />
              Usar sugestão
            </button>
          )}
        </div>
        <textarea
          className="w-full border border-border rounded-xl px-3 py-2.5 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand resize-none"
          rows={2}
          placeholder="Ex: Link enviado no grupo de WhatsApp dos talleres para a campanha da Expo Mecânicos no México"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setDescriptionTouched(true);
          }}
        />
        {suggestedDescription && !descriptionTouched && (
          <p className="text-xs text-muted">
            <Sparkles className="inline w-3 h-3 text-brand" /> Sugestão automática — você pode editar.
          </p>
        )}
      </div>

      {/* Salvar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
        <div className="flex-1">
          <Input
            label="Nome do link (para o histórico)"
            placeholder="ex: Black Friday — Meta Ads — Banner"
            value={linkName}
            onChange={(e) => setLinkName(e.target.value)}
          />
        </div>

        {isLoggedIn && clients.length > 0 && (
          <div className="w-full sm:w-48">
            <Select
              label="Cliente"
              options={clients.map((c) => ({ value: c.id, label: c.name }))}
              placeholder="Sem cliente"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            />
          </div>
        )}

        {isLoggedIn && folders.length > 0 && (
          <div className="w-full sm:w-48">
            <Select
              label="Pasta"
              options={folders.map((f) => ({ value: f.id, label: f.name }))}
              placeholder="Sem pasta"
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
            />
          </div>
        )}

        <Button
          onClick={handleSave}
          loading={saving}
          disabled={!canSave}
          size="lg"
          className="w-full sm:w-auto whitespace-nowrap"
          variant={freeCount >= FREE_LINK_LIMIT && !isLoggedIn ? "secondary" : "primary"}
        >
          {saveLabel}
        </Button>
      </div>

      {!isLoggedIn && freeCount > 0 && (
        <p className="text-xs text-muted text-center">
          {freeCount}/{FREE_LINK_LIMIT} links gratuitos salvos nesta sessão.{" "}
          <a href="/login" className="text-brand hover:underline font-medium">
            Entre para salvar ilimitados
          </a>
        </p>
      )}
    </div>
  );
}
