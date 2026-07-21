"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, ChevronLeft, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import type { Usuario } from "@/lib/types/usuario";
import { cn } from "@/lib/utils";

const PAPEIS_LOGIN = [
  {
    tipo: "empresa" as const,
    titulo: "Sou empresa",
    descricao:
      "Acesse campanhas, publique demandas e acompanhe contratos e resultados.",
    icone: Building2,
  },
  {
    tipo: "influenciador" as const,
    titulo: "Sou influencer / creator",
    descricao:
      "Veja demandas compatíveis, negocie parcerias e gerencie seu financeiro.",
    icone: Sparkles,
  },
] as const;

export function LoginForm() {
  const router = useRouter();
  const { login, usuario, isLoading } = useAuth();
  const [papel, setPapel] = useState<Usuario["tipo"] | null>(null);
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
    if (!papel) {
      toast.error("Escolha se você é empresa ou influencer.");
      return;
    }
    if (!email.trim()) {
      toast.error("Informe seu e-mail.");
      return;
    }
    setEnviando(true);
    login(email, senha, papel);
    toast.success("Login realizado!");
    router.replace("/inicio");
    setEnviando(false);
  }

  if (!papel) {
    return (
      <div className="space-y-6">
        <div className="space-y-1 lg:hidden">
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Entrar na Publi
          </h1>
          <p className="text-texto-secundario text-sm font-normal">
            Escolha o tipo de conta para acessar as telas corretas.
          </p>
        </div>

        <ul className="space-y-3">
          {PAPEIS_LOGIN.map((item) => (
            <li key={item.tipo}>
              <button
                type="button"
                onClick={() => setPapel(item.tipo)}
                className="w-full text-left"
              >
                <div
                  className={cn(
                    "card-marketing flex items-start gap-4 p-4 transition-colors",
                    "hover:border-verde-neon/50 focus-visible:border-verde-neon focus-visible:ring-2 focus-visible:ring-verde-neon/20 focus-visible:outline-none",
                  )}
                >
                  <div className="icone-marca size-11 shrink-0">
                    <item.icone className="size-5" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display font-bold">{item.titulo}</p>
                    <p className="text-texto-secundario mt-1 text-sm leading-relaxed font-normal">
                      {item.descricao}
                    </p>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>

        <p className="text-texto-secundario text-center text-sm font-normal">
          Não tem conta?{" "}
          <Link
            href="/cadastro"
            className="text-lilas-escuro font-medium hover:text-verde-neon hover:underline"
          >
            Cadastre-se
          </Link>
        </p>
      </div>
    );
  }

  const rotuloPapel =
    papel === "empresa" ? "empresa" : "influencer / creator";

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <button
          type="button"
          onClick={() => setPapel(null)}
          className="text-texto-secundario hover:text-lilas-escuro mb-2 inline-flex items-center gap-1 text-xs font-medium"
        >
          <ChevronLeft className="size-3.5" aria-hidden />
          Trocar tipo de conta
        </button>
        <h1 className="font-display text-2xl font-bold tracking-tight lg:text-xl">
          Entrar como {rotuloPapel}
        </h1>
        <p className="text-texto-secundario text-sm font-normal">
          Qualquer e-mail e senha funcionam nesta simulação.
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
          O tipo escolhido define quais telas você vê. Contas demo ainda
          funcionam:{" "}
          <span className="font-data">empresa@publi.app</span>,{" "}
          <span className="font-data">influenciador@publi.app</span>.
        </p>
      </div>
    </div>
  );
}
