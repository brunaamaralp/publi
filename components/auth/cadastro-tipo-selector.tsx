"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, LayoutDashboard, Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Criar conta
        </h1>
        <p className="text-muted-foreground text-sm">
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
              <Card
                className={cn(
                  "transition-colors hover:border-primary/40 hover:bg-accent/40",
                  "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
                )}
              >
                <CardHeader className="flex-row items-start gap-4">
                  <div className="bg-accent text-primary flex size-11 shrink-0 items-center justify-center rounded-button">
                    <item.icone className="size-5" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base">{item.titulo}</CardTitle>
                    <CardDescription className="mt-1 leading-relaxed">
                      {item.descricao}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </button>
          </li>
        ))}
      </ul>

      <p className="text-muted-foreground text-center text-sm">
        Já tem conta?{" "}
        <Link href="/login" className="text-primary font-medium hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
