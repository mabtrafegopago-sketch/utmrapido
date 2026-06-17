"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ToastContainer, toast } from "@/components/ui/Toast";
import { Logo } from "@/components/marketing/Logo";
import { LogIn } from "lucide-react";

export default function LoginClientePage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setLoading(true);
    try {
      const res = await fetch("/api/client-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Erro ao entrar");
        setLoading(false);
        return;
      }
      window.location.href = json.redirect ?? "/";
    } catch {
      toast.error("Erro ao entrar. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <>
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <a href="/" className="inline-flex items-center gap-2">
              <Logo variant="horizontal" size={28} />
            </a>
            <p className="text-muted mt-3 text-sm">
              Acesso ao portal de links UTM do seu cliente
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-border p-8 shadow-sm flex flex-col gap-5"
          >
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-brand-light text-brand flex items-center justify-center mb-3">
                <LogIn className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold text-text mb-1">Entrar no portal</h1>
              <p className="text-muted text-sm">
                Use o e-mail e senha fornecidos pelo seu gestor.
              </p>
            </div>

            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <Input
              label="Senha"
              type="password"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            <Button
              type="submit"
              size="lg"
              loading={loading}
              disabled={!email.trim() || !password}
              className="w-full"
            >
              Entrar
            </Button>

            <p className="text-xs text-muted text-center">
              É gestor?{" "}
              <a href="/login" className="text-brand hover:underline font-medium">
                Entrar como gestor
              </a>
            </p>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
