"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BarChart3,
  Building2,
  PlusCircle,
  Search,
} from "lucide-react";

import { BannerAcessoLeitura } from "@/components/agencia/banner-acesso-leitura";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { useAgencia } from "@/lib/contexts/agencia-context";
import { obterResumoEmpresaCliente } from "@/lib/agencia/dashboard-utils";
import { resolverModoAcesso } from "@/lib/agencia/modo-acesso";
import { formatarMoeda } from "@/lib/influenciador/cadastro-utils";
import { cn } from "@/lib/utils";

export function WorkspaceClienteAgencia() {
  const params = useParams<{ empresaId: string }>();
  const router = useRouter();
  const { empresasClientes, setEmpresaAtivaId } = useAgencia();

  const empresa = empresasClientes.find((e) => e.id === params.empresaId);
  const modo = empresa ? resolverModoAcesso(empresa) : null;
  const podeEditar = modo === "edicao";

  useEffect(() => {
    if (empresa) setEmpresaAtivaId(empresa.id);
  }, [empresa, setEmpresaAtivaId]);

  if (!empresa) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-12 text-center sm:px-6">
        <p className="text-muted-foreground text-sm">
          Cliente não encontrado no portfólio da agência.
        </p>
        <Link
          href="/agencia/clientes"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Voltar aos clientes
        </Link>
      </div>
    );
  }

  const nome = empresa.nomeFantasia ?? empresa.razaoSocial;
  const resumo = obterResumoEmpresaCliente(empresa.id);

  const atalhos = [
    {
      href: "/agencia/demandas",
      titulo: "Campanhas",
      descricao: "Ver e gerenciar demandas deste cliente",
      icone: Building2,
      edicao: false,
    },
    {
      href: "/agencia/demandas/nova",
      titulo: "Nova campanha",
      descricao: "Publicar demanda em nome do cliente",
      icone: PlusCircle,
      edicao: true,
    },
    {
      href: "/agencia/buscar-creators",
      titulo: "Buscar creators",
      descricao: "Convidar influenciadores às campanhas",
      icone: Search,
      edicao: true,
    },
    {
      href: "/agencia/resultados",
      titulo: "Resultados",
      descricao: "Métricas das campanhas concluídas",
      icone: BarChart3,
      edicao: false,
    },
  ] as const;

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6">
      <div>
        <Link
          href="/agencia/clientes"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "-ml-2 mb-4 w-fit",
          )}
        >
          <ArrowLeft className="size-4" aria-hidden />
          Todos os clientes
        </Link>

        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">
              {podeEditar ? "Edição" : "Somente leitura"}
            </Badge>
            {empresa.criadaPelaAgencia ? (
              <Badge variant="outline">Criado pela agência</Badge>
            ) : (
              <Badge variant="outline">Vinculado</Badge>
            )}
          </div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            {nome}
          </h1>
          <p className="text-muted-foreground text-sm">
            {empresa.razaoSocial}
            <span className="text-cinza-400"> · </span>
            {empresa.segmento}
          </p>
        </header>
      </div>

      {!podeEditar ? <BannerAcessoLeitura nomeCliente={nome} /> : null}

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <ResumoCard
          label="Demandas ativas"
          valor={String(resumo.demandasAtivas)}
        />
        <ResumoCard
          label="Contratos em andamento"
          valor={String(resumo.contratosAndamento)}
        />
        <ResumoCard
          label="Investido no mês"
          valor={formatarMoeda(resumo.investidoMes)}
          className="col-span-2 sm:col-span-1"
        />
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold">Operações</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {atalhos.map((item) => {
            const bloqueado = item.edicao && !podeEditar;
            const Icone = item.icone;
            if (bloqueado) {
              return (
                <li key={item.href}>
                  <div className="rounded-card border border-dashed p-4 opacity-60">
                    <Icone className="text-muted-foreground mb-2 size-4" />
                    <p className="font-medium">{item.titulo}</p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      Disponível apenas em clientes com permissão de edição.
                    </p>
                  </div>
                </li>
              );
            }
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setEmpresaAtivaId(empresa.id)}
                  className="hover:border-primary/40 block rounded-card border p-4 transition-colors"
                >
                  <Icone className="text-muted-foreground mb-2 size-4" />
                  <p className="font-medium">{item.titulo}</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {item.descricao}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <button
        type="button"
        className="text-muted-foreground hover:text-foreground text-sm underline-offset-2 hover:underline"
        onClick={() => router.push("/agencia/dashboard")}
      >
        Voltar ao painel consolidado
      </button>
    </div>
  );
}

function ResumoCard({
  label,
  valor,
  className,
}: {
  label: string;
  valor: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-card border bg-card p-4", className)}>
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="font-data mt-1 text-xl font-semibold">{valor}</p>
    </div>
  );
}
