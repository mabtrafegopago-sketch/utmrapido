"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ClientCard } from "@/components/dashboard/ClientCard";
import { ToastContainer, toast } from "@/components/ui/Toast";

const COLOR_PRESETS = ["#534AB7", "#0F6E56", "#BA7517", "#D85A30", "#1E40AF", "#9333EA", "#0891B2"];

interface Client {
  id: string;
  name: string;
  email: string | null;
  color: string;
  access_token: string;
  created_at: string;
  utm_links: { count: number }[];
}

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", color: "#534AB7" });

  const fetchClients = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/clients");
    const json = await res.json();
    setClients(json.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  async function createClient() {
    if (!form.name.trim()) return;
    setCreating(true);
    const res = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    if (res.ok) {
      toast.success("Cliente criado!");
      setShowModal(false);
      setForm({ name: "", email: "", color: "#534AB7" });
      fetchClients();
    } else {
      toast.error(json.error ?? "Erro ao criar cliente.");
    }
    setCreating(false);
  }

  async function deleteClient(id: string) {
    if (!confirm("Excluir este cliente? Os links dele continuarão existindo sem associação.")) return;
    const res = await fetch(`/api/clients?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Cliente removido.");
      setClients((prev) => prev.filter((c) => c.id !== id));
    } else {
      toast.error("Erro ao excluir cliente.");
    }
  }

  return (
    <>
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text mb-1">Clientes</h1>
            <p className="text-muted text-sm">{clients.length} cliente{clients.length !== 1 ? "s" : ""} cadastrado{clients.length !== 1 ? "s" : ""}</p>
          </div>
          <Button onClick={() => setShowModal(true)}>+ Novo cliente</Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-border p-5 h-32 animate-pulse" />
            ))}
          </div>
        ) : clients.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border p-12 text-center">
            <p className="text-4xl mb-3">👥</p>
            <p className="font-semibold text-text mb-2">Nenhum cliente ainda</p>
            <p className="text-muted text-sm mb-6">Crie um cliente para organizar seus links por conta.</p>
            <Button onClick={() => setShowModal(true)}>Criar primeiro cliente</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {clients.map((c) => (
              <ClientCard
                key={c.id}
                id={c.id}
                name={c.name}
                email={c.email}
                color={c.color}
                accessToken={c.access_token}
                linkCount={c.utm_links?.[0]?.count ?? 0}
                onDelete={deleteClient}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal novo cliente */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 flex flex-col gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-text">Novo cliente</h2>

            <Input
              label="Nome do cliente *"
              placeholder="ex: Loja da Maria"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />

            <Input
              label="E-mail (opcional)"
              type="email"
              placeholder="cliente@email.com"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />

            <div>
              <label className="text-sm font-medium text-text block mb-2">Cor do cliente</label>
              <div className="flex gap-2 flex-wrap">
                {COLOR_PRESETS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setForm((f) => ({ ...f, color }))}
                    className={`w-8 h-8 rounded-lg transition-all ${form.color === color ? "ring-2 ring-offset-2 ring-brand scale-110" : ""}`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button className="flex-1" loading={creating} onClick={createClient} disabled={!form.name.trim()}>
                Criar cliente
              </Button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </>
  );
}
