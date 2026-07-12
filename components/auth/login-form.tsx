"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";

export function LoginForm() {
  const router = useRouter();
  const { login, usuario, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!isLoading && usuario) {
      router.replace("/inicio");
    }
  }, [isLoading, usuario, router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Informe seu e-mail.");
      return;
    }
    setEnviando(true);
    login(email, senha);
    toast.success("Login realizado!");
    router.replace("/inicio");
    setEnviando(false);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1 lg:hidden">
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Entrar na Publi
        </h1>
        <p className="text-muted-foreground text-sm">
          Acesse sua conta para gerenciar campanhas e parcerias.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="login-email">E-mail</Label>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="voce@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="login-senha">Senha</Label>
            <Link
              href="/login/esqueci-senha"
              className="text-primary text-xs hover:underline"
            >
              Esqueci minha senha
            </Link>
          </div>
          <Input
            id="login-senha"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={enviando}>
          Entrar
        </Button>
      </form>

      <p className="text-muted-foreground text-center text-sm">
        Não tem conta?{" "}
        <Link href="/cadastro" className="text-primary font-medium hover:underline">
          Cadastre-se
        </Link>
      </p>

      <div className="banner-informativo rounded-card p-3 text-xs leading-relaxed">
        <p className="font-medium">Simulação</p>
        <p className="text-muted-foreground mt-1">
          Qualquer e-mail e senha funcionam. Contas demo:{" "}
          <span className="font-data">influenciador@publi.app</span>,{" "}
          <span className="font-data">empresa@publi.app</span>,{" "}
          <span className="font-data">agencia@publi.app</span>.
        </p>
      </div>
    </div>
  );
}
