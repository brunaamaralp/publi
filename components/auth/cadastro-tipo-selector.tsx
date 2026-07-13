"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, LayoutDashboard, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/lib/auth-context";
import type { Usuario } from "@/lib/types/usuario";
import { cn } from "@/lib/utils";

const TIPOS = [
  {
    tipo: "influenciador" as const,
    titulo: "Sou influenciador",
    descricao:
      "Receba demandas compatíveis com seu perfil, negocie parcerias e acompanhe resultados.",
    icone: Sparkles,
    href: "/influenciador/cadastro",
  },
  {
    tipo: "empresa" as const,
    titulo: "Sou empresa",
    descricao:
      "Publique campanhas, encontre criadores e feche contratos com pagamento protegido.",
    icone: Building2,
    href: "/empresa/cadastro",
  },
  {
    tipo: "agencia" as const,
    titulo: "Sou agência",
    descricao:
      "Gerencie várias marcas-clientes com visão consolidada de demandas e resultados.",
    icone: LayoutDashboard,
    href: "/agencia/cadastro",
  },
] as const;

export function CadastroTipoSelector() {
  const router = useRouter();
  const { registrarTipo } = useAuth();

  function escolher(tipo: Usuario["tipo"], href: string) {
    registrarTipo(tipo);
    toast.success("Conta criada! Complete seu cadastro.");
    router.push(href);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1 lg:hidden">
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Criar conta
        </h1>
        <p className="text-texto-secundario text-sm font-normal">
          Escolha o tipo de conta. Você completará o perfil na próxima etapa.
        </p>
      </div>

      <ul className="space-y-3">
        {TIPOS.map((item) => (
          <li key={item.tipo}>
            <button
              type="button"
              onClick={() => escolher(item.tipo, item.href)}
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
        Já tem conta?{" "}
        <Link
          href="/login"
          className="text-lilas-escuro font-medium hover:text-verde-neon hover:underline"
        >
          Entrar
        </Link>
      </p>
    </div>
  );
}
