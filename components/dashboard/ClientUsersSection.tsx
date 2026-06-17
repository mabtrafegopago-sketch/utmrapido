"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "@/components/ui/Toast";
import { UserPlus, X, Trash2, Mail, KeyRound, Users } from "lucide-react";

interface ClientUser {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

interface Props {
  clientId: string;
  clientName: string;
}

export function ClientUsersSection({ clientId, clientName }: Props) {
  const [users, setUsers] = useState<ClientUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ClientUser | null>(null);
  const [passwordTarget, setPasswordTarget] = useState<ClientUser | null>(null);

  // Form add
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  // Form password reset
  const [newPassword, setNewPassword] = useState("");
  const [savingPwd, setSavingPwd] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/client-users?client_id=${clientId}`);
      const json = await res.json();
      setUsers(json.data ?? []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate() {
    if (!name.trim() || !email.trim() || password.length < 6) return;
    setSaving(true);
    try {
      const res = await fetch("/api/client-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: clientId,
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Erro ao criar usuário.");
        return;
      }
      toast.success("Usuário criado!");
      setUsers((prev) => [...prev, json.data]);
      setName(""); setEmail(""); setPassword("");
      setShowAdd(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/client-users?id=${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) {
        toast.error("Erro ao excluir.");
        return;
      }
      toast.success("Usuário removido.");
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  async function handlePasswordReset() {
    if (!passwordTarget || newPassword.length < 6) return;
    setSavingPwd(true);
    try {
      const res = await fetch("/api/client-users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: passwordTarget.id, password: newPassword }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Erro ao redefinir senha.");
        return;
      }
      toast.success("Senha redefinida!");
      setNewPassword("");
      setPasswordTarget(null);
    } finally {
      setSavingPwd(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-text flex items-center gap-2">
            <Users className="w-5 h-5 text-brand" />
            Usuários com acesso
          </h2>
          <p className="text-xs text-muted mt-0.5">
            Crie acessos para a equipe de {clientName} fazer login no portal.
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setShowAdd(true)}>
          <UserPlus className="w-4 h-4" />
          Novo usuário
        </Button>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-border p-4 h-20 animate-pulse" />
      ) : users.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted">
          <Users className="w-8 h-8 mx-auto text-muted mb-2" />
          Nenhum usuário com login criado ainda.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {users.map((u) => (
            <div
              key={u.id}
              className="bg-white rounded-xl border border-border p-3 flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-full bg-brand text-white text-sm font-bold flex items-center justify-center shrink-0">
                {u.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-text text-sm truncate">{u.name}</p>
                <p className="text-xs text-muted truncate flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {u.email}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => { setPasswordTarget(u); setNewPassword(""); }}
                  className="p-1.5 rounded-lg text-muted hover:text-brand hover:bg-brand-light transition-colors"
                  title="Redefinir senha"
                >
                  <KeyRound className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteTarget(u)}
                  className="p-1.5 rounded-lg text-muted hover:text-danger hover:bg-red-50 transition-colors"
                  title="Remover usuário"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add user */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-text">Novo usuário</h2>
              <button onClick={() => setShowAdd(false)} className="text-muted hover:text-text p-1 rounded-lg hover:bg-gray-100">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-muted">
              Esse usuário poderá entrar em <strong>/login-cliente</strong> e ver apenas o portal de {clientName}.
            </p>
            <Input
              label="Nome *"
              placeholder="ex: João Silva"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="E-mail *"
              type="email"
              placeholder="joao@cliente.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Senha (mínimo 6 caracteres) *"
              type="text"
              placeholder="senha temporária"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              hint="Envie esta senha para o usuário. Ele pode trocar depois solicitando para você."
            />
            <div className="flex gap-3 mt-1">
              <Button variant="secondary" className="flex-1" onClick={() => setShowAdd(false)}>
                Cancelar
              </Button>
              <Button
                className="flex-1"
                loading={saving}
                disabled={!name.trim() || !email.trim() || password.length < 6}
                onClick={handleCreate}
              >
                Criar acesso
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Reset password */}
      {passwordTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setPasswordTarget(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-text">Redefinir senha</h2>
              <button onClick={() => setPasswordTarget(null)} className="text-muted hover:text-text p-1 rounded-lg hover:bg-gray-100">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-muted">
              Nova senha para <strong>{passwordTarget.name}</strong> ({passwordTarget.email})
            </p>
            <Input
              label="Nova senha (mínimo 6 caracteres)"
              type="text"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <div className="flex gap-3 mt-1">
              <Button variant="secondary" className="flex-1" onClick={() => setPasswordTarget(null)}>
                Cancelar
              </Button>
              <Button
                className="flex-1"
                loading={savingPwd}
                disabled={newPassword.length < 6}
                onClick={handlePasswordReset}
              >
                Redefinir
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Delete */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setDeleteTarget(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 flex flex-col gap-5" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-red-50 text-danger flex items-center justify-center mb-3">
                <Trash2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-text mb-2">Remover acesso?</h2>
              <p className="text-muted text-sm">
                <strong>{deleteTarget.name}</strong> não conseguirá mais entrar no portal.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setDeleteTarget(null)}>
                Cancelar
              </Button>
              <Button variant="danger" className="flex-1" loading={deleting} onClick={handleDelete}>
                Remover
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
