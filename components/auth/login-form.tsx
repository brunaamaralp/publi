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
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Entrar na Publi
        </h1>
        <p className="text-texto-secundario text-sm font-normal">
          Acesse sua conta para gerenciar campanhas e parcerias.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="secao-editavel space-y-4 ring-0">
        <div className="space-y-2">
          <Label htmlFor="login-email" className="font-normal">
            E-mail
          </Label>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="voce@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-cinza-200 bg-white"
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="login-senha" className="font-normal">
              Senha
            </Label>
            <Link
              href="/login/esqueci-senha"
              className="text-lilas-escuro text-xs font-medium hover:text-verde-neon hover:underline"
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
            className="border-cinza-200 bg-white"
            required
          />
        </div>
        <Button type="submit" variant="cta" className="w-full" disabled={enviando}>
          Entrar
        </Button>
      </form>

      <p className="text-texto-secundario text-center text-sm font-normal">
        Não tem conta?{" "}
        <Link
          href="/cadastro"
          className="text-lilas-escuro font-medium hover:text-verde-neon hover:underline"
        >
          Cadastre-se
        </Link>
      </p>

      <div className="rounded-card border border-lilas/40 bg-lilas-claro p-3 text-xs leading-relaxed">
        <p className="text-lilas-escuro font-semibold">Simulação</p>
        <p className="text-lilas-escuro/90 mt-1 font-normal">
          Qualquer e-mail e senha funcionam. Contas demo:{" "}
          <span className="font-data">influenciador@publi.app</span>,{" "}
          <span className="font-data">empresa@publi.app</span>,{" "}
          <span className="font-data">agencia@publi.app</span>,{" "}
          <span className="font-data">admin@publi.app</span>.
        </p>
      </div>
    </div>
  );
}
